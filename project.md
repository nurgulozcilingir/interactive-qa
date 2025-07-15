# Canlı Oturum İnteraktif Ağaç Sistemi - Proje Dokümantasyonu

## 📋 Proje Özeti

Katılımcıların canlı oturum sırasında sorulara verdiği cevapların gerçek zamanlı olarak bir ağaç üzerinde yaprak olarak görselleştirildiği interaktif web uygulaması.

## 🎯 Temel İhtiyaçlar

### Fonksiyonel Gereksinimler
- **Soru Yönetimi**: Moderatörün katılımcılara soru sorabilmesi
- **Cevap Toplama**: Katılımcıların mobil/web üzerinden cevap girebilmesi
- **Gerçek Zamanlı Görselleştirme**: Cevapların otomatik olarak ağaç yapraklarına dönüşmesi
- **Büyük Ekran Desteği**: Sahne ekranında tam ağacın gösterilmesi
- **Oturum Yönetimi**: Etkinlik başlatma/bitirme kontrolü

### Teknik Gereksinimler
- **Responsive Design**: Mobil ve masaüstü uyumlu arayüz
- **Real-time Communication**: Anlık veri senkronizasyonu
- **Cross-platform**: Farklı cihazlardan erişim
- **Performance**: Yüzlerce katılımcıyı destekleme

## 🛠 Teknoloji Stack'i

### Backend
- **Node.js** + **Express.js**: API sunucusu
- **Socket.io**: Gerçek zamanlı iletişim
- **MongoDB**: Cevap ve oturum verilerini saklama
- **Redis**: Session yönetimi ve cache

### Frontend
- **React.js**: Ana frontend framework (alternatif: Vue.js/Angular)
- **Socket.io-client**: Gerçek zamanlı bağlantı
- **D3.js** veya **Three.js**: Ağaç animasyonları
- **Tailwind CSS**: Styling framework
- **Framer Motion**: Animasyon kütüphanesi

### Deployment
- **Railway**: Cloud hosting platform (hızlı prototype için)
- **Alternative**: AWS deployment (gelecekte değerlendirilebilir)

## 🏗 Sistem Mimarisi

### Genel Akış
```
[Moderatör Panel] ←→ [Backend API] ←→ [Database]
                       ↕ (Socket.io)
[Katılımcı Mobil/Web] ←→ [Gerçek Zamanlı Ağaç Görünümü]
                       ↕
                   [Büyük Ekran]
```

### Bileşen Yapısı

#### Backend Bileşenleri
1. **Authentication Service**: Oturum yönetimi
2. **Question Service**: Soru CRUD işlemleri
3. **Answer Service**: Cevap toplama ve işleme
4. **Socket Service**: Gerçek zamanlı iletişim
5. **Tree Service**: Ağaç görselleştirme verisi

#### Frontend Bileşenleri
1. **Moderator Dashboard**: Oturum kontrolü
2. **Participant Interface**: Cevap girişi
3. **Tree Visualization**: Ağaç gösterimi
4. **Admin Panel**: Sistem yönetimi

## 📱 Kullanıcı Deneyimi Akışı

### Moderatör Akışı
1. **Oturum Oluşturma**: Yeni etkinlik başlatma
2. **Soru Yayınlama**: Katılımcılara soru gönderme
3. **Cevap İzleme**: Gerçek zamanlı cevap takibi
4. **Ağaç Kontrolü**: Büyük ekran yönetimi
5. **Oturum Sonlandırma**: Etkinlik bitirme

### Katılımcı Akışı
1. **Oturuma Katılma**: QR kod veya link ile giriş
2. **Soru Görüntüleme**: Güncel soruyu okuma
3. **Cevap Yazma**: Düşüncelerini paylaşma
4. **Ağaç İzleme**: Cevabının ağaçta belirmesini görme

## 🎨 Arayüz Tasarım Prensipleri

### Responsive Design
- **Mobile First**: Mobil öncelikli tasarım
- **Breakpoints**: 
  - Mobile: 320px-768px
  - Tablet: 768px-1024px
  - Desktop: 1024px+
  - Large Screen: 1920px+

### Ağaç Görselleştirmesi
- **Organik Görünüm**: Doğal ağaç benzeri yapı
- **Smooth Animations**: Yaprak ekleme animasyonları
- **Color Coding**: Cevap türlerine göre renklendirme
- **Interactive Elements**: Yapraklara tıklayarak cevap okuma

## ⚡ Gerçek Zamanlı Özellikler

### Socket.io Event'leri
```javascript
// Moderatör Event'leri
'session:start' - Oturum başlatma
'question:publish' - Soru yayınlama
'session:end' - Oturum sonlandırma

// Katılımcı Event'leri
'participant:join' - Oturuma katılma
'answer:submit' - Cevap gönderme
'participant:leave' - Oturumdan ayrılma

// Genel Event'ler
'tree:update' - Ağaç güncelleme
'answer:new' - Yeni cevap bildirimi
'participant:count' - Katılımcı sayısı
```

### Veri Senkronizasyonu
- **Real-time Updates**: Tüm bağlı istemcilere anlık güncellemeler
- **State Management**: Redux/Zustand ile durum yönetimi
- **Offline Handling**: Bağlantı kopması durumu yönetimi
- **Reconnection Logic**: Otomatik yeniden bağlanma

## 🗄 Veritabanı Tasarımı

