# Deployment ve Production Setup

Bu dokümant, İnteraktif Soru-Cevap Ağacı projesinin çeşitli platformlara deploy edilmesi hakkında detaylı bilgi içerir.

## 🚀 Deployment Seçenekleri

1. **Railway** (Önerilen - Hızlı ve Kolay)
2. **Vercel** (Frontend için)
3. **AWS** (Scalable solution)
4. **Docker** (Containerized deployment)
5. **DigitalOcean** (VPS)

## 🚂 Railway Deployment

Railway, fullstack uygulamalar için ideal bir platformdur.

### Backend Deployment

1. **Railway Hesabı Oluşturun**
   - [Railway.app](https://railway.app) hesabı oluşturun
   - GitHub ile bağlayın

2. **MongoDB Atlas Setup**
   ```bash
   # MongoDB Atlas connection string
   mongodb+srv://username:password@cluster.mongodb.net/interactive-qa
   ```

3. **Redis Cloud Setup**
   ```bash
   # Redis Cloud connection string
   redis://username:password@host:port
   ```

4. **Environment Variables**
   Railway dashboard'da aşağıdaki env var'ları ekleyin:
   ```bash
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://...
   REDIS_URL=redis://...
   JWT_SECRET=your-super-secret-key
   CORS_ORIGIN=https://your-frontend-domain.com
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. **Deploy Scriptleri**
   ```json
   {
     "scripts": {
       "build": "tsc",
       "start": "node dist/index.js",
       "railway:build": "npm run build",
       "railway:start": "npm start"
     }
   }
   ```

6. **Railway Config (railway.json)**
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

### Frontend Deployment

1. **Environment Variables**
   ```bash
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_SOCKET_URL=https://your-backend.railway.app
   ```

2. **Build Settings**
   ```json
   {
     "scripts": {
       "build": "tsc && vite build",
       "preview": "vite preview --port $PORT"
     }
   }
   ```

## ☁️ Vercel Deployment (Frontend)

Vercel, React uygulamaları için mükemmel bir seçenektir.

### Setup

1. **Vercel CLI**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Build Configuration (vercel.json)**
   ```json
   {
     "framework": "vite",
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install",
     "env": {
       "VITE_API_URL": "@vite_api_url",
       "VITE_SOCKET_URL": "@vite_socket_url"
     }
   }
   ```

3. **Environment Variables**
   ```bash
   # Production
   vercel env add VITE_API_URL production
   vercel env add VITE_SOCKET_URL production
   
   # Preview
   vercel env add VITE_API_URL preview
   vercel env add VITE_SOCKET_URL preview
   ```

4. **Deploy**
   ```bash
   # Frontend klasöründe
   vercel --prod
   ```

## 🐳 Docker Deployment

### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start app
CMD ["npm", "start"]
```

### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/interactive-qa
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://localhost:5000/api
      - VITE_SOCKET_URL=http://localhost:5000
    depends_on:
      - backend
    restart: unless-stopped

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  mongo_data:
  redis_data:
```

### Docker Commands

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Update services
docker-compose pull
docker-compose up -d --force-recreate
```

## 🌊 DigitalOcean Deployment

### Droplet Setup

1. **Droplet Oluşturun**
   ```bash
   # Ubuntu 22.04 LTS
   # 2GB RAM, 1 vCPU (Basic plan)
   ```

2. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   
   # Install Redis
   sudo apt install redis-server -y
   ```

3. **Application Setup**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/interactive-qa-app.git
   cd interactive-qa-app
   
   # Backend setup
   cd backend
   npm install
   npm run build
   
   # Frontend setup
   cd ../frontend
   npm install
   npm run build
   ```

4. **PM2 Configuration**
   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [
       {
         name: 'interactive-qa-backend',
         script: './backend/dist/index.js',
         env: {
           NODE_ENV: 'production',
           PORT: 5000,
           MONGODB_URI: 'mongodb://localhost:27017/interactive-qa',
           REDIS_URL: 'redis://localhost:6379'
         },
         instances: 'max',
         exec_mode: 'cluster',
         max_memory_restart: '500M'
       }
     ]
   }
   ```

   ```bash
   # Start with PM2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

5. **Nginx Configuration**
   ```nginx
   # /etc/nginx/sites-available/interactive-qa
   server {
       listen 80;
       server_name your-domain.com;
       
       # Frontend
       location / {
           root /home/deploy/interactive-qa-app/frontend/dist;
           try_files $uri $uri/ /index.html;
       }
       
       # Backend API
       location /api/ {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
       
       # Socket.io
       location /socket.io/ {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

   ```bash
   # Enable site
   sudo ln -s /etc/nginx/sites-available/interactive-qa /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## 🔒 SSL/HTTPS Setup

### Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring ve Logging

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs interactive-qa-backend

# Restart app
pm2 restart interactive-qa-backend

# View status
pm2 status
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Application Logs

```bash
# Backend logs
tail -f backend/logs/combined.log
tail -f backend/logs/error.log

# PM2 logs
pm2 logs --lines 100
```

## 🔧 Performance Optimization

### Backend Optimizations

```javascript
// Production optimizations
app.use(compression()) // Gzip compression
app.use(helmet()) // Security headers
app.use(express.static('public', { maxAge: '1y' })) // Static file caching

// Database connection pooling
mongoose.connect(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
```

### Frontend Optimizations

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          socket: ['socket.io-client'],
          ui: ['framer-motion', 'react-hot-toast']
        }
      }
    },
    chunkSizeWarningLimit: 1600
  }
})
```

### Nginx Optimizations

```nginx
# Gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# Cache static files
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Security headers
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
```

## 🚨 Backup Strategies

### Database Backup

```bash
# MongoDB backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --db interactive-qa --out /backup/mongodb_$DATE
tar -czf /backup/mongodb_$DATE.tar.gz /backup/mongodb_$DATE
rm -rf /backup/mongodb_$DATE

# Keep only last 7 backups
find /backup -name "mongodb_*.tar.gz" -mtime +7 -delete
```

### Application Backup

```bash
# Application files backup
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backup/app_$DATE.tar.gz /home/deploy/interactive-qa-app
find /backup -name "app_*.tar.gz" -mtime +7 -delete
```

### Automated Backup (Cron)

```bash
# Add to crontab
0 2 * * * /scripts/backup_mongodb.sh
0 3 * * * /scripts/backup_app.sh
```

## 🔍 Health Checks ve Alerting

### Health Check Script

```bash
#!/bin/bash
# health_check.sh

# Check backend
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "Backend: OK"
else
    echo "Backend: FAILED"
    pm2 restart interactive-qa-backend
fi

# Check MongoDB
if mongo --eval "db.adminCommand('ismaster')" > /dev/null 2>&1; then
    echo "MongoDB: OK"
else
    echo "MongoDB: FAILED"
    sudo systemctl restart mongod
fi

# Check Redis
if redis-cli ping > /dev/null 2>&1; then
    echo "Redis: OK"
else
    echo "Redis: FAILED"
    sudo systemctl restart redis-server
fi
```

### Uptime Monitoring

1. **UptimeRobot** - Ücretsiz uptime monitoring
2. **Pingdom** - Gelişmiş monitoring
3. **New Relic** - Application performance monitoring

## 🚀 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci
      
      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test
      
      - name: Build applications
        run: |
          cd backend && npm run build
          cd ../frontend && npm run build
      
      - name: Deploy to Railway
        uses: railway-deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
```

## 📋 Production Checklist

### Pre-deployment

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Performance testing completed
- [ ] Security audit performed

### Post-deployment

- [ ] Health checks passing
- [ ] Logs being generated correctly
- [ ] Performance monitoring active
- [ ] Error reporting working
- [ ] Backup jobs scheduled
- [ ] Documentation updated

## 🛡️ Security Best Practices

1. **Environment Variables**: Hiçbir zaman secrets'ı code'a commit etmeyin
2. **HTTPS**: Production'da her zaman HTTPS kullanın
3. **Rate Limiting**: API abuse'ını önlemek için
4. **Input Validation**: Tüm user input'larını validate edin
5. **CORS**: Sadece gerekli domain'lere izin verin
6. **Security Headers**: Helmet.js kullanın
7. **Database Security**: MongoDB auth ve network restrictions
8. **Regular Updates**: Dependencies'i düzenli güncelleyin

## 📞 Troubleshooting

### Common Issues

#### 502 Bad Gateway
```bash
# Check backend process
pm2 status
pm2 restart interactive-qa-backend

# Check nginx config
sudo nginx -t
sudo systemctl reload nginx
```

#### Database Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection
mongo --eval "db.adminCommand('ismaster')"

# Restart if needed
sudo systemctl restart mongod
```

#### High Memory Usage
```bash
# Check memory usage
free -h
pm2 monit

# Restart app with memory limit
pm2 restart interactive-qa-backend --max-memory-restart 500M
```

### Log Analysis

```bash
# Find errors in logs
grep -i error /var/log/nginx/error.log
pm2 logs interactive-qa-backend | grep ERROR

# Monitor real-time
tail -f /var/log/nginx/access.log | grep -E '4[0-9]{2}|5[0-9]{2}'
```