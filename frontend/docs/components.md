# Frontend Komponentler Dokümantasyonu

Bu dokümant, projede kullanılan React komponentlerinin detaylı açıklamasını içerir.

## 📁 Komponent Yapısı

```
src/components/
├── ui/              # Temel UI komponentleri
├── forms/           # Form komponentleri  
├── layout/          # Layout komponentleri
├── visualization/   # Ağaç görselleştirme komponentleri
└── common/          # Ortak kullanılan komponentler
```

## 🧩 Temel UI Komponentleri

### Button

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200'
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  }
  
  const sizeClasses = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg'
  }

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed'
      )}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
}
```

### Input

```typescript
interface InputProps {
  label?: string
  error?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'password'
  maxLength?: number
  required?: boolean
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  placeholder,
  value,
  onChange,
  type = 'text',
  maxLength,
  required = false
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={clsx(
          'input-field',
          error && 'border-red-500 focus:ring-red-500'
        )}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {maxLength && (
        <p className="text-sm text-gray-500 text-right">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  )
}
```

### Modal

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={clsx(
          'relative bg-white rounded-lg shadow-xl w-full',
          sizeClasses[size]
        )}>
          {title && (
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-semibold">{title}</h2>
            </div>
          )}
          
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
```

## 📱 Layout Komponentleri

### Header

```typescript
interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  showBackButton?: boolean
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  actions,
  showBackButton = false
}) => {
  const navigate = useNavigate()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
            )}
            
            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          </div>
          
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
```

### Card

```typescript
interface CardProps {
  title?: string
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  actions,
  className
}) => {
  return (
    <div className={clsx('card', className)}>
      {(title || actions) && (
        <div className="flex justify-between items-center mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {actions}
        </div>
      )}
      
      {children}
    </div>
  )
}
```

## 📊 Visualization Komponentleri

### TreeVisualization

```typescript
interface TreeNode {
  id: string
  text: string
  position: {
    x: number
    y: number
    branch: string
  }
  submittedAt: string
}

interface TreeVisualizationProps {
  data: TreeNode[]
  onLeafClick?: (node: TreeNode) => void
  width?: number
  height?: number
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({
  data,
  onLeafClick,
  width = 800,
  height = 600
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  
  const centerX = width / 2
  const centerY = height - 100
  const trunkHeight = 150

  const leafColors = [
    '#22c55e', '#16a34a', '#15803d', '#65a30d',
    '#84cc16', '#eab308', '#f59e0b', '#f97316'
  ]

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full"
    >
      {/* Tree trunk */}
      <rect
        x={centerX - 15}
        y={centerY - trunkHeight}
        width="30"
        height={trunkHeight}
        fill="#8B4513"
        rx="5"
      />

      {/* Main branches */}
      <g stroke="#654321" strokeWidth="8" fill="none">
        <path d={`M ${centerX} ${centerY - trunkHeight} Q ${centerX - 100} ${centerY - trunkHeight - 50} ${centerX - 150} ${centerY - trunkHeight - 80}`} />
        <path d={`M ${centerX} ${centerY - trunkHeight} Q ${centerX + 100} ${centerY - trunkHeight - 50} ${centerX + 150} ${centerY - trunkHeight - 80}`} />
        <path d={`M ${centerX} ${centerY - trunkHeight} L ${centerX} ${centerY - trunkHeight - 100}`} />
      </g>

      {/* Leaves */}
      {data.map((node, index) => {
        const leafX = centerX + node.position.x
        const leafY = centerY - trunkHeight + node.position.y
        const color = leafColors[index % leafColors.length]

        return (
          <g
            key={node.id}
            className="animate-leaf-grow cursor-pointer hover:scale-110 transition-transform"
            onClick={() => onLeafClick?.(node)}
          >
            <ellipse
              cx={leafX}
              cy={leafY}
              rx="12"
              ry="8"
              fill={color}
              stroke="#15803d"
              strokeWidth="1"
            />
            <line
              x1={leafX}
              y1={leafY + 8}
              x2={leafX}
              y2={leafY + 15}
              stroke="#15803d"
              strokeWidth="2"
            />
          </g>
        )
      })}

      {/* Ground */}
      <ellipse
        cx={centerX}
        cy={centerY + 20}
        rx="100"
        ry="20"
        fill="#8fbc8f"
        opacity="0.5"
      />
    </svg>
  )
}
```

### ConnectionStatus

```typescript
interface ConnectionStatusProps {
  connected: boolean
  participantCount?: number
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  connected,
  participantCount
}) => {
  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className={clsx(
        'w-3 h-3 rounded-full',
        connected ? 'bg-green-500' : 'bg-red-500'
      )} />
      <span className="text-gray-600">
        {connected ? 'Bağlı' : 'Bağlantı Kesildi'}
      </span>
      {participantCount !== undefined && (
        <>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">
            {participantCount} katılımcı
          </span>
        </>
      )}
    </div>
  )
}
```

## 📝 Form Komponentleri

### SessionForm

```typescript
interface SessionFormData {
  title: string
  question: string
}

interface SessionFormProps {
  onSubmit: (data: SessionFormData) => void
  isLoading?: boolean
}

const SessionForm: React.FC<SessionFormProps> = ({
  onSubmit,
  isLoading = false
}) => {
  const [title, setTitle] = useState('')
  const [question, setQuestion] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = 'Başlık gereklidir'
    } else if (title.length < 3) {
      newErrors.title = 'Başlık en az 3 karakter olmalıdır'
    }

    if (!question.trim()) {
      newErrors.question = 'Soru gereklidir'
    } else if (question.length < 5) {
      newErrors.question = 'Soru en az 5 karakter olmalıdır'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit({ title: title.trim(), question: question.trim() })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Oturum Başlığı"
        value={title}
        onChange={setTitle}
        error={errors.title}
        placeholder="Örn: Geleceğin Teknolojileri"
        maxLength={200}
        required
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          İlk Soru <span className="text-red-500">*</span>
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Katılımcılara sormak istediğiniz soruyu yazın..."
          className={clsx(
            'w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none',
            errors.question && 'border-red-500 focus:ring-red-500'
          )}
          maxLength={500}
        />
        {errors.question && (
          <p className="text-sm text-red-600">{errors.question}</p>
        )}
        <p className="text-sm text-gray-500 text-right">
          {question.length}/500 karakter
        </p>
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
        loading={isLoading}
        className="w-full"
      >
        Oturumu Başlat
      </Button>
    </form>
  )
}
```

### AnswerForm

```typescript
interface AnswerFormProps {
  onSubmit: (answer: string) => void
  isLoading?: boolean
  maxLength?: number
}

const AnswerForm: React.FC<AnswerFormProps> = ({
  onSubmit,
  isLoading = false,
  maxLength = 1000
}) => {
  const [answer, setAnswer] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (answer.trim()) {
      onSubmit(answer.trim())
      setAnswer('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Düşüncelerinizi paylaşın..."
        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        maxLength={maxLength}
        disabled={isLoading}
      />
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <span>{answer.length}/{maxLength} karakter</span>
          <span className="ml-4 text-gray-400">
            Ctrl+Enter ile gönderebilirsiniz
          </span>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || !answer.trim()}
          loading={isLoading}
        >
          Cevabı Gönder
        </Button>
      </div>
    </form>
  )
}
```

## 🔧 Utility Komponentleri

### LoadingSpinner

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'text-primary-600'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={clsx(
      'animate-spin rounded-full border-2 border-gray-300 border-t-current',
      sizeClasses[size],
      color
    )} />
  )
}
```

### ErrorFallback

```typescript
interface ErrorFallbackProps {
  error?: Error
  resetErrorBoundary?: () => void
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Bir hata oluştu
        </h2>
        <p className="text-gray-600 mb-4">
          Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.
        </p>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left bg-gray-100 p-2 rounded text-sm mb-4">
            <summary className="cursor-pointer">Hata detayları</summary>
            <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
          </details>
        )}
        
        <div className="space-y-2">
          {resetErrorBoundary && (
            <Button onClick={resetErrorBoundary} variant="primary">
              Tekrar Dene
            </Button>
          )}
          <Button 
            onClick={() => window.location.href = '/'} 
            variant="secondary"
          >
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    </div>
  )
}
```

## 🎨 Animasyon Komponentleri

### FadeIn

```typescript
interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 300
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: duration / 1000 }}
    >
      {children}
    </motion.div>
  )
}
```

### SlideIn

```typescript
interface SlideInProps {
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
}

