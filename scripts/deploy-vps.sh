#!/usr/bin/env bash
# ==============================================================================
# AiBotCall - Hostinger VPS Automated Production Deployment Script
# ==============================================================================

set -e

echo "=================================================================="
echo "🚀 Deploying AiBotCall (AI Voice Calls & Smart Automation)"
echo "=================================================================="

# Check for Docker and Docker Compose
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed. Please install Docker first: curl -fsSL https://get.docker.com | sh"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed."
    exit 1
fi

# Ensure .env exists
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo "⚠️ .env file not found. Copying from .env.example..."
        cp .env.example .env
        echo "👉 Please edit .env with your real OPENAI_API_KEY, EXOTEL credentials, and domain names."
    else
        echo "❌ Error: Neither .env nor .env.example found."
        exit 1
    fi
fi

echo "📦 1. Building and starting production Docker containers..."
docker compose down --remove-orphans || true
docker compose up -d --build

echo "⏳ 2. Waiting for database to initialize (10s)..."
sleep 10

echo "🗄️ 3. Running database migrations..."
docker compose exec -T app npx prisma migrate deploy

echo "🌱 4. Seeding default data (Admin, Quick Art Academy, Voice Agent Ritu, Knowledge Base)..."
docker compose exec -T app npx tsx prisma/seed.ts || echo "Seed already applied or skipped."

echo "🔍 5. Verifying system health..."
sleep 2
HEALTH_STATUS=$(docker compose exec -T app wget -qO- http://localhost:4000/health || echo "FAILED")

echo "=================================================================="
echo "✅ AiBotCall Platform successfully deployed!"
echo "=================================================================="
echo "Health Status: $HEALTH_STATUS"
echo ""
echo "Access Points:"
echo " - Admin Dashboard: https://yourdomain.com"
echo " - Lead Ingestion Webhook: https://yourdomain.com/api/v1/webhooks/leads"
echo " - Exotel Status Callback: https://yourdomain.com/api/v1/webhooks/exotel/status"
echo " - Voice WebSocket Stream: wss://yourdomain.com/exotel/media"
echo ""
echo "Default Admin Credentials:"
echo " Email: admin@aibotcall.com"
echo " Password: admin123456"
echo "=================================================================="
