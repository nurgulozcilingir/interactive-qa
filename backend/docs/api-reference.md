# API Dokümantasyonu

Bu dokümant, İnteraktif Soru-Cevap Ağacı projesinin REST API endpoint'lerini ve Socket.io event'lerini detaylandırır.

## 📡 Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://your-domain.com`

## 🔐 Authentication

Bu projede şu anda authentication sistemi yoktur. Gelecek versiyonlarda JWT tabanlı authentication eklenebilir.

## 📋 Response Format

Tüm API yanıtları standart format kullanır:

### Başarılı Yanıt
```json
{
  "success": true,
  "data": {
    // Dönen data
  }
}
```

### Hata Yanıtı
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "details": [] // Validation errors için
  }
}
```

## 🗂️ Sessions API

### POST /api/sessions
Yeni oturum oluşturur.

**Request Body:**
```json
{
  "title": "string (3-200 karakter)",
  "question": "string (5-500 karakter)"
}
```

**Request Headers:**
```
Content-Type: application/json
X-Moderator-ID: string (optional)
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "648f1b5c9d3e2a1b2c3d4e5f",
    "title": "Geleceğin Teknolojileri",
    "question": "Hangi teknoloji gelecekte en çok değişim yaratacak?",
    "isActive": true,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "moderatorId": "mod123",
    "participantCount": 0
  }
}
```

**Validation Errors (400):**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title must be between 3 and 200 characters"
      }
    ]
  }
}
```

---

### GET /api/sessions/active
Aktif oturumları listeler.

**Query Parameters:**
- `limit` (optional): Maksimum döndürülecek oturum sayısı (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "648f1b5c9d3e2a1b2c3d4e5f",
      "title": "Geleceğin Teknolojileri",
      "question": "Hangi teknoloji gelecekte en çok değişim yaratacak?",
      "isActive": true,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "participantCount": 15
    }
  ]
}
```

---

### GET /api/sessions/:id
Belirli bir oturumun detaylarını getirir.

**Path Parameters:**
- `id`: MongoDB ObjectId

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "648f1b5c9d3e2a1b2c3d4e5f",
    "title": "Geleceğin Teknolojileri",
    "question": "Hangi teknoloji gelecekte en çok değişim yaratacak?",
    "isActive": true,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "endedAt": null,
    "moderatorId": "mod123",
    "participantCount": 15
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "error": {
    "message": "Session not found"
  }
}
```

---

### PUT /api/sessions/:id
Oturum sorusunu günceller.

**Path Parameters:**
- `id`: MongoDB ObjectId

**Request Body:**
```json
{
  "question": "string (5-500 karakter)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "648f1b5c9d3e2a1b2c3d4e5f",
    "title": "Geleceğin Teknolojileri",
    "question": "Yeni güncellenen soru metni",
    "isActive": true,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "moderatorId": "mod123",
    "participantCount": 15
  }
}
```

---

### DELETE /api/sessions/:id
Oturumu sonlandırır.

**Path Parameters:**
- `id`: MongoDB ObjectId

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "648f1b5c9d3e2a1b2c3d4e5f",
    "title": "Geleceğin Teknolojileri",
    "question": "Hangi teknoloji gelecekte en çok değişim yaratacak?",
    "isActive": false,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "endedAt": "2024-01-01T13:00:00.000Z",
    "moderatorId": "mod123",
    "participantCount": 15
  }
}
```

---

### GET /api/sessions/:id/stats
Oturum istatistiklerini getirir.

**Path Parameters:**
- `id`: MongoDB ObjectId

**Response (200):**
```json
{
  "success": true,
  "data": {
    "session": {
      "_id": "648f1b5c9d3e2a1b2c3d4e5f",
      "title": "Geleceğin Teknolojileri",
      "isActive": true,
      "createdAt": "2024-01-01T12:00:00.000Z"
    },
    "answerCount": 25,
    "duration": 3600000
  }
}
```

---

### GET /api/sessions/:id/tree
Ağaç görselleştirmesi için veri döndürür.

**Path Parameters:**
- `id`: MongoDB ObjectId

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "648f1b5c9d3e2a1b2c3d4e60",
      "text": "Yapay zeka en büyük değişimi yaratacak",
      "position": {
        "x": 45.2,
        "y": -120.5,
        "branch": "center",
        "angle": 5.2,
        "depth": 1
      },
      "submittedAt": "2024-01-01T12:15:00.000Z"
    }
  ]
}
```

## 💬 Answers API

### POST /api/answers
Yeni cevap oluşturur.

**Request Body:**
```json
{
  "sessionId": "648f1b5c9d3e2a1b2c3d4e5f",
  "answer": "string (1-1000 karakter)"
}
```

