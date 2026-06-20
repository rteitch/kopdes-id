#!/bin/sh
set -e

echo "🔄 Running Prisma migrations..."
npx prisma db push --skip-generate

echo "✅ Database ready!"
echo "🚀 Starting kopdes.id..."

exec node server.js