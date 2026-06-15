@echo off
REM =============================================================================
REM Nemesis Studio Pull from VPS Script
REM Download source files from VPS to local (skip node_modules)
REM =============================================================================

echo 📥 Pulling files from VPS...

REM Configuration
set VPS_IP=43.134.5.41
set VPS_USER=ubuntu
set SSH_KEY=%USERPROFILE%\.ssh\id_ed25519
set REMOTE_PATH=/opt/nemesis-studio

REM Get current directory without trailing slash
set LOCAL_PATH=%~dp0
set LOCAL_PATH=%LOCAL_PATH:~0,-1%

echo 📦 Creating archive on VPS (excluding node_modules, .next)...
ssh -i "%SSH_KEY%" %VPS_USER%@%VPS_IP% "cd %REMOTE_PATH% && tar --exclude='node_modules' --exclude='.next' --exclude='browser-data-*' -cvf /tmp/nemesis-studio-pull.tar ."

echo 📤 Downloading archive to: %LOCAL_PATH%
cd /d "%LOCAL_PATH%"
scp -i "%SSH_KEY%" %VPS_USER%@%VPS_IP%:/tmp/fokusai-pull.tar fokusai-pull.tar

echo 📂 Extracting files...
tar -xvf fokusai-pull.tar

echo 🗑️ Cleaning up...
del fokusai-pull.tar 2>nul
ssh -i "%SSH_KEY%" %VPS_USER%@%VPS_IP% "rm /tmp/fokusai-pull.tar 2>/dev/null"

echo ✅ Pull complete! Files synced from VPS to local.
pause