**Request Headers:**
```
Content-Type: application/json
X-Participant-ID: string (optional)
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "648f1b5c9d3e2a1b2c3d4e60",
    "sessionId": "648f1b5c9d3e2a1b2c3d4e5f",
    "participantId": "participant123",
    "answer": "Yapay zeka en büyük değişimi yaratacak",
    "submittedAt": "2024-01-01T12:15:00.000Z",
    "treePosition": {
      "x": 45.2,
      "y": -120.5,
      "branch": "center",
      "angle": 5.2,
      "depth": 1
    }
  }
}
```

---

### GET /api/answers/session/:sessionId
Belirli oturumun tüm cevaplarını getirir.

**Path Parameters:**
- `sessionId`: MongoDB ObjectId

**Query Parameters:**
- `limit` (optional): Maksimum döndürülecek cevap sayısı
- `sort` (optional): Sıralama ('asc' | 'desc', default: 'desc')

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "648f1b5c9d3e2a1b2c3d4e60",
      "sessionId": "648f1b5c9d3e2a1b2c3d4e5f",
      "participantId": "participant123",
      "answer": "Yapay zeka en büyük değişimi yaratacak",
      "submittedAt": "2024-01-01T12:15:00.000Z",
      "treePosition": {
        "x": 45.2,
        "y": -120.5,
        "branch": "center"
      }
    }
  ]
}
```

---

### GET /api/answers/:id
Belirli bir cevabın detaylarını getirir.

**Path Parameters:**
- `id`: MongoDB ObjectId

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "648f1b5c9d3e2a1b2c3d4e60",
    "sessionId": "648f1b5c9d3e2a1b2c3d4e5f",
    "participantId": "participant123",
    "answer": "Yapay zeka en büyük değişimi yaratacak",
    "submittedAt": "2024-01-01T12:15:00.000Z",
    "treePosition": {
      "x": 45.2,
      "y": -120.5,
      "branch": "center",
      "angle": 5.2,
      "depth": 1
    }
  }
}
```

---

### DELETE /api/answers/:id
Cevabı siler (moderatör için).

**Path Parameters:**
- `id`: MongoDB ObjectId

**Response (200):**
```json
{
  "success": true,
  "message": "Answer deleted successfully"
}
```

## 🔌 Socket.io Events

Socket.io server `http://localhost:5000` adresinde çalışır.

### Client → Server Events

#### `participant:join`
Katılımcı oturuma katıldığında gönderilir.

**Data:**
```typescript
{
  sessionId: string;
  participantId?: string;
}
```

**Example:**
```javascript
socket.emit('participant:join', {
  sessionId: '648f1b5c9d3e2a1b2c3d4e5f',
  participantId: 'participant123'
})
```

---

#### `session:start`
Moderatör yeni oturum başlattığında gönderilir.

**Data:**
```typescript
{
  title: string;
  question: string;
}
```

**Example:**
```javascript
socket.emit('session:start', {
  title: 'Geleceğin Teknolojileri',
  question: 'Hangi teknoloji gelecekte en çok değişim yaratacak?'
})
```

---

#### `question:publish`
Moderatör yeni soru yayınladığında gönderilir.

**Data:**
```typescript
{
  sessionId: string;
  question: string;
}
```

**Example:**
```javascript
socket.emit('question:publish', {
  sessionId: '648f1b5c9d3e2a1b2c3d4e5f',
  question: 'Yeni soru metni'
})
```

---

#### `answer:submit`
Katılımcı cevap gönderdiğinde gönderilir.

**Data:**
```typescript
{
  sessionId: string;
  answer: string;
  participantId: string;
}
```

**Example:**
```javascript
socket.emit('answer:submit', {
  sessionId: '648f1b5c9d3e2a1b2c3d4e5f',
  answer: 'Yapay zeka en büyük değişimi yaratacak',
  participantId: 'participant123'
})
```

---

#### `session:end`
Moderatör oturumu sonlandırdığında gönderilir.

**Data:**
```typescript
{
  sessionId: string;
}
```

**Example:**
```javascript
socket.emit('session:end', {
  sessionId: '648f1b5c9d3e2a1b2c3d4e5f'
})
```

### Server → Client Events

#### `session:created`
Yeni oturum oluşturulduğunda gönderilir.

**Data:**
```typescript
{
  _id: string;
  title: string;
  question: string;
  isActive: boolean;
  createdAt: Date;
  moderatorId: string;
  participantCount: number;
}
```

---

#### `session:current`
Katılımcı oturuma katıldığında mevcut oturum bilgisi gönderilir.

