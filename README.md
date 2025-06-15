# 🎵 MP4 to MP3 Converter

A server-based tool to convert `.mp4` video files into `.mp3` audio.  
This service is intended for personal, legal use only.

Ein serverbasiertes Tool, um `.mp4`-Videodateien in `.mp3`-Audiodateien umzuwandeln.  
Dieses Tool ist ausschließlich für persönliche, rechtmäßige Nutzung gedacht.

---

## 🌐 Website Version

The converter is hosted and available via a web interface.  
Users do **not** need to install ffmpeg or any other tools.

Der Konverter wird über eine Weboberfläche bereitgestellt.  
Nutzer müssen **kein** ffmpeg oder andere Software installieren.

---

## ⚠️ Disclaimer / Hinweis

> **ENGLISH**  
This tool is only intended for converting media for which you have full rights or permission to process.  
Do not use this service to convert or extract copyrighted content (e.g. from YouTube, Netflix, etc.).  
The operator of this service assumes no responsibility for any misuse.

> **DEUTSCH**  
Dieses Tool darf nur für die Konvertierung von Medien genutzt werden, für die Sie vollständige Rechte besitzen.  
Bitte nutzen Sie diesen Dienst nicht, um urheberrechtlich geschützte Inhalte zu extrahieren (z. B. von YouTube, Netflix usw.).  
Der Betreiber übernimmt keine Haftung für eine missbräuchliche Nutzung.

---

## 🧰 Technologies Used

- Node.js + Express
- fluent-ffmpeg
- Multer
- ffmpeg (installed server-side)

---

## 📦 Setup (Development)

```bash
git clone [private repo URL]
cd my-mp3-converter
npm install
# ffmpeg must be installed and available in PATH
node server.js
