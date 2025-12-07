# Deployment Guide

This guide covers deploying MWM to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Server Setup](#server-setup)
- [Database Setup](#database-setup)
- [Application Deployment](#application-deployment)
- [Nginx Configuration](#nginx-configuration)
- [SSL/TLS Setup](#ssltls-setup)
- [PM2 Process Manager](#pm2-process-manager)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Server Requirements

- Ubuntu 22.04 LTS (recommended)
- 2 CPU cores minimum
- 4GB RAM minimum
- 40GB SSD storage
- Node.js 18.x or 20.x
- MongoDB 6.x
- Redis 7.x
- Nginx 1.24+

### Domain & DNS

1. Register your domain (e.g., mwm.com)
2. Configure DNS A records:
   - `mwm.com` -> Server IP
   - `www.mwm.com` -> Server IP
   - `api.mwm.com` -> Server IP (optional, for separate API subdomain)

## Server Setup

### Initial Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl git build-essential

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Install MongoDB

```bash
# Import MongoDB public key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Install Redis

```bash
sudo apt install -y redis-server

# Configure Redis
sudo sed -i 's/supervised no/supervised systemd/' /etc/redis/redis.conf

# Start Redis
sudo systemctl restart redis
sudo systemctl enable redis
```

### Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
```

## Database Setup

### Configure MongoDB Security

```bash
# Connect to MongoDB
mongosh

# Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "your-secure-password",
  roles: ["root"]
})

# Create application database and user
use mwm
db.createUser({
  user: "mwm_user",
  pwd: "your-app-password",
  roles: ["readWrite"]
})
```

Enable authentication in `/etc/mongod.conf`:

```yaml
security:
  authorization: enabled
```

Restart MongoDB:

```bash
sudo systemctl restart mongod
```

### MongoDB Backup Script

Create `/opt/scripts/backup-mongodb.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://mwm_user:password@localhost:27017/mwm" --out="$BACKUP_DIR/$DATE"
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
```

Add to crontab:

```bash
0 3 * * * /opt/scripts/backup-mongodb.sh
```

## Application Deployment

### Clone Repository

```bash
# Create app directory
sudo mkdir -p /var/www/mwm
sudo chown $USER:$USER /var/www/mwm

# Clone repository
cd /var/www/mwm
git clone https://github.com/your-org/mwm.git .
```

### Install Dependencies

```bash
npm install --production
```

### Configure Environment

Create `/var/www/mwm/backend/.env`:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://mwm_user:password@localhost:27017/mwm
JWT_SECRET=your-super-secure-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-min-32-chars
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
CORS_ORIGIN=https://mwm.com
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@provider.com
SMTP_PASS=your-email-password
SMTP_FROM=noreply@mwm.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Create `/var/www/mwm/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://mwm.com/api/v1
NEXT_PUBLIC_SITE_URL=https://mwm.com
```

### Build Application

```bash
# Build backend
cd /var/www/mwm/backend
npm run build

# Build frontend
cd /var/www/mwm/frontend
npm run build
```

## Nginx Configuration

Create `/etc/nginx/sites-available/mwm`:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name mwm.com www.mwm.com;
    return 301 https://$server_name$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    server_name mwm.com www.mwm.com;

    # SSL certificates (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/mwm.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mwm.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # API proxy
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90;
    }

    # Next.js application
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Image optimization
    location /images {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=86400";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/mwm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL/TLS Setup

Using Let's Encrypt with Certbot:

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d mwm.com -d www.mwm.com

# Auto-renewal is enabled by default
# Test renewal
sudo certbot renew --dry-run
```

## PM2 Process Manager

### Install PM2

```bash
sudo npm install -g pm2
```

### Configure PM2

Create `/var/www/mwm/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'mwm-api',
      cwd: '/var/www/mwm/backend',
      script: 'dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '500M',
      error_file: '/var/log/mwm/api-error.log',
      out_file: '/var/log/mwm/api-out.log',
      merge_logs: true,
      time: true,
    },
    {
      name: 'mwm-web',
      cwd: '/var/www/mwm/frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      max_memory_restart: '500M',
      error_file: '/var/log/mwm/web-error.log',
      out_file: '/var/log/mwm/web-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
```

### Start Application

```bash
# Create log directory
sudo mkdir -p /var/log/mwm
sudo chown $USER:$USER /var/log/mwm

# Start with PM2
cd /var/www/mwm
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Configure PM2 to start on boot
pm2 startup systemd -u $USER --hp /home/$USER
```

### PM2 Commands

```bash
# View status
pm2 status

# View logs
pm2 logs

# Restart all
pm2 restart all

# Reload (zero-downtime)
pm2 reload all

# Stop all
pm2 stop all
```

## Monitoring

### PM2 Monitoring

```bash
pm2 monit
```

### System Monitoring

Install and configure monitoring tools:

```bash
# Install htop for system monitoring
sudo apt install -y htop

# Check system resources
htop

# Check disk usage
df -h

# Check memory
free -m
```

### Log Rotation

Create `/etc/logrotate.d/mwm`:

```
/var/log/mwm/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

## Troubleshooting

### Common Issues

#### Application Not Starting

```bash
# Check PM2 logs
pm2 logs mwm-api --lines 100
pm2 logs mwm-web --lines 100

# Check if port is in use
sudo lsof -i :5000
sudo lsof -i :3000
```

#### MongoDB Connection Issues

```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Test connection
mongosh "mongodb://mwm_user:password@localhost:27017/mwm"
```

#### Redis Connection Issues

```bash
# Check Redis status
sudo systemctl status redis

# Test connection
redis-cli ping
```

#### Nginx Issues

```bash
# Check config
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Restart Nginx
sudo systemctl restart nginx
```

### Performance Tuning

#### Nginx Worker Connections

Edit `/etc/nginx/nginx.conf`:

```nginx
worker_processes auto;
events {
    worker_connections 4096;
    multi_accept on;
}
```

#### MongoDB Index Optimization

```javascript
// Connect to MongoDB and create indexes
use mwm

// Services indexes
db.services.createIndex({ slug: 1 })
db.services.createIndex({ isActive: 1, order: 1 })

// Projects indexes
db.projects.createIndex({ slug: 1 })
db.projects.createIndex({ isPublished: 1, createdAt: -1 })

// Contact messages indexes
db.contactmessages.createIndex({ status: 1, createdAt: -1 })
```

## Deployment Checklist

- [ ] Server provisioned and secured
- [ ] MongoDB installed and secured
- [ ] Redis installed
- [ ] Node.js installed
- [ ] Application code deployed
- [ ] Environment variables configured
- [ ] Application built
- [ ] PM2 configured and running
- [ ] Nginx configured
- [ ] SSL certificates installed
- [ ] DNS configured
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Security headers configured
