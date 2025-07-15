import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { sessionService } from '../services/sessionService'
import { useSocket } from '../hooks/useSocket'

interface Session {
  _id: string
  title: string
  question: string
  isActive: boolean
  createdAt: string
  sessionId?: string
}

export default function AdminSessionDetail() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [session, setSession] = useState<Session | null>(null)
  const [newQuestion, setNewQuestion] = useState('')
  const [participantCount, setParticipantCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useAuthStore()
  const navigate = useNavigate()
  const { emit, on } = useSocket({ autoConnect: true })

  useEffect(() => {
    if (!token || !sessionId) {
      navigate('/admin')
      return
    }
    fetchSession()
  }, [token, sessionId, navigate])

  useEffect(() => {
    if (session) {
      const cleanupFunctions = [
        on('participant:count', (count: number) => {
          setParticipantCount(count)
        }),

        on('answer:new', () => {
          toast('Yeni cevap geldi! 🌱', { duration: 2000 })
        }),
      ]

      // Join moderator room
      emit('moderator:join', { sessionId: session._id })

      return () => {
        cleanupFunctions.forEach(cleanup => cleanup())
        emit('moderator:leave', { sessionId: session._id })
      }
    }
  }, [session, on, emit])

  const fetchSession = async () => {
    try {
      const response = await sessionService.getSession(sessionId!)
      if (response.success) {
        setSession(response.data)
      }
    } catch (error) {
      toast.error('Oturum yüklenemedi')
      navigate('/admin/dashboard')
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
      emit('question:publish', {
        sessionId: session._id,
        question: newQuestion.trim()
      })
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
        emit('session:end', { sessionId: session._id })
        toast.success('Oturum sonlandırıldı')
        
        // Navigate back to dashboard after a short delay
        setTimeout(() => {
          navigate('/admin/dashboard')
        }, 1500)
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Oturum bulunamadı</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Geri
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{session.title}</h1>
                <p className="text-sm text-gray-600">
                  {participantCount} katılımcı
                  {!session.isActive && ' • Oturum sona erdi'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleViewTree}
                className="btn-secondary"
              >
                Ağacı Görüntüle
              </button>
              {session.isActive && (
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
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mevcut Soru</h2>
          <p className="text-gray-700 mb-6 p-4 bg-gray-50 rounded-lg">
            {session.question}
          </p>

          {session.isActive && (
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

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Oturum Bilgileri</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Durum:</span>
              <span className={`font-medium ${session.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {session.isActive ? 'Aktif' : 'Pasif'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Katılımcı Sayısı:</span>
              <span className="font-medium">{participantCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Oturum ID:</span>
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {session._id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Oluşturma Tarihi:</span>
              <span className="font-medium">
                {new Date(session.createdAt).toLocaleString('tr-TR')}
              </span>
            </div>
          </div>

          {session.isActive && (
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
      </main>
    </div>
  )
}