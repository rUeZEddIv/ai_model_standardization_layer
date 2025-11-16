# Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis (optional, for queue system)
- Domain with SSL certificate (for webhooks)

## Production Deployment Steps

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis (optional)
sudo apt install -y redis-server
```

### 2. Database Setup

```bash
# Create database
sudo -u postgres psql
CREATE DATABASE ai_content_db;
CREATE USER ai_user WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE ai_content_db TO ai_user;
\q
```

### 3. Application Setup

```bash
# Clone repository
git clone https://github.com/rUeZEddIv/ai_model_standardization_layer.git
cd ai_model_standardization_layer/backend

# Install dependencies
npm install --production

# Copy and configure environment
cp .env.example .env
nano .env
```

### 4. Environment Configuration

Update `.env` with production values:

```env
DATABASE_URL="postgresql://ai_user:your-secure-password@localhost:5432/ai_content_db"

NODE_ENV=production
API_PORT=3000
API_PREFIX=api/v1

# Generate secure secrets
JWT_SECRET=your-very-secure-jwt-secret-here
WEBHOOK_SECRET=your-webhook-verification-secret

# Add your API keys
KIE_API_KEYS=key1,key2,key3
GEMINIGEN_API_KEYS=key1,key2,key3

# File storage
FILE_STORAGE_TYPE=local
FILE_STORAGE_PATH=/var/www/ai-platform/uploads

# Redis (if using)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 5. Database Migration

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npx prisma migrate deploy

# Seed initial data
npm run prisma:seed

# (Optional) Add more models
npm run prisma:seed:extended
```

### 6. Build Application

```bash
npm run build
```

### 7. Process Manager (PM2)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start dist/main.js --name ai-platform

# Configure auto-restart on server reboot
pm2 startup
pm2 save

# Monitor
pm2 monit
```

### 8. Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create configuration
sudo nano /etc/nginx/sites-available/ai-platform
```

Add configuration:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/ai-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 9. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal is configured automatically
```

### 10. Firewall Configuration

```bash
# Allow HTTP, HTTPS, and SSH
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## Health Checks

### Check Application Status

```bash
# PM2 status
pm2 status

# Application logs
pm2 logs ai-platform

# Database connection
psql -U ai_user -d ai_content_db -c "SELECT COUNT(*) FROM ai_providers;"

# API health
curl https://api.yourdomain.com/api/v1/forms/categories
```

## Monitoring & Maintenance

### Setup Monitoring

```bash
# PM2 monitoring
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Database Backups

```bash
# Create backup script
cat > /opt/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/ai-platform"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U ai_user ai_content_db > $BACKUP_DIR/backup_$DATE.sql
# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x /opt/backup-db.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/backup-db.sh") | crontab -
```

## Updating Application

```bash
# Pull latest changes
cd /path/to/ai_model_standardization_layer/backend
git pull

# Install dependencies
npm install --production

# Run migrations
npx prisma migrate deploy

# Rebuild
npm run build

# Restart
pm2 restart ai-platform
```

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**: Use Nginx or cloud load balancer
2. **Multiple Instances**: Run multiple PM2 instances
3. **Database**: PostgreSQL read replicas
4. **Redis**: Centralized Redis instance for queue/cache

### Vertical Scaling

1. **Increase Server Resources**: More CPU/RAM
2. **Database Optimization**: Indexes, query optimization
3. **Connection Pooling**: Prisma connection pooling

## Security Checklist

- [ ] Environment variables secured
- [ ] Database password is strong
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] API keys rotated regularly
- [ ] Webhook signatures verified
- [ ] Rate limiting enabled
- [ ] Regular backups configured
- [ ] Application logs monitored
- [ ] Security updates applied

## Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs ai-platform

# Check environment
cat .env

# Test database connection
psql -U ai_user -d ai_content_db
```

### Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection from app
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$connect().then(() => console.log('Connected')).catch(console.error)"
```

### High Memory Usage

```bash
# Check PM2 metrics
pm2 monit

# Restart application
pm2 restart ai-platform
```

## Support

For issues or questions:
- Check logs: `pm2 logs ai-platform`
- Review documentation: `/backend/IMPLEMENTATION_GUIDE.md`
- API docs: `https://api.yourdomain.com/api/docs`
