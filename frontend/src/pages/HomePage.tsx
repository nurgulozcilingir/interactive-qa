import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export default function HomePage() {
  const [sessionId, setSessionId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleJoinSession = async () => {
    if (!sessionId.trim()) {
      toast.error('Lütfen oturum ID giriniz')
      return
    }

    setIsLoading(true)
    try {
      // Check if session exists
      const response = await fetch(`/api/sessions/${sessionId}`)
      if (response.ok) {
        navigate(`/session/${sessionId}`)
      } else {
        toast.error('Oturum bulunamadı')
      }
    } catch (error) {
      toast.error('Bağlantı hatası')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            İnteraktif Soru-Cevap Ağacı
          </h1>
          <p className="text-gray-600">
            Cevaplarınız gerçek zamanlı olarak ağaç yapraklarına dönüşür
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Oturuma Katıl</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Oturum ID"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="input-field"
              onKeyPress={(e) => e.key === 'Enter' && handleJoinSession()}
            />
            <button
              onClick={handleJoinSession}
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Katılınıyor...' : 'Oturuma Katıl'}
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Mobil cihazınızdan katılabilir ve büyük ekranda izleyebilirsiniz</p>
        </div>
      </div>
    </div>
  )
}