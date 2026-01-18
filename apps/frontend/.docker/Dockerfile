# Build
FROM node:22-alpine AS builder
WORKDIR /app

# Workspace files
COPY package.json ./
COPY pnpm-*.yaml ./
COPY packages ./packages
COPY apps/frontend ./apps/frontend

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Build shared package
WORKDIR /app/packages/shared
RUN pnpm run build

# Build frontend
WORKDIR /app/apps/frontend

ARG VITE_BACKEND_URL
ARG VITE_BASE_IMAGE_URL
ARG NODE_ENV=production

ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_BASE_IMAGE_URL=${VITE_BASE_IMAGE_URL}
ENV NODE_ENV=${NODE_ENV}

RUN pnpm run build

# Runtime
FROM nginx:alpine

COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY --from=builder /app/apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
