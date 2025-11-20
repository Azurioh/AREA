# Build
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json ./
COPY packages ./packages
COPY apps/frontend /app/apps/frontend/

RUN npm install

WORKDIR /app/apps/frontend

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

RUN npm run build

# Runtime
FROM nginx:alpine AS runner

COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
