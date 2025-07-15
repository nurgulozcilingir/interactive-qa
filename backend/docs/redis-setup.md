# Redis Kurulum ve Yapılandırma

Redis, session management, caching ve real-time data için kullanılır. Bu dokümant Redis'in kurulumu ve projede nasıl kullanıldığı hakkında bilgi içerir.

## 🔴 Redis Kurulumu

### Yerel Redis Kurulumu

#### macOS (Homebrew)
```bash
# Redis kurulumu
brew install redis

# Redis servisini başlatma
brew services start redis

# Servis durumunu kontrol etme
brew services list | grep redis

# Redis CLI ile bağlanma
redis-cli ping
# Yanıt: PONG
```

#### Ubuntu/Debian
```bash
# Paket güncelleme
sudo apt update

# Redis kurulumu
sudo apt install redis-server

# Redis yapılandırması
sudo nano /etc/redis/redis.conf

# Servis başlatma
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Durum kontrolü
sudo systemctl status redis-server
```

#### Windows
1. [Redis for Windows](https://github.com/microsoftarchive/redis/releases) indirin
2. MSI installer'ı çalıştırın
3. Servisi başlatın
4. Veya [WSL](https://docs.microsoft.com/en-us/windows/wsl/) kullanın

### Redis Cloud (Production)

#### Redis Cloud Setup
1. [Redis Cloud](https://redis.com/try-free/) hesabı oluşturun
2. Yeni database oluşturun (30MB free tier)
3. Connection details alın
4. SSL/TLS seçeneklerini ayarlayın

#### Upstash (Serverless Redis)
1. [Upstash](https://upstash.com/) hesabı oluşturun
2. Redis database oluşturun
3. REST API veya Redis protocol kullanın

## 🔧 Projede Redis Kullanımı

### Environment Yapılandırması

```bash
# .env dosyası
REDIS_URL=redis://localhost:6379

# Redis Cloud
REDIS_URL=redis://username:password@host:port

# Redis Cloud with SSL
REDIS_URL=rediss://username:password@host:port
```

### Bağlantı Ayarları

```typescript
// config/redis.ts
const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  connectTimeout: 10000,
  commandTimeout: 5000,
  
  // Production ayarları
  ...(process.env.NODE_ENV === 'production' && {
    tls: {},
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    enableOfflineQueue: false
  })
}
```

## 🗄️ Veri Yapıları ve Kullanım Alanları

### 1. Session Management

```typescript
// Session data storage
interface SessionData {
  sessionId: string
  moderatorId: string
  participantCount: number
  isActive: boolean
  createdAt: Date
}

// Session cache operations
const sessionKey = `session:${sessionId}`

// Set session data (TTL: 24 hours)
await redis.setex(sessionKey, 86400, JSON.stringify(sessionData))

// Get session data
const sessionData = await redis.get(sessionKey)

// Update participant count
await redis.hincrby(`session:${sessionId}`, 'participantCount', 1)
```

### 2. Real-time Participant Tracking

```typescript
// Active participants tracking
const participantsKey = `participants:${sessionId}`

// Add participant
await redis.sadd(participantsKey, participantId)
await redis.expire(participantsKey, 86400) // 24 hours TTL

// Remove participant
await redis.srem(participantsKey, participantId)

// Get participant count
const count = await redis.scard(participantsKey)

// Get all participants
const participants = await redis.smembers(participantsKey)
```

### 3. Rate Limiting

```typescript
// Rate limiting per IP
const rateLimitKey = `rate_limit:${ipAddress}`

// Increment request count
const current = await redis.incr(rateLimitKey)

// Set TTL on first request
if (current === 1) {
  await redis.expire(rateLimitKey, 900) // 15 minutes
}

// Check if rate limit exceeded
const maxRequests = 100
if (current > maxRequests) {
  throw new Error('Rate limit exceeded')
}
```

### 4. Real-time Analytics Cache

```typescript
// Cache session statistics
const statsKey = `stats:${sessionId}`

const stats = {
  totalAnswers: 0,
  participantCount: 0,
  averageResponseTime: 0,
  lastActivity: new Date()
}

// Cache with 1 hour TTL
await redis.setex(statsKey, 3600, JSON.stringify(stats))

// Increment counters
await redis.hincrby(`stats:${sessionId}`, 'totalAnswers', 1)
```

### 5. Answer Queue (Optional)

```typescript
// Queue for processing answers
const queueKey = `answer_queue:${sessionId}`

// Add answer to queue
await redis.lpush(queueKey, JSON.stringify(answerData))

// Process answers (FIFO)
const answer = await redis.brpop(queueKey, 10) // 10 second timeout

// Queue length
const queueLength = await redis.llen(queueKey)
```

## 📊 Redis Monitoring

### Temel Komutlar

```bash
# Redis CLI bağlantısı
redis-cli

# Server bilgileri
INFO

# Memory kullanımı
INFO memory

# Key'leri listeleme
KEYS *

# Key sayısı
DBSIZE

# Specific pattern
KEYS session:*

# Key TTL kontrolü
TTL session:abc123

# Key tipini öğrenme
TYPE session:abc123
```

### Performance Monitoring

```bash
# Real-time monitoring
redis-cli monitor

# Slow query log
redis-cli slowlog get 10

# Client connections
CLIENT LIST

# Memory analysis
MEMORY USAGE session:abc123
```

## 🛠️ Development Commands

### Yerel Geliştirme

```bash
# Redis başlatma
redis-server

# Redis CLI
redis-cli

# Tüm key'leri silme (DEV ONLY!)
redis-cli FLUSHALL

# Belirli pattern'deki key'leri silme
redis-cli --scan --pattern "session:*" | xargs redis-cli del
```

### Docker ile Redis

```bash
# Redis container çalıştırma
docker run -d --name redis -p 6379:6379 redis:7-alpine

# Container'a bağlanma
docker exec -it redis redis-cli

# Data volume ile
docker run -d --name redis -p 6379:6379 -v redis-data:/data redis:7-alpine
```

## 🔒 Security

### Authentication

```bash
# Redis password ayarlama
redis-cli CONFIG SET requirepass "your-strong-password"

# Bağlantı authentication ile
redis-cli -a "your-strong-password"
```

### Network Security

```bash
# redis.conf ayarları
bind 127.0.0.1 ::1  # Sadece localhost
protected-mode yes   # Protected mode aktif
port 6379           # Default port (production'da değiştir)

# Tehlikeli komutları devre dışı bırakma
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command DEBUG ""
```

## 🚨 Backup ve Persistence

### RDB Snapshots

```bash
# Manuel snapshot alma
redis-cli BGSAVE

# Snapshot yapılandırması (redis.conf)
save 900 1      # 900 saniyede 1 değişiklik
save 300 10     # 300 saniyede 10 değişiklik
save 60 10000   # 60 saniyede 10000 değişiklik

# RDB dosya yolu
dir /var/lib/redis
dbfilename dump.rdb
```

### AOF (Append Only File)

```bash
# AOF aktifleştirme
appendonly yes
appendfilename "appendonly.aof"

# Sync stratejisi
appendfsync everysec  # Her saniye
# appendfsync always  # Her komut (yavaş ama güvenli)
# appendfsync no      # OS'a bırak (hızlı ama riskli)
```

## 🔧 Troubleshooting

### Yaygın Problemler

#### Memory Issues
```bash
# Memory kullanımı kontrolü
redis-cli INFO memory

# Memory policy ayarlama
redis-cli CONFIG SET maxmemory-policy allkeys-lru

# Key'leri boyutlarına göre analiz
redis-cli --bigkeys
```

#### Connection Problems
```bash
# Connection sayısı
redis-cli INFO clients

# Max connections ayarlama
redis-cli CONFIG SET maxclients 1000

# Timeout ayarları
redis-cli CONFIG SET timeout 300
```

#### Performance Issues
```bash
# Slow operations
redis-cli SLOWLOG GET 10

# CPU kullanımı
redis-cli INFO cpu

# Network gecikme testi
redis-cli --latency
```

## 📈 Production Önerileri

### High Availability

1. **Redis Sentinel**: Master-slave failover
2. **Redis Cluster**: Horizontal scaling
3. **Backup Strategy**: RDB + AOF kombinasyonu
4. **Monitoring**: RedisInsight, Prometheus, DataDog

### Performance Optimization

```bash
# Connection pooling
maxclients 10000

# Memory optimization
maxmemory 2gb
maxmemory-policy allkeys-lru

# Network optimization
tcp-keepalive 300
tcp-backlog 511

# Persistence tuning
save 900 1
appendfsync everysec
```

### Environment Variables

```bash
# Production Redis config
REDIS_URL=rediss://username:password@host:port
REDIS_MAX_RETRIES=3
REDIS_RETRY_DELAY=1000
REDIS_CONNECT_TIMEOUT=10000
REDIS_COMMAND_TIMEOUT=5000
REDIS_POOL_SIZE=10
```

## 🧪 Testing

### Redis Testing

```typescript
// Test environment Redis
process.env.REDIS_URL = 'redis://localhost:6380' // Different port

// Mock Redis for unit tests
import Redis from 'ioredis-mock'
const redis = new Redis()

// Integration tests
beforeEach(async () => {
  await redis.flushall()
})

afterAll(async () => {
  await redis.disconnect()
})
```

### Health Checks

```typescript
// Redis health check
export const checkRedisHealth = async (): Promise<boolean> => {
  try {
    const result = await redis.ping()
    return result === 'PONG'
  } catch (error) {
    return false
  }
}
```