FROM node:18-slim

# FFmpeg installieren
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Dependencies installieren (inklusive devDependencies für Build)
COPY package*.json ./
RUN npm ci

# Source code kopieren
COPY . .

# TypeScript kompilieren
RUN npm run build

# DevDependencies nach Build entfernen (optional, spart Platz)
RUN npm prune --production

# Port exponieren
EXPOSE 3001

# App starten
CMD ["npm", "start"]