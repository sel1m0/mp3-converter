import FileConverter from '@/components/FileConverter';

export default function Home() {
  return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            MP4 zu MP3 Converter
          </h1>
          <p className="text-center text-gray-400 mb-12">
            Konvertiere deine MP4 Videos schnell und einfach zu MP3 Audio
          </p>

          <FileConverter />

          <div className="mt-12 text-center text-sm text-gray-500">
            <p>Unterstützte Formate: MP4, M4A, MPEG4</p>
            <p>Maximale Dateigröße: 500MB</p>
          </div>
        </div>
      </main>
  );
}