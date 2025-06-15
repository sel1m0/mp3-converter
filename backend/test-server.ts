import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

// Logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'Server läuft!' });
});

// Test POST Route
app.post('/api/convert', (req, res) => {
    console.log('POST /api/convert wurde aufgerufen!');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    res.json({ message: 'Convert endpoint funktioniert!' });
});

app.listen(PORT, () => {
    console.log(`Test-Server läuft auf http://localhost:${PORT}`);
    console.log('Verfügbare Routes:');
    console.log('GET  http://localhost:3001/');
    console.log('POST http://localhost:3001/api/convert');
});