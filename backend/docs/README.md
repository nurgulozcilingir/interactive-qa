# Backend Dokümantasyonu

Bu dokümantasyon, İnteraktif Soru-Cevap Ağacı projesinin backend kısmının kurulumu, çalıştırılması ve geliştirilmesi hakkında detaylı bilgi içerir.

## 📁 İçindekiler

- [Kurulum](#kurulum)
- [Veritabanı Kurulumu](#veritabanı-kurulumu)
- [Redis Kurulumu](#redis-kurulumu)
- [Environment Yapılandırması](#environment-yapılandırması)
- [Geliştirme](#geliştirme)
- [API Dokümantasyonu](#api-dokümantasyonu)
- [Socket.io Events](#socketio-events)
- [Deployment](#deployment)

## Kurulum

### Gereksinimler
- Node.js 18+ 
- npm 9+
- MongoDB 5.0+
- Redis 6.0+ (isteğe bağlı)

### Bağımlılıkları Yükleme
```bash
cd backend
npm install
```

### Environment Dosyası
```bash
cp .env.example .env
```

### Geliştirme Modu
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## Teknoloji Stack'i

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Socket.io** - Real-time communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Redis** - In-memory cache (optional)
- **Winston** - Logging
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin requests

## Proje Yapısı

```
backend/
├── src/
│   ├── controllers/     # HTTP request handlers
│   ├── services/        # Business logic
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── config/          # Configuration files
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript type definitions
├── docs/                # Documentation
├── dist/                # Compiled JavaScript (build output)
├── package.json
├── tsconfig.json
└── .env.example
```

## Scripts

```bash
npm run dev          # Development mode with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Run production build
npm test             # Run tests
npm run test:coverage # Run tests with coverage
npm run lint         # ESLint code check
npm run format       # Format code with Prettier
```

## Port Yapılandırması

- **Development**: 5000
- **Production**: PORT environment değişkeni veya 5000

## Health Check

Backend'in çalışıp çalışmadığını kontrol etmek için:
```bash
curl http://localhost:5000/health
```

Yanıt:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```