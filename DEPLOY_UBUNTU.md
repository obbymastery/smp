# Ubuntu (Oracle VPS) Deployment Guide

This project runs on plain Node.js (no external npm dependencies).

## Fastest path (one command)

After uploading the project folder to the VPS:

```bash
cd /opt/paradox-smp-event
sudo bash install.sh your-domain.com
```

Or without a domain yet:

```bash
sudo bash install.sh
```

This sets up:
- Node.js
- systemd service (`paradox-smp`)
- nginx reverse proxy on port 80
- shared data file at `data/ai-fan-data.json`

## 1) Install Node + Nginx

```bash
sudo apt update
sudo apt install -y curl nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
```

## 2) Upload project

Put the project at:

`/opt/paradox-smp-event`

Example:

```bash
sudo mkdir -p /opt/paradox-smp-event
sudo chown -R ubuntu:ubuntu /opt/paradox-smp-event
# then upload/copy files into /opt/paradox-smp-event
```

## 3) Test server directly

```bash
cd /opt/paradox-smp-event
npm start
```

From another terminal:

```bash
curl http://127.0.0.1:3000/healthz
```

Expected JSON: `{"ok":true,...}`

Stop test run with `Ctrl+C`.

## 4) Run as a systemd service

Copy service file:

```bash
sudo cp deploy/paradox-smp.service /etc/systemd/system/paradox-smp.service
```

If your Linux user is not `ubuntu`, edit:

- `User=...`
- `Group=...`
- `WorkingDirectory=...`
- `ExecStart=...`

Enable + start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable paradox-smp
sudo systemctl start paradox-smp
sudo systemctl status paradox-smp --no-pager
```

## 5) Configure nginx reverse proxy

```bash
sudo cp deploy/nginx-paradox-smp.conf /etc/nginx/sites-available/paradox-smp
sudo ln -sf /etc/nginx/sites-available/paradox-smp /etc/nginx/sites-enabled/paradox-smp
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 6) Open Oracle/Ubuntu firewall

On Ubuntu (ufw):

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw enable
sudo ufw status
```

Also open port `80` in Oracle Cloud Network Security Lists / NSG.

## 7) Optional HTTPS (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx
```

## Notes

- Shared data is stored in `data/ai-fan-data.json`.
- Back up `data/` regularly.
- API endpoints:
  - `GET/POST /api/guestbook`
  - `GET/POST /api/submissions`
  - `GET /healthz`

## Files you must transfer to Linux

Transfer the whole project directory, especially:
- `index.html`
- `style.css`
- `script.js`
- `server.js`
- `package.json`
- `start.sh`
- `install.sh`
- `ai-hoshino-music-config.js`
- `assets/` (all images/music)
- `deploy/` (service + nginx templates)

`data/` will be created automatically if missing.
