# Frontend Dokümantasyonu

Bu dokümantasyon, İnteraktif Soru-Cevap Ağacı projesinin frontend kısmının kurulumu, geliştirilmesi ve dağıtımı hakkında detaylı bilgi içerir.

## 📁 İçindekiler

- [Kurulum](#kurulum)
- [Geliştirme](#geliştirme)
- [Komponentler](#komponentler)
- [State Management](#state-management)
- [Socket.io Integration](#socketio-integration)
- [Styling](#styling)
- [Build ve Deploy](#build-ve-deploy)

## Kurulum

### Gereksinimler
- Node.js 18+
- npm 9+

### Bağımlılıkları Yükleme
```bash
cd frontend
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
npm run preview
```

## Teknoloji Stack'i

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool ve dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication
- **Zustand** - State management
- **React Query** - Server state management
- **Framer Motion** - Animation library
- **React Hook Form** - Form handling
- **React Hot Toast** - Notification system

## Proje Yapısı

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API and external services
│   ├── store/          # Zustand stores
│   ├── utils/          # Utility functions
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main App component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global CSS
├── docs/               # Documentation
├── public/             # Static assets
├── dist/               # Build output
├── index.html          # HTML template
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## Scripts

```bash
npm run dev          # Development server (http://localhost:3000)
npm run build        # Production build
npm run preview      # Preview production build
npm test             # Run tests with Vitest
npm run test:coverage # Run tests with coverage
npm run lint         # ESLint code check
npm run format       # Format code with Prettier
```

## Sayfalar (Pages)

### 1. HomePage (`/`)
Ana sayfa - Oturuma katılma veya yeni oturum oluşturma

**Özellikler:**
- Oturum ID ile katılım
- Moderatör paneline yönlendirme
- Responsive tasarım

### 2. SessionPage (`/session/:sessionId`)
Katılımcı sayfası - Soru görüntüleme ve cevap gönderme

**Özellikler:**
- Real-time soru güncellemeleri
- Cevap formu
- Katılımcı sayısı gösterimi
- Socket.io entegrasyonu

### 3. ModeratorPage (`/moderator`)
Moderatör kontrol paneli

**Özellikler:**
- Oturum oluşturma
- Soru yayınlama
- Katılımcı istatistikleri
- Oturum yönetimi

### 4. TreeDisplayPage (`/display/:sessionId`)
Büyük ekran görünümü - Cevap ağacı visualizasyonu

**Özellikler:**
- SVG tabanlı ağaç görselleştirmesi
- Real-time yaprak ekleme animasyonları
- Responsive design
- Cevapları gösterme

## State Management

### Zustand Store

```typescript
// store/sessionStore.ts
interface SessionState {
  currentSession: Session | null
  participantCount: number
  answers: Answer[]
  
  // Actions
  setSession: (session: Session) => void
  updateParticipantCount: (count: number) => void
  addAnswer: (answer: Answer) => void
}

const useSessionStore = create<SessionState>((set) => ({
  currentSession: null,
  participantCount: 0,
  answers: [],
  
  setSession: (session) => set({ currentSession: session }),
  updateParticipantCount: (count) => set({ participantCount: count }),
  addAnswer: (answer) => set((state) => ({ 
    answers: [...state.answers, answer] 
  }))
}))
```

### React Query

```typescript
// API veri yönetimi
const { data: session, isLoading, error } = useQuery({
  queryKey: ['session', sessionId],
  queryFn: () => fetchSession(sessionId),
  refetchOnWindowFocus: false,
  retry: 1
})
```

## Socket.io Integration

### Custom Hook: useSocket

```typescript
const { emit, on, connected } = useSocket({ 
  sessionId, 
  autoConnect: true 
})

// Event listening
useEffect(() => {
  const cleanup = on('answer:new', (data) => {
    addAnswer(data)
    toast.success('Yeni cevap geldi! 🌱')
  })
  
  return cleanup
}, [on, addAnswer])

// Event emitting
const handleSubmitAnswer = () => {
  emit('answer:submit', {
    sessionId,
    answer: answerText,
    participantId
  })
}
```

### Socket Events

#### Client → Server
- `participant:join` - Oturuma katılım
- `session:start` - Oturum başlatma
- `question:publish` - Soru yayınlama
- `answer:submit` - Cevap gönderme
- `session:end` - Oturum sonlandırma

#### Server → Client
- `session:current` - Mevcut oturum bilgisi
- `question:new` - Yeni soru bildirim
- `answer:new` - Yeni cevap bildirim
- `participant:count` - Katılımcı sayısı
- `session:ended` - Oturum sona erdi

## Styling

### Tailwind CSS

Utility-first CSS framework kullanılmıştır.

#### Custom Classes

```css
/* index.css */
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200;
}

.card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}
```

#### Animations

```javascript
// tailwind.config.js
animation: {
  'leaf-grow': 'leafGrow 0.5s ease-out',
  'tree-sway': 'treeSway 3s ease-in-out infinite',
  'fade-in': 'fadeIn 0.3s ease-in'
}
```

### Responsive Design

```javascript
// Breakpoints
mobile: '320px-768px'
tablet: '768px-1024px'  
desktop: '1024px+'
large: '1920px+'
```

## Environment Variables

```bash
# .env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**Not:** Vite'da environment değişkenleri `VITE_` prefix'i ile başlamalıdır.

## Error Handling

### Global Error Boundary

```typescript
// components/ErrorBoundary.tsx
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }

    return this.props.children
  }
}
```

### API Error Handling

```typescript
// services/api.ts
const handleApiError = (error: any) => {
  if (error.response?.status === 404) {
    toast.error('Kaynak bulunamadı')
  } else if (error.response?.status >= 500) {
    toast.error('Sunucu hatası')
  } else {
    toast.error('Bir hata oluştu')
  }
}
```

## Testing

### Test Setup

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
})
```

### Component Testing

```typescript
// __tests__/HomePage.test.tsx
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

test('renders homepage correctly', () => {
  renderWithRouter(<HomePage />)
  expect(screen.getByText('İnteraktif Soru-Cevap Ağacı')).toBeInTheDocument()
})
```

## Performance Optimization

### Code Splitting

```typescript
// Lazy loading
const ModeratorPage = lazy(() => import('./pages/ModeratorPage'))
const TreeDisplayPage = lazy(() => import('./pages/TreeDisplayPage'))

// Route-based splitting
<Route path="/moderator" element={
  <Suspense fallback={<Loading />}>
    <ModeratorPage />
  </Suspense>
} />
```

### Memoization

```typescript
// React.memo for expensive components
const TreeVisualization = React.memo(({ treeData }) => {
  return <SVGTree data={treeData} />
})

// useMemo for expensive calculations
const processedTreeData = useMemo(() => {
  return treeData.map(processTreeNode)
}, [treeData])
```

## Build ve Deploy

### Development Build

```bash
npm run dev
# Server: http://localhost:3000
# HMR aktif, source maps mevcut
```

### Production Build

```bash
npm run build
# Output: dist/ klasörü
# Minified, optimized, tree-shaken
```

### Preview Production Build

```bash
npm run preview
# Yerel olarak production build'i test etme
```

### Bundle Analysis

```bash
npm run build
npx vite-bundle-analyzer dist/
```

## Browser Support

- Chrome 88+
- Firefox 84+
- Safari 14+
- Edge 88+

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast ratios

## Security

- XSS protection via React's built-in escaping
- HTTPS enforcement in production
- Environment variable validation
- Input sanitization
- CSP headers (configured on server)

## Troubleshooting

### Common Issues

#### Development Server Port Conflict
```bash
# Farklı port kullanma
npm run dev -- --port 3001
```

#### Type Errors
```bash
# Type check
npm run type-check

# VS Code TypeScript restart
Cmd+Shift+P > "TypeScript: Restart TS Server"
```

#### Build Failures
```bash
# Clear cache
rm -rf node_modules/.vite
npm run build
```

#### Socket Connection Issues
```bash
# Proxy kontrolü
# vite.config.ts proxy ayarlarını kontrol et
```