#!/bin/bash
# =============================================================================
# Nemesis Studio VPS Deployment Script
# SumoPod Ubuntu 24.04 - Singapore
# =============================================================================

echo "🚀 Starting Nemesis Studio Deployment..."

# Update system
echo "📦 Updating system..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "📦 Installing essential packages..."
sudo apt install -y curl wget git unzip build-essential

# Install Node.js 20 LTS
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js
node -v
npm -v

# Install Chrome dependencies for Playwright
echo "📦 Installing Chrome dependencies..."
sudo apt install -y \
  libnss3 \
  libnspr4 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libdbus-1-3 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libpango-1.0-0 \
  libcairo2 \
  libatspi2.0-0 \
  libgtk-3-0 \
  fonts-liberation \
  xdg-utils

# Install Xvfb (Virtual Display) untuk headless browser
echo "📦 Installing Xvfb..."
sudo apt install -y xvfb x11vnc fluxbox

# Install noVNC untuk akses browser via web
echo "📦 Installing noVNC..."
sudo apt install -y novnc websockify

# Create app directory
echo "📁 Creating app directory..."
sudo mkdir -p /opt/nemesis-studio
sudo chown ubuntu:ubuntu /opt/nemesis-studio
cd /opt/nemesis-studio

echo "✅ Base installation complete!"
