import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import cors from 'cors';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3001;

// CORS für Next.js Frontend
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Body parser
app.use(express.json());

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Erstelle Upload/Output Ordner
const uploadDir = path.join(__dirname, 'uploads');
const outputDir = path.join(__dirname, 'outputs');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// Multer Konfiguration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        console.log('File mimetype:', file.mimetype);
        console.log('File name:', file.originalname);

        const allowedMimetypes = ['video/mp4', 'audio/mp4', 'video/x-m4v', 'audio/x-m4a'];
        const allowedExtensions = /\.(mp4|m4a|mpeg4)$/i;

        const mimetypeOk = allowedMimetypes.includes(file.mimetype);
        const extnameOk = allowedExtensions.test(file.originalname);

        if (mimetypeOk || extnameOk) {
            return cb(null, true);
        } else {
            cb(new Error(`Dateityp nicht erlaubt: ${file.mimetype}`));
        }
    },
    limits: { fileSize: 500 * 1024 * 1024 }
});

// Test Endpoint
app.post('/api/test', (req: Request, res: Response) => {
    res.json({ message: 'API funktioniert!' });
});

// Konvertierungs-Endpoint
app.post('/api/convert', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
    console.log("Convert endpoint erreicht");
    console.log("File:", req.file);

    if (!req.file) {
        res.status(400).json({ error: 'Keine Datei hochgeladen' });
        return;
    }

    const inputPath = req.file.path;
    const outputName = `${path.parse(req.file.filename).name}.mp3`;
    const outputPath = path.join(outputDir, outputName);

    try {
        // FFmpeg Konvertierung
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .toFormat('mp3')
                .audioCodec('libmp3lame')
                .audioBitrate('192k')
                .on('start', (cmd) => {
                    console.log('FFmpeg Prozess gestartet:', cmd);
                })
                .on('progress', (progress) => {
                    console.log(`Fortschritt: ${progress.percent}%`);
                })
                .on('end', () => {
                    console.log('Konvertierung abgeschlossen');
                    resolve(true);
                })
                .on('error', (err) => {
                    console.error('FFmpeg Fehler:', err);
                    reject(err);
                })
                .save(outputPath);
        });

        // Sende die konvertierte Datei
        res.download(outputPath, outputName, (err) => {
            // Cleanup: Lösche temporäre Dateien
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

            if (err) {
                console.error('Download Fehler:', err);
            }
        });

    } catch (error) {
        // Cleanup bei Fehler
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

        console.error('Konvertierungsfehler:', error);
        res.status(500).json({ error: 'Konvertierung fehlgeschlagen' });
    }
});

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Server läuft' });
});

// Error handling middleware - MUSS am Ende sein!
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     if (err instanceof multer.MulterError) {
//         if (err.code === 'LIMIT_FILE_SIZE') {
//             return res.status(400).json({ error: 'Datei ist zu groß!' });
//         }
//         return res.status(400).json({ error: err.message });
//     } else if (err) {
//         console.error('Server Error:', err);
//         return res.status(400).json({ error: err.message });
//     }
//     next();
// });

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
    console.log('Test die API mit: curl http://localhost:3001/api/health');
});