### MongoDB Collections

#### Sessions Collection
```javascript
{
  _id: ObjectId,
  title: String,
  question: String,
  isActive: Boolean,
  createdAt: Date,
  endedAt: Date,
  moderatorId: String,
  participantCount: Number
}
```

#### Answers Collection
```javascript
{
  _id: ObjectId,
  sessionId: ObjectId,
  participantId: String,
  answer: String,
  submittedAt: Date,
  treePosition: {
    x: Number,
    y: Number,
    branch: String
  }
}
```

#### Participants Collection
```javascript
{
  _id: ObjectId,
  sessionId: ObjectId,
  joinedAt: Date,
  isActive: Boolean,
  deviceInfo: Object
}
```

## 🔧 API Endpoints

### RESTful API
```
POST /api/sessions - Yeni oturum oluştur
GET /api/sessions/:id - Oturum detayı
PUT /api/sessions/:id - Oturum güncelle
DELETE /api/sessions/:id - Oturum sil

POST /api/sessions/:id/answers - Cevap gönder
GET /api/sessions/:id/answers - Tüm cevapları getir

GET /api/sessions/:id/tree - Ağaç verisi
POST /api/sessions/:id/participants - Katılımcı ekle
```

### WebSocket API
```javascript
// Bağlantı kurma
socket.connect(sessionId)

// Event dinleme
socket.on('tree:update', updateTreeVisualization)
socket.on('question:new', displayNewQuestion)

// Event gönderme
socket.emit('answer:submit', answerData)
socket.emit('participant:join', participantInfo)
```

## 🎯 Performans ve Ölçeklenebilirlik

### Optimizasyon Stratejileri
- **Lazy Loading**: Ağaç elemanlarının ihtiyaç anında yüklenmesi
- **Virtualization**: Büyük veri setleri için virtual rendering
- **Caching**: Redis ile sık kullanılan verilerin cache'lenmesi
- **CDN**: Statik dosyaların CDN üzerinden sunumu

### Kapasıte Planlaması
- **Concurrent Users**: 500+ eş zamanlı kullanıcı
- **Message Rate**: Saniyede 100+ mesaj işleme
- **Response Time**: <200ms API yanıt süresi
- **Uptime**: %99.9 çalışma süresi hedefi

## 🛡 Güvenlik Önlemleri

### Authentication & Authorization
- **Session Tokens**: JWT tabanlı kimlik doğrulama
- **Rate Limiting**: API isteklerinde hız sınırlaması
- **Input Validation**: Tüm girdilerin doğrulanması
- **CORS**: Cross-origin isteklerin kontrolü

### Data Protection
- **Input Sanitization**: XSS saldırılarına karşı koruma
- **SQL Injection**: Parametreli sorgular
- **Data Encryption**: Hassas verilerin şifrelenmesi
- **Audit Logging**: Tüm işlemlerin loglanması

## 🚀 Geliştirme Ortamı

### Development Setup
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start

# Database (Local)
# MongoDB Atlas (cloud) veya local MongoDB
# Redis Cloud veya local Redis
```

### Production (Railway)
- **Database**: MongoDB Atlas
- **Cache**: Redis Cloud  
- **Hosting**: Railway platform
- **Domain**: Railway subdomain veya custom domain

## 📊 Monitoring ve Analytics

### Sistem Metrikleri
- **Server Health**: CPU, Memory, Disk kullanımı
- **Database Performance**: Query süreleri, connection pool
- **WebSocket Connections**: Aktif bağlantı sayısı
- **Error Rates**: Hata oranları ve türleri

### Kullanıcı Metrikleri
- **Session Statistics**: Oturum süreleri ve katılım oranları
- **Answer Analytics**: Cevap uzunluğu ve içerik analizi
- **User Engagement**: Etkileşim süreleri ve davranışları
- **Device Analytics**: Kullanılan cihaz ve tarayıcı dağılımı

## 🔄 Geliştirme Süreci

### Sprint Planlaması (2 haftalık sprintler)

#### Sprint 1-2: Temel Altyapı
- Backend API geliştirme
- Database schema tasarımı
- Socket.io entegrasyonu
- Temel frontend yapısı

#### Sprint 3-4: Kullanıcı Arayüzleri
- Moderatör paneli
- Katılımcı arayüzü
- Responsive tasarım
- Temel ağaç görselleştirmesi

#### Sprint 5-6: Ağaç Görselleştirmesi
- D3.js/Three.js entegrasyonu
- Animasyon sistemleri
- Gerçek zamanlı güncellemeler
- Büyük ekran optimizasyonu

#### Sprint 7-8: Test ve Optimizasyon
- Performance testing
- Security audit
- Bug fixes
- Deployment preparation

### Code Quality Standards
- **ESLint/Prettier**: Kod formatı ve kalite kontrolü
- **TypeScript**: Type safety
- **Jest/Cypress**: Unit ve E2E testler
- **Husky**: Pre-commit hooks

---

## 📞 İletişim ve Destek

Bu dokümantasyon living document olarak tasarlanmıştır ve proje gelişimi sırasında sürekli güncellenecektir. Herhangi bir soru veya öneri için geliştirme ekibi ile iletişime geçebilirsiniz.

**Proje Başlangıç Tarihi**: [Belirlenmedi]  
**Tahmini Teslim**: 8-10 hafta  
**Minimum Viable Product**: 4-6 hafta
