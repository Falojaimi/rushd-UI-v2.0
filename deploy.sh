#!/bin/bash
echo "🚀 Starting Rushd deployment..."

# Go to the app directory
cd /var/www/rushd || exit

# Pull latest code
git pull origin main

# Install dependencies (if any new)
npm install --omit=dev

# Build the app
npm run build

# Restart PM2 process
pm2 restart rushd

echo "✅ Rushd deployment complete!"
