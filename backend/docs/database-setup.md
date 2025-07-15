# MongoDB Kurulum ve Yapılandırma

Bu dokümant MongoDB'nin kurulumu ve yapılandırılması hakkında detaylı bilgi içerir.

## 🗄️ MongoDB Kurulumu

### Yerel MongoDB Kurulumu

#### macOS (Homebrew)
```bash
# MongoDB Community Edition kurulumu
brew tap mongodb/brew
brew install mongodb-community

# MongoDB servisini başlatma
brew services start mongodb-community

# Servis durumunu kontrol etme
brew services list | grep mongodb
```

#### Ubuntu/Debian
```bash
# MongoDB GPG key ekleme
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

# Repository ekleme
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Paket güncelleme ve kurulum
sudo apt-get update
sudo apt-get install -y mongodb-org

# Servis başlatma
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Windows
1. [MongoDB Community Server](https://www.mongodb.com/try/download/community) indirin
2. MSI installer'ı çalıştırın
3. "Complete" installation seçin
4. MongoDB Compass'ı da yükleyin (GUI tool)

### MongoDB Atlas (Cloud)

MongoDB Atlas ücretsiz tier kullanmak için:

1. [MongoDB Atlas](https://www.mongodb.com/atlas) hesabı oluşturun
2. Yeni cluster oluşturun (M0 Sandbox - Free)
3. Database kullanıcısı oluşturun
4. Network Access'te IP adresinizi whitelist'e ekleyin
5. Connection string'i alın

## 🔗 Bağlantı Yapılandırması

### Environment Değişkenleri

`.env` dosyasında MongoDB bağlantı string'ini yapılandırın:

```bash
# Yerel MongoDB
MONGODB_URI=mongodb://localhost:27017/interactive-qa

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interactive-qa?retryWrites=true&w=majority
```

### Bağlantı Seçenekleri

```javascript
// config/database.ts
const mongoOptions = {
  maxPoolSize: 10,        // Maximum connection pool size
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferMaxEntries: 0,    // Disable mongoose buffering
  bufferCommands: false,  // Disable mongoose buffering
}
```

## 📊 Veritabanı Şeması

### Collections

#### Sessions Collection
```javascript
{
  _id: ObjectId,
  title: String,           // Oturum başlığı
  question: String,        // Güncel soru
  isActive: Boolean,       // Oturum aktif mi
  createdAt: Date,         // Oluşturulma tarihi
  endedAt: Date,           // Sonlanma tarihi (optional)
  moderatorId: String,     // Moderatör socket ID
  participantCount: Number // Katılımcı sayısı
}
```

#### Answers Collection
```javascript
{
  _id: ObjectId,
  sessionId: ObjectId,     // Session referansı
  participantId: String,   // Katılımcı socket ID
  answer: String,          // Cevap metni
  submittedAt: Date,       // Gönderilme tarihi
  treePosition: {          // Ağaçtaki konum
    x: Number,             // X koordinatı
    y: Number,             // Y koordinatı
    branch: String,        // Hangi dal (left, center, right)
    angle: Number,         // Açı (optional)
    depth: Number          // Derinlik (optional)
  }
}
```

#### Participants Collection
```javascript
{
  _id: ObjectId,
  sessionId: ObjectId,     // Session referansı
  participantId: String,   // Unique participant ID
  joinedAt: Date,          // Katılım tarihi
  leftAt: Date,            // Ayrılma tarihi (optional)
  isActive: Boolean,       // Aktif mi
  deviceInfo: {            // Cihaz bilgileri (optional)
    userAgent: String,
    platform: String,
    browser: String
  }
}
```

### İndeksler

Performans için önemli indeksler:

```javascript
// Sessions
db.sessions.createIndex({ "isActive": 1, "createdAt": -1 })
db.sessions.createIndex({ "moderatorId": 1 })

// Answers
db.answers.createIndex({ "sessionId": 1, "submittedAt": -1 })
db.answers.createIndex({ "sessionId": 1, "participantId": 1 })

// Participants
db.participants.createIndex({ "sessionId": 1, "isActive": 1 })
db.participants.createIndex({ "participantId": 1 })
```

## 🛠️ MongoDB Komutları

### Temel Veritabanı İşlemleri

```bash
# MongoDB shell'e bağlanma
mongosh

# Veritabanı seçme
use interactive-qa

# Collections listeleme
show collections

# Doküman sayısı
db.sessions.countDocuments()
db.answers.countDocuments()

# Aktif oturumları listeleme
db.sessions.find({ isActive: true })

# Son 10 cevabı görme
db.answers.find().sort({ submittedAt: -1 }).limit(10)
```

### Veri Temizleme

```javascript
// Eski oturumları temizleme (30 gün öncesi)
db.sessions.deleteMany({
  createdAt: { 
    $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
  }
})

// İlişkili cevapları temizleme
db.answers.deleteMany({
  sessionId: { $in: [/* silinen session ID'leri */] }
})

// Test verilerini temizleme
db.sessions.deleteMany({ title: /test/i })
```

## 🔍 Monitoring

### Veritabanı İstatistikleri

```javascript
// Veritabanı boyutu
db.stats()

// Collection istatistikleri
db.sessions.stats()
db.answers.stats()

// İndeks kullanımı
db.sessions.aggregate([{ $indexStats: {} }])
```

### Query Performansı

```javascript
// Slow query'leri bulma
db.setProfilingLevel(2, { slowms: 100 })

// Profiling sonuçları
db.system.profile.find().sort({ ts: -1 }).limit(5)

// Explain plan
db.sessions.find({ isActive: true }).explain("executionStats")
```

## 🚨 Backup ve Restore

### Backup Alma

```bash
# Tüm veritabanını backup alma
mongodump --db interactive-qa --out backup/

# Belirli collection backup
mongodump --db interactive-qa --collection sessions --out backup/

# Gzip ile sıkıştırma
mongodump --db interactive-qa --gzip --out backup/
```

### Restore Etme

```bash
# Tüm veritabanını restore etme
mongorestore --db interactive-qa backup/interactive-qa/

# Belirli collection restore
mongorestore --db interactive-qa --collection sessions backup/interactive-qa/sessions.bson
```

## 🔧 Troubleshooting

### Yaygın Problemler

#### Bağlantı Problemi
```bash
# MongoDB servisinin çalışıp çalışmadığını kontrol et
ps aux | grep mongod

# Log dosyalarını kontrol et
tail -f /var/log/mongodb/mongod.log

# Port kontrolü
netstat -ln | grep 27017
```

#### Yavaş Query'ler
```javascript
// İndeks eksikliği kontrolü
db.sessions.find({ isActive: true }).explain("executionStats")

// Memory kullanımı
db.serverStatus().mem
```

#### Disk Alanı
```bash
# MongoDB veri klasörü boyutu
du -sh /var/lib/mongodb/

# Disk kullanımı
df -h
```

## 📈 Production Önerileri

1. **Replica Set**: Yüksek erişilebilirlik için
2. **Sharding**: Büyük veri setleri için
3. **Monitoring**: MongoDB Compass veya Atlas monitoring
4. **Backup Strategy**: Otomatik daily backup'lar
5. **Index Optimization**: Query pattern'lerine göre indeks optimizasyonu
6. **Connection Pooling**: Uygun pool size ayarları
7. **Read Preference**: Secondary read'ler için

### Production Connection String Örneği

```bash
MONGODB_URI=mongodb+srv://prod-user:password@cluster.mongodb.net/interactive-qa?retryWrites=true&w=majority&readPreference=secondaryPreferred&maxPoolSize=10
```