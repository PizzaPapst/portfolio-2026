# Stage 1: Build der Vite React App
FROM node:20-alpine AS builder

WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY package*.json ./
RUN npm ci

# Source-Code kopieren und Produktions-Bundle bauen
COPY . .
RUN npm run build

# Stage 2: Schlankes Nginx zum Ausliefern
FROM nginx:alpine

# Eigene Nginx-Konfiguration einbinden (wichtig für React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Gebautes Frontend kopieren
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
