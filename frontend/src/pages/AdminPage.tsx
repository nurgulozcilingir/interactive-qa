import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import LoginModal from '../components/auth/LoginModal'

export default function AdminPage() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      navigate('/admin/dashboard')
    } else {
      // Show login modal if not authenticated
      setShowLoginModal(true)
    }
  }, [isAuthenticated, navigate])

  const handleLoginSuccess = () => {
    setShowLoginModal(false)
    navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Girişi</h1>
        <p className="text-gray-600">Oturum yönetimi için giriş yapın</p>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false)
          navigate('/')
        }}
        onSuccess={handleLoginSuccess}
      />
    </div>
  )
}