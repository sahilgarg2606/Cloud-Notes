FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app .

# Expose application port
EXPOSE 3000

# Run the application
CMD ["node", "src/app.js"]