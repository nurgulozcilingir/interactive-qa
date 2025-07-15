import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { sessionService } from '../services/sessionService'

interface Session {
  _id: string
  title: string
  question: string
  isActive: boolean
  createdAt: string
  participantCount?: number
}

export default function AdminDashboard() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'active' | 'all'>('active')
  const { user, token, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/admin')
      return
    }
    fetchSessions()
  }, [token, navigate, activeTab])

  const fetchSessions = async () => {
    try {
      setIsLoading(true)
      const response = activeTab === 'active' 
        ? await sessionService.getActiveSessions()
        : await sessionService.getAllSessions()
      if (response.success) {
        setSessions(response.data)
      }
    } catch (error) {
      console.error('Session fetch error:', error)
      toast.error('Oturumlar yüklenemedi: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSession = () => {
    navigate('/admin/create-session')
  }

  const handleViewSession = (sessionId: string) => {
    navigate(`/admin/session/${sessionId}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const activeSessions = sessions.filter(s => s.isActive)
  const displayedSessions = activeTab === 'active' ? activeSessions : sessions

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Paneli</h1>
              <p className="text-sm text-gray-600">Hoş geldiniz, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreateSession}
                className="btn-primary"
              >
                Yeni Oturum Oluştur
              </button>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <nav className="flex space-x-8 px-6 -mb-px">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'active'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Aktif Oturumlar ({activeSessions.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tüm Oturumlar ({sessions.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Yükleniyor...</p>
              </div>
            ) : displayedSessions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  {activeTab === 'active' ? 'Aktif oturum bulunmuyor' : 'Hiç oturum bulunmuyor'}
                </p>
                <button
                  onClick={handleCreateSession}
                  className="btn-primary"
                >
                  İlk Oturumu Oluştur
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Başlık
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Katılımcı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Oluşturma Tarihi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {displayedSessions.map((session) => (
                      <tr key={session._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {session.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {session._id}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            session.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {session.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {session.participantCount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(session.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleViewSession(session._id)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Yönet
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Toplam Oturum</h3>
            <p className="text-3xl font-bold text-gray-700">{sessions.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aktif Oturum</h3>
            <p className="text-3xl font-bold text-green-600">{activeSessions.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Toplam Katılımcı</h3>
            <p className="text-3xl font-bold text-blue-600">
              {sessions.reduce((sum, s) => sum + (s.participantCount || 0), 0)}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}