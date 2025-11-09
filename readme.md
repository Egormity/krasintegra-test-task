## Info

Express.js бекенд на TypeScript с Prisma ORM и Sqlite3 для TODO приложения.

Пример коллекции Postman запросов в json файле.

## Setup

### .env - пример переменных

```bash
PORT=5000
NODE_ENV=development
DATABASE_URL=file:./dev.db
```

### Code

```bash
(npm i -g pnpm) - Установка pnpm, если не имеется

# Установка зависимостей
pnpm i

# Генерация Prisma клиента
pnpm run prisma:generate

# Дев синхронизация призмы с бд
pnpm run prisma:db-push

# Запуск
pnpm run dev
```
"# krasintegra-test-task" 