**Data:**
```typescript
{
  _id: string;
  title: string;
  question: string;
  isActive: boolean;
  // ... diğer oturum alanları
}
```

---

#### `question:new`
Yeni soru yayınlandığında tüm katılımcılara gönderilir.

**Data:**
```typescript
{
  question: string;
  publishedAt: Date;
}
```

---

#### `answer:new`
Yeni cevap geldiğinde tüm oturum katılımcılarına gönderilir.

**Data:**
```typescript
{
  id: string;
  answer: string;
  treePosition: {
    x: number;
    y: number;
    branch: string;
    angle?: number;
    depth?: number;
  };
  submittedAt: Date;
}
```

---

#### `tree:update`
Ağaç görselleştirmesi güncellendiğinde gönderilir.

**Data:**
```typescript
{
  type: 'leaf_added' | 'leaf_removed';
  data: {
    answerId: string;
    position: {
      x: number;
      y: number;
      branch: string;
    };
  };
}
```

---

#### `participant:count`
Katılımcı sayısı değiştiğinde gönderilir.

**Data:**
```typescript
number // Katılımcı sayısı
```

---

#### `participant:joined`
Yeni katılımcı katıldığında moderatöre gönderilir.

**Data:**
```typescript
{
  participantId: string;
  joinedAt: Date;
}
```

---

#### `session:ended`
Oturum sonlandığında tüm katılımcılara gönderilir.

**Data:**
```typescript
{
  endedAt: Date;
}
```

---

#### `error`
Hata durumunda gönderilir.

**Data:**
```typescript
{
  message: string;
}
```

## 🔍 Health Check

### GET /health
Sunucu durumunu kontrol eder.

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## ⚡ Rate Limiting

API'de rate limiting uygulanmıştır:

- **Window**: 15 dakika
- **Max Requests**: 100 per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

Rate limit aşıldığında:
```json
{
  "success": false,
  "error": {
    "message": "Too many requests from this IP, please try again later."
  }
}
```

## 🚨 Error Codes

| HTTP Code | Açıklama |
|-----------|----------|
| 200 | OK - Başarılı |
| 201 | Created - Kaynak oluşturuldu |
| 400 | Bad Request - Geçersiz istek |
| 404 | Not Found - Kaynak bulunamadı |
| 429 | Too Many Requests - Rate limit aşıldı |
| 500 | Internal Server Error - Sunucu hatası |

## 📝 API Client Örnekleri

### JavaScript/TypeScript

```typescript
// API client class
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async createSession(data: { title: string; question: string }) {
    const response = await fetch(`${this.baseUrl}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error.message)
    }
    
    return result.data
  }

  async submitAnswer(sessionId: string, answer: string) {
    const response = await fetch(`${this.baseUrl}/api/answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Participant-ID': 'participant123'
      },
      body: JSON.stringify({ sessionId, answer })
    })
    
    return response.json()
  }
}

// Socket.io client
import { io } from 'socket.io-client'

const socket = io('http://localhost:5000')

// Event listeners
socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('question:new', (data) => {
  console.log('New question:', data.question)
})

socket.on('answer:new', (data) => {
  console.log('New answer:', data.answer)
})

// Join session
socket.emit('participant:join', {
  sessionId: '648f1b5c9d3e2a1b2c3d4e5f'
})
```

### cURL Örnekleri

```bash
# Create session
curl -X POST http://localhost:5000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Geleceğin Teknolojileri",
    "question": "Hangi teknoloji gelecekte en çok değişim yaratacak?"
  }'

# Get session
curl http://localhost:5000/api/sessions/648f1b5c9d3e2a1b2c3d4e5f

# Submit answer
curl -X POST http://localhost:5000/api/answers \
  -H "Content-Type: application/json" \
  -H "X-Participant-ID: participant123" \
  -d '{
    "sessionId": "648f1b5c9d3e2a1b2c3d4e5f",
    "answer": "Yapay zeka en büyük değişimi yaratacak"
  }'

# Health check
curl http://localhost:5000/health
```

## 🧪 Testing

API endpoint'lerini test etmek için:

```bash
# Jest testleri
npm run test

# API testlerini çalıştırma
npm run test:api

# Socket.io testleri
npm run test:socket
```

Test örnekleri:

```typescript
// __tests__/api/sessions.test.ts
describe('Sessions API', () => {
  test('should create new session', async () => {
    const response = await request(app)
      .post('/api/sessions')
      .send({
        title: 'Test Session',
        question: 'Test question?'
      })
      .expect(201)
    
    expect(response.body.success).toBe(true)
    expect(response.body.data.title).toBe('Test Session')
  })
})
```