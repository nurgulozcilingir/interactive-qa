import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '@/hooks/useSocket'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { sessionService } from '../services/sessionService'
import LoginModal from '../components/auth/LoginModal'

interface Session {
  _id: string
  title: string
  question: string
  isActive: boolean
}

export default function ModeratorPage() {
  const [step, setStep] = useState<'create' | 'manage'>('create')
  const [session, setSession] = useState<Session | null>(null)
  const [title, setTitle] = useState('')
  const [question, setQuestion] = useState('')
  const [newQuestion, setNewQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [participantCount, setParticipantCount] = useState(0)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { emit, on } = useSocket({ autoConnect: false })
  const navigate = useNavigate()
  const { isAuthenticated, user, token, logout } = useAuthStore()

  useEffect(() => {
    if (step === 'manage' && session) {
      const cleanupFunctions = [
        on('session:created', (sessionData: Session) => {
          setSession(sessionData)
          toast.success('Oturum oluşturuldu!')
        }),

        on('participant:count', (count: number) => {
          setParticipantCount(count)
        }),

        on('answer:new', () => {
          toast('Yeni cevap geldi! 🌱', { duration: 2000 })
        }),

        on('error', (error: { message: string }) => {
          toast.error(error.message)
        })
      ]

      return () => {
        cleanupFunctions.forEach(cleanup => cleanup())
      }
    }
  }, [step, session, on])

  const handleCreateSession = async () => {
    // Check if user is authenticated
    if (!isAuthenticated || !token) {
      setShowLoginModal(true)
      return
    }

    if (!title.trim() || !question.trim()) {
      toast.error('Lütfen başlık ve soru giriniz')
      return
    }

    setIsLoading(true)
    try {
      // Use REST API instead of Socket.io for authenticated session creation
      const response = await sessionService.createSession({
        title: title.trim(),
        question: question.trim()
      }, token)

      if (response.success) {
        setSession({
          _id: response.data.sessionId,
          title: response.data.title,
          question: response.data.question,
          isActive: response.data.isActive
        })
        setStep('manage')
        toast.success('Oturum oluşturuldu!')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Oturum oluşturulamadı')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublishQuestion = async () => {
    if (!newQuestion.trim() || !session || !token) {
      toast.error('Lütfen yeni soru giriniz')
      return
    }

    try {
      await sessionService.updateSession(session._id, newQuestion.trim(), token)
      setSession(prev => prev ? { ...prev, question: newQuestion.trim() } : null)
      setNewQuestion('')
      toast.success('Yeni soru yayınlandı!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Soru güncellenemedi')
    }
  }

  const handleEndSession = async () => {
    if (!session || !token) return

    if (confirm('Oturumu sonlandırmak istediğinizden emin misiniz?')) {
      try {
        await sessionService.endSession(session._id, token)
        setSession(prev => prev ? { ...prev, isActive: false } : null)
        toast.success('Oturum sonlandırıldı')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Oturum sonlandırılamadı')
      }
    }
  }

  const handleViewTree = () => {
    if (session) {
      window.open(`/display/${session._id}`, '_blank')
    }
  }

  if (step === 'create') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="card space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Yeni Oturum Oluştur
              </h1>
              <p className="text-gray-600">
                Katılımcılar için interaktif bir soru-cevap oturumu başlatın
              </p>
              {isAuthenticated && user && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    Hoş geldiniz, <strong>{user.name}</strong>
                  </p>
                  <button
                    onClick={logout}
                    className="text-sm text-green-600 hover:text-green-700 mt-1"
                  >
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oturum Başlığı
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: Geleceğin Teknolojileri"
                  className="input-field"
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İlk Soru
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Katılımcılara sormak istediğiniz soruyu yazın..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {question.length}/500 karakter
                </p>
              </div>

              <button
                onClick={handleCreateSession}
                disabled={isLoading || !title.trim() || !question.trim()}
                className="btn-primary w-full"
              >
                {isLoading ? 'Oluşturuluyor...' : 'Oturumu Başlat'}
              </button>

              <button
                onClick={() => navigate('/')}
                className="btn-secondary w-full"
              >
                Ana Sayfaya Dön
              </button>
            </div>
          </div>
        </div>
        
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false)
            // After successful login, try to create session again
            handleCreateSession()
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{session?.title}</h1>
              <p className="text-sm text-gray-600">
                {participantCount} katılımcı
                {session && !session.isActive && ' • Oturum sona erdi'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{user.name}</span>
                  <button
                    onClick={logout}
                    className="ml-2 text-red-600 hover:text-red-700"
                  >
                    Çıkış
                  </button>
                </div>
              )}
              <button
                onClick={handleViewTree}
                className="btn-secondary"
              >
                Ağacı Görüntüle
              </button>
              {session?.isActive && (
                <button
                  onClick={handleEndSession}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Oturumu Sonlandır
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mevcut Soru</h2>
          <p className="text-gray-700 mb-6 p-4 bg-gray-50 rounded-lg">
            {session?.question}
          </p>

          {session?.isActive && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Yeni Soru Yayınla</h3>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Yeni soru yazın..."
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                maxLength={500}
              />
              <button
                onClick={handlePublishQuestion}
                disabled={!newQuestion.trim()}
                className="btn-primary"
              >
                Soruyu Yayınla
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Oturum Bilgileri</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Durum:</span>
              <span className={`font-medium ${session?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {session?.isActive ? 'Aktif' : 'Pasif'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Katılımcı Sayısı:</span>
              <span className="font-medium">{participantCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Oturum ID:</span>
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {session?._id}
              </span>
            </div>
          </div>

          {session?.isActive && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Katılımcı Davet Linki</h4>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={`${window.location.origin}/session/${session._id}`}
                  readOnly
                  className="flex-1 text-sm bg-white border border-blue-200 rounded px-2 py-1"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/session/${session._id}`)
                    toast.success('Link kopyalandı!')
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Kopyala
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}