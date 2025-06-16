# backend/Dockerfile

# Etapa 1: Build
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build   # asume que esto compila TypeScript a dist/

# Etapa 2: Runtime
FROM node:18

WORKDIR /app

# Solo copiamos los archivos necesarios
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm install --production

EXPOSE 3001

# Ejecuta la app desde dist (ya compilada)
CMD ["node", "dist/main.js"]   # o el archivo real que uses
