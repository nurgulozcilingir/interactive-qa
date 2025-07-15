# İnteraktif Soru-Cevap Ağacı

Katılımcıların canlı oturum sırasında sorulara verdiği cevapların gerçek zamanlı olarak bir ağaç üzerinde yaprak olarak görselleştirildiği interaktif web uygulaması.

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- MongoDB (yerel veya MongoDB Atlas)
- Redis (isteğe bağlı)

### Kurulum

1. **Depoyu klonlayın**
```bash
git clone <repo-url>
cd interactive-qa-app
```

2. **Bağımlılıkları yükleyin**
```bash
npm run install:all
```

3. **Environment dosyalarını oluşturun**
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend  
cp frontend/.env.example frontend/.env
```

4. **MongoDB bağlantısını yapılandırın**
```bash
# backend/.env dosyasında
MONGODB_URI=mongodb://localhost:27017/interactive-qa
```

5. **Uygulamayı başlatın**
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📱 Kullanım

### Moderatör (Oturum Yöneticisi)
1. Ana sayfadan "Yeni Oturum Oluştur"a tıklayın
2. Oturum başlığı ve ilk soruyu girin
3. Oturum oluşturulduktan sonra katılımcı linkini paylaşın
4. "Ağacı Görüntüle" ile büyük ekran görünümünü açın

### Katılımcı
1. Ana sayfadan oturum ID'sini girin veya paylaşılan linke tıklayın
2. Soruyu okuyun ve cevabınızı yazın
3. Cevabınız ağaçta yaprak olarak görünecek

## 🛠 Teknoloji Stack'i

### Backend
- Node.js + Express.js + TypeScript
- Socket.io (gerçek zamanlı iletişim)
- MongoDB (veritabanı)
- Redis (session yönetimi)

### Frontend
- React.js + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Socket.io-client
- React Router

## 📡 API Endpoints

### Sessions
- `POST /api/sessions` - Yeni oturum oluştur
- `GET /api/sessions/active` - Aktif oturumları listele
- `GET /api/sessions/:id` - Oturum detayı
- `GET /api/sessions/:id/tree` - Ağaç verisi
- `PUT /api/sessions/:id` - Oturum güncelle
- `DELETE /api/sessions/:id` - Oturumu sonlandır

### Answers
- `POST /api/answers` - Yeni cevap gönder
- `GET /api/answers/session/:sessionId` - Oturum cevapları

## 🔌 Socket Events

### Client → Server
- `participant:join` - Oturuma katıl
- `session:start` - Oturum başlat
- `question:publish` - Soru yayınla
- `answer:submit` - Cevap gönder
- `session:end` - Oturumu sonlandır

### Server → Client
- `session:created` - Oturum oluşturuldu
- `question:new` - Yeni soru yayınlandı
- `answer:new` - Yeni cevap geldi
- `tree:update` - Ağaç güncellendi
- `participant:count` - Katılımcı sayısı

## 🧪 Test

```bash
# Tüm testleri çalıştır
npm run test

# Backend testleri
npm run test:backend

# Frontend testleri
npm run test:frontend

# Coverage raporu
npm run test:coverage
```

## 🏗 Build

```bash
# Tüm uygulamayı build et
npm run build

# Sadece backend
npm run build:backend

# Sadece frontend
npm run build:frontend
```

## 📁 Proje Yapısı

```
interactive-qa-app/
├── backend/           # Node.js API server
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   ├── docs/          # Backend documentation
│   │   ├── README.md
│   │   ├── database-setup.md
│   │   ├── redis-setup.md
│   │   ├── api-reference.md
│   │   └── deployment.md
│   └── package.json
├── frontend/          # React client
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   ├── docs/          # Frontend documentation
│   │   ├── README.md
│   │   └── components.md
│   └── package.json
├── shared/            # Shared types
│   ├── types/
│   └── constants/
├── CLAUDE.md          # Claude Code documentation
└── package.json       # Root workspace
```

## 🔧 Geliştirme

### Yeni özellik eklemek için:
1. Todo listesini güncelleyin
2. Backend servisleri ve API'leri geliştirin
3. Frontend bileşenlerini oluşturun
4. Socket event'lerini entegre edin
5. Testleri yazın

### Code Quality
```bash
# Lint kontrolü
npm run lint

# Format kod
npm run format
```

## 📚 Dokümantasyon

### Backend Dokümantasyonu
- [Backend Setup](./backend/docs/README.md) - Kurulum ve geliştirme
- [Database Setup](./backend/docs/database-setup.md) - MongoDB yapılandırması
- [Redis Setup](./backend/docs/redis-setup.md) - Redis kurulumu ve kullanımı
- [API Reference](./backend/docs/api-reference.md) - REST API ve Socket.io events
- [Deployment Guide](./backend/docs/deployment.md) - Production deployment

### Frontend Dokümantasyonu
- [Frontend Setup](./frontend/docs/README.md) - React uygulaması kurulumu
- [Components Guide](./frontend/docs/components.md) - UI komponentleri dokümantasyonu

### Geliştirme
- [CLAUDE.md](./CLAUDE.md) - Claude Code için rehber

## 📝 Lisans

MIT License