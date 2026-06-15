@echo off
REM =============================================================================
REM FokusAI Deploy to VPS Script
REM VPS: SumoPod Singapore - 43.134.5.41
REM =============================================================================

echo 🚀 Deploying FokusAI to VPS...

REM Configuration
set VPS_IP=43.134.5.41
set VPS_USER=ubuntu
set SSH_KEY=%USERPROFILE%\.ssh\id_ed25519
set REMOTE_PATH=/opt/nemesis-studio
set LOCAL_PATH=%~dp0

REM Step 1: Create a temporary exclude file
echo node_modules> %TEMP%\exclude.txt
echo .next>> %TEMP%\exclude.txt
echo browser-data-*>> %TEMP%\exclude.txt
echo *.log>> %TEMP%\exclude.txt
echo .env.server.local>> %TEMP%\exclude.txt

echo 📦 Syncing files to VPS (excluding node_modules, .next, browser-data)...

REM Step 2: Use SCP to copy files (Windows built-in)
REM First, let's create a tar archive excluding large folders
cd /d "%LOCAL_PATH%"

echo 📁 Creating archive...
tar --exclude="node_modules" --exclude=".next" --exclude="browser-data-*" --exclude="*.log" -cvf "%TEMP%\fokusai-deploy.tar" .

echo 📤 Uploading to VPS...
scp -i "%SSH_KEY%" "%TEMP%\fokusai-deploy.tar" %VPS_USER%@%VPS_IP%:/tmp/

echo 📦 Extracting on VPS...
ssh -i "%SSH_KEY%" %VPS_USER%@%VPS_IP% "cd %REMOTE_PATH% && tar -xvf /tmp/fokusai-deploy.tar && rm /tmp/fokusai-deploy.tar"

echo 📥 Installing dependencies on VPS...
ssh -i "%SSH_KEY%" %VPS_USER%@%VPS_IP% "cd %REMOTE_PATH% && npm install"

echo 🔨 Building on VPS...
ssh -i "%SSH_KEY%" %VPS_USER%@%VPS_IP% "cd %REMOTE_PATH% && npm run build"

echo ♻️ Restarting PM2...
ssh -i "%SSH_KEY%" %VPS_USER%@%VPS_IP% "pm2 restart fokusai 2>/dev/null || pm2 start npm --name fokusai -- run start"

echo ✅ Deployment complete!
echo 🌐 App should be running at http://%VPS_IP%:8790

REM Cleanup
del "%TEMP%\fokusai-deploy.tar" 2>nul
del "%TEMP%\exclude.txt" 2>nul

pause
