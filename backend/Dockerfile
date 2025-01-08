# backend/Dockerfile
FROM node:23.5.0-bookworm

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 9000
CMD ["node", "src/index.js"]