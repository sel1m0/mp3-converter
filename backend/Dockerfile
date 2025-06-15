FROM node:18-slim

# FFmpeg installieren
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Dependencies installieren
COPY package*.json ./
RUN npm ci --only=production

# Source code kopieren
COPY . .

# TypeScript kompilieren
RUN npm run build

# Port exponieren
EXPOSE 3001

# App starten (verwendet dein existierendes npm start)
CMD ["npm", "start"]