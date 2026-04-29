FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN node ace build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/build ./
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev
EXPOSE 3333
CMD ["node", "bin/server.js"]