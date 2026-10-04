#!/usr/bin/env bash
# ==============================================================================
# AiBotCall Automated Production Deployment Script
# Target Host: Ubuntu 24.04 LTS (Hostinger KVM VPS)
# Domain: voice.aibotflow.in
# ==============================================================================

set -e

echo "🚀 Starting AiBotCall Production Deployment on voice.aibotflow.in..."

# 1. Update system & install Node.js 20 LTS, Nginx, PM2, Git, Certbot if missing
echo "📦 Verifying system packages..."
sudo apt update -y
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx

if ! command -v node &> /dev/null; then
    echo "⚡ Installing Node.js 20.x LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
    echo "⚡ Installing PM2 process manager globally..."
    sudo npm install -g pm2
fi

# 2. Build Backend
echo "🔨 Building Backend..."
cd backend
npm install --legacy-peer-deps
npx prisma generate
npm run build
cd ..

# 3. Build Frontend SPA
echo "🎨 Building Frontend..."
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..

# 4. Copy Nginx Configuration
echo "🌐 Configuring Nginx reverse proxy for voice.aibotflow.in..."
sudo cp nginx/voice.aibotflow.in.conf /etc/nginx/sites-available/voice.aibotflow.in.conf
sudo ln -sf /etc/nginx/sites-available/voice.aibotflow.in.conf /etc/nginx/sites-enabled/

# Test Nginx syntax
sudo nginx -t
sudo systemctl reload nginx

# 5. Start/Restart services via PM2
echo "⚡ Starting background microservices via PM2..."
pm2 startOrReload ecosystem.config.cjs
pm2 save

echo ""
echo "================================================================================"
echo "✅ AiBotCall successfully deployed on voice.aibotflow.in!"
echo "================================================================================"
echo "Next Step: Run Certbot to activate Free SSL HTTPS & WSS:"
echo "sudo certbot --nginx -d voice.aibotflow.in"
echo "================================================================================"
