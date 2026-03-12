#!/usr/bin/env bash
set -euo pipefail

# One-command installer for Ubuntu VPS (Oracle-friendly).
# Usage:
#   sudo bash install.sh
#   sudo bash install.sh your-domain.com
#
# Optional env vars:
#   APP_DIR=/opt/paradox-smp-event
#   APP_USER=ubuntu
#   APP_GROUP=ubuntu
#   APP_PORT=3000
#   NODE_MAJOR=20
#   ENABLE_NGINX=1

if [[ "${EUID}" -ne 0 ]]; then
  echo "Please run as root: sudo bash install.sh [domain]" >&2
  exit 1
fi

DOMAIN="${1:-_}"
APP_DIR="${APP_DIR:-/opt/paradox-smp-event}"
APP_USER="${APP_USER:-${SUDO_USER:-ubuntu}}"
APP_GROUP="${APP_GROUP:-$APP_USER}"
APP_PORT="${APP_PORT:-3000}"
NODE_MAJOR="${NODE_MAJOR:-20}"
ENABLE_NGINX="${ENABLE_NGINX:-1}"
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

echo "[1/8] Installing OS packages..."
apt update -y
apt install -y curl ca-certificates gnupg nginx rsync

echo "[2/8] Installing Node.js ${NODE_MAJOR}.x..."
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt install -y nodejs
else
  echo "Node already installed: $(node -v)"
fi

echo "[3/8] Preparing app directory..."
id "${APP_USER}" >/dev/null 2>&1 || useradd -m -s /bin/bash "${APP_USER}"
mkdir -p "${APP_DIR}"
chown -R "${APP_USER}:${APP_GROUP}" "${APP_DIR}"

echo "[4/8] Syncing project files to ${APP_DIR}..."
rsync -a \
  --exclude ".git" \
  --exclude "node_modules" \
  --exclude ".DS_Store" \
  "${SCRIPT_DIR}/" "${APP_DIR}/"
chown -R "${APP_USER}:${APP_GROUP}" "${APP_DIR}"

mkdir -p "${APP_DIR}/data"
if [[ ! -f "${APP_DIR}/data/ai-fan-data.json" ]]; then
  cat > "${APP_DIR}/data/ai-fan-data.json" <<'EOF'
{"guestbook":[],"submissions":[]}
EOF
fi
chown -R "${APP_USER}:${APP_GROUP}" "${APP_DIR}/data"

echo "[5/8] Installing systemd service..."
cat > /etc/systemd/system/paradox-smp.service <<EOF
[Unit]
Description=Paradox SMP Event Node Server
After=network.target

[Service]
Type=simple
User=${APP_USER}
Group=${APP_GROUP}
WorkingDirectory=${APP_DIR}
Environment=NODE_ENV=production
Environment=HOST=127.0.0.1
Environment=PORT=${APP_PORT}
ExecStart=/usr/bin/node ${APP_DIR}/server.js
Restart=always
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable paradox-smp
systemctl restart paradox-smp

echo "[6/8] Configuring nginx..."
if [[ "${ENABLE_NGINX}" == "1" ]]; then
  cat > /etc/nginx/sites-available/paradox-smp <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    client_max_body_size 2m;

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Connection \"\";
    }
}
EOF
  ln -sfn /etc/nginx/sites-available/paradox-smp /etc/nginx/sites-enabled/paradox-smp
  rm -f /etc/nginx/sites-enabled/default
  nginx -t
  systemctl enable nginx
  systemctl restart nginx
fi

echo "[7/8] Opening firewall (if ufw is installed)..."
if command -v ufw >/dev/null 2>&1; then
  ufw allow OpenSSH >/dev/null 2>&1 || true
  ufw allow 80/tcp >/dev/null 2>&1 || true
fi

echo "[8/8] Health check..."
sleep 1
if curl -fsS "http://127.0.0.1:${APP_PORT}/healthz" >/dev/null 2>&1; then
  echo "Health check OK: http://127.0.0.1:${APP_PORT}/healthz"
else
  echo "Warning: health check failed. Check logs:"
  echo "  sudo journalctl -u paradox-smp -n 200 --no-pager"
fi

echo
echo "Install complete."
echo "Service status:"
echo "  sudo systemctl status paradox-smp --no-pager"
echo
echo "Logs:"
echo "  sudo journalctl -u paradox-smp -f"
echo
echo "Site URL:"
if [[ "${ENABLE_NGINX}" == "1" ]]; then
  echo "  http://${DOMAIN}"
else
  echo "  http://<server-ip>:${APP_PORT}"
fi
