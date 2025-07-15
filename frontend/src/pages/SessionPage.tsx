import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSocket } from '@/hooks/useSocket'
import { toast } from 'react-hot-toast'

interface Session {
  _id: string
  title: string
  question: string
  isActive: boolean
}

export default function SessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [session, setSession] = useState<Session | null>(null)
  const [answer, setAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [participantCount, setParticipantCount] = useState(0)
  const { emit, on } = useSocket({ sessionId, autoConnect: true })

  useEffect(() => {
    if (!sessionId) return

    // Load session data
    const loadSession = async () => {
      try {
        const response = await fetch(`/api/sessions/${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          setSession(data.data)
        } else {
          toast.error('Oturum bulunamadı')
        }
      } catch (error) {
        toast.error('Bağlantı hatası')
      }
    }

    loadSession()

    // Socket event listeners
    const cleanupFunctions = [
      on('session:current', (sessionData: Session) => {
        setSession(sessionData)
      }),

      on('question:new', (data: { question: string }) => {
        setSession(prev => prev ? { ...prev, question: data.question } : null)
        toast.success('Yeni soru yayınlandı!')
      }),

      on('participant:count', (count: number) => {
        setParticipantCount(count)
      }),

      on('session:ended', () => {
        toast('Oturum sona erdi', { icon: '👋' })
        setSession(prev => prev ? { ...prev, isActive: false } : null)
      }),

      on('error', (error: { message: string }) => {
        toast.error(error.message)
      })
    ]

    // Join session
    emit('participant:join', { sessionId })

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }
  }, [sessionId, emit, on])

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || !sessionId) {
      toast.error('Lütfen bir cevap yazınız')
      return
    }

    setIsSubmitting(true)
    try {
      const participantId = `participant-${Date.now()}`
      
      emit('answer:submit', {
        sessionId,
        answer: answer.trim(),
        participantId
      })

      setAnswer('')
      toast.success('Cevabınız ağaca eklendi! 🌱')
    } catch (error) {
      toast.error('Cevap gönderilemedi')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Oturum yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{session.title}</h1>
              <p className="text-sm text-gray-600">
                {participantCount} katılımcı
                {!session.isActive && ' • Oturum sona erdi'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${session.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {session.isActive ? 'Aktif' : 'Pasif'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Soru</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {session.question}
          </p>
        </div>

        {session.isActive && (
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Cevabınız</h3>
            <div className="space-y-4">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Düşüncelerinizi paylaşın..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                maxLength={1000}
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {answer.length}/1000 karakter
                </span>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting || !answer.trim()}
                  className="btn-primary"
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Cevabı Gönder'}
                </button>
              </div>
            </div>
          </div>
        )}

        {!session.isActive && (
          <div className="card bg-gray-100">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Bu oturum sona ermiştir</p>
              <button
                onClick={() => window.location.href = '/'}
                className="btn-secondary"
              >
                Ana Sayfaya Dön
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}