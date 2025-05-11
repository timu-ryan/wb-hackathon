# Шаг сборки
FROM node:18-alpine AS builder

WORKDIR /app

# 1. Сначала копируем только файлы, необходимые для установки зависимостей
COPY package.json package-lock.json* ./

# 2. Чистим кэш и устанавливаем зависимости
RUN npm ci --no-cache || (rm -rf node_modules && npm install)

# 3. Копируем остальные файлы только после установки зависимостей
COPY . .

# 4. Сборка проекта
RUN npm run build

# Шаг выполнения
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.ts ./next.config.ts

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["npm", "start"]