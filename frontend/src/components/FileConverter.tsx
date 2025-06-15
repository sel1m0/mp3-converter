'use client';

import { useState, useRef } from 'react';
import axios from 'axios';

interface ConversionStatus {
    loading: boolean;
    error: string | null;
    success: boolean;
}

export default function FileConverter() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [status, setStatus] = useState<ConversionStatus>({
        loading: false,
        error: null,
        success: false
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['video/mp4', 'audio/mp4', 'video/mpeg4'];
            if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.mp4')) {
                setStatus({ loading: false, error: 'Bitte wähle eine MP4 Datei aus!', success: false });
                return;
            }
            setSelectedFile(file);
            setStatus({ loading: false, error: null, success: false });
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const validTypes = ['video/mp4', 'audio/mp4', 'video/mpeg4'];
            if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.mp4')) {
                setStatus({ loading: false, error: 'Bitte wähle eine MP4 Datei aus!', success: false });
                return;
            }
            setSelectedFile(file);
            setStatus({ loading: false, error: null, success: false });
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const convertFile = async () => {
        if (!selectedFile) return;

        setStatus({ loading: true, error: null, success: false });

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post(process.env.FRONTEND_URL || 'https://mp3-converter-taupe.vercel.app/', formData, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    console.log(`Upload: ${percentCompleted}%`);
                },
            });

            // Download der konvertierten Datei
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', selectedFile.name.replace(/\.[^/.]+$/, '') + '.mp3');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setStatus({ loading: false, error: null, success: true });
            setTimeout(() => {
                setStatus({ loading: false, error: null, success: false });
            }, 3000);

        } catch (error) {
            console.error('Konvertierungsfehler:', error);
            setStatus({
                loading: false,
                error: 'Konvertierung fehlgeschlagen. Stelle sicher, dass der Backend-Server läuft!',
                success: false
            });
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="max-w-md mx-auto">
            <div
                className="border-2 border-dashed border-purple-400 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <div className="text-6xl mb-4">📁</div>
                <p className="text-gray-300 mb-2">
                    Klicke hier oder ziehe deine MP4-Datei hierher
                </p>
                <p className="text-sm text-gray-500">
                    Max. 500MB
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".mp4,.m4a,.mpeg4"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {selectedFile && (
                <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-400">Ausgewählte Datei:</p>
                    <p className="font-semibold text-purple-400">{selectedFile.name}</p>
                    <p className="text-sm text-gray-400">{formatFileSize(selectedFile.size)}</p>
                </div>
            )}

            {selectedFile && (
                <button
                    onClick={convertFile}
                    disabled={status.loading}
                    className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-all ${
                        status.loading
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                    }`}
                >
                    {status.loading ? 'Konvertiere...' : 'In MP3 konvertieren'}
                </button>
            )}

            {status.error && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
                    {status.error}
                </div>
            )}

            {status.success && (
                <div className="mt-4 p-4 bg-green-900/20 border border-green-500 rounded-lg text-green-400">
                    Konvertierung erfolgreich! 🎉
                </div>
            )}
        </div>
    );
}