import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { sessionService } from '../services/sessionService'

export default function AdminCreateSession() {
  const [title, setTitle] = useState('')
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useAuthStore()
  const navigate = useNavigate()

  const handleCreateSession = async () => {
    if (!title.trim() || !question.trim()) {
      toast.error('Lütfen başlık ve soru giriniz')
      return
    }

    if (!token) {
      toast.error('Oturum oluşturmak için giriş yapın')
      navigate('/admin')
      return
    }

    setIsLoading(true)
    try {
      const response = await sessionService.createSession({
        title: title.trim(),
        question: question.trim()
      }, token)

      if (response.success) {
        toast.success('Oturum oluşturuldu!')
        navigate(`/admin/session/${response.data.sessionId}`)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Oturum oluşturulamadı')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Geri
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Yeni Oturum Oluştur</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
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
            <p className="text-sm text-gray-500 mt-1">
              {title.length}/200 karakter
            </p>
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Not:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Oturum oluşturduktan sonra katılımcı linki otomatik oluşturulacak</li>
              <li>• Oturum aktif olduğu sürece yeni sorular yayınlayabilirsiniz</li>
              <li>• Katılımcı cevapları gerçek zamanlı olarak görüntülenecek</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="btn-secondary"
            >
              İptal
            </button>
            <button
              onClick={handleCreateSession}
              disabled={isLoading || !title.trim() || !question.trim()}
              className="btn-primary"
            >
              {isLoading ? 'Oluşturuluyor...' : 'Oturumu Oluştur'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}