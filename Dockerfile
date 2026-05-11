FROM oven/bun:1 AS build

WORKDIR /app

COPY package.json package-lock.json* bun.lockb* ./
RUN if [ -f bun.lockb ]; then bun install --frozen-lockfile; else bun install; fi

COPY . .
RUN bun run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