const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = 'up',
  delay = 0
}) => {
  const variants = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: 50 },
    down: { x: 0, y: -50 }
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...variants[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

## 📱 Responsive Hooks

### useMediaQuery

```typescript
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    
    const listener = () => setMatches(media.matches)
    media.addListener(listener)
    
    return () => media.removeListener(listener)
  }, [matches, query])

  return matches
}

// Kullanım
const isMobile = useMediaQuery('(max-width: 768px)')
const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)')
const isDesktop = useMediaQuery('(min-width: 1024px)')
```

## 🔄 Komponent Best Practices

1. **TypeScript**: Tüm komponentler TypeScript ile yazılmalı
2. **Props Interface**: Her komponent için ayrı props interface tanımla
3. **Default Props**: Uygun default değerler belirle
4. **Error Handling**: Hata durumlarını handle et
5. **Accessibility**: ARIA labelları ve keyboard navigation ekle
6. **Performance**: React.memo, useMemo, useCallback kullan
7. **Testing**: Her komponent için test yaz
8. **Documentation**: JSDoc commentleri ekle

### Örnek JSDoc

```typescript
/**
 * TreeVisualization - Ağaç görselleştirme komponenti
 * 
 * @param data - Görselleştirilecek ağaç node'ları
 * @param onLeafClick - Yaprak tıklandığında çağrılacak fonksiyon
 * @param width - SVG genişliği (px)
 * @param height - SVG yüksekliği (px)
 * 
 * @example
 * ```tsx
 * <TreeVisualization 
 *   data={treeNodes}
 *   onLeafClick={(node) => showAnswerModal(node)}
 *   width={800}
 *   height={600}
 * />
 * ```
 */
```