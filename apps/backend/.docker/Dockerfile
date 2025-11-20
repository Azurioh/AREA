FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./
COPY packages ./packages
COPY apps/backend/package*.json ./apps/backend/

RUN npm ci

COPY apps/backend ./apps/backend

FROM base AS builder

COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend

RUN npm run build

FROM base AS development

COPY apps/backend /app/apps

EXPOSE ${PORT}

WORKDIR /app/apps/backend

CMD ["npm", "run", "dev"]

FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY packages ./packages
COPY apps/backend/package*.json ./apps/backend/
COPY apps/backend/tsconfig.json ./apps/backend/

RUN npm ci --only=production

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

WORKDIR /app/apps/backend

EXPOSE ${PORT}

CMD ["npm", "start"]
