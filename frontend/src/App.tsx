import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SessionPage from './pages/SessionPage'
import TreeDisplayPage from './pages/TreeDisplayPage'
import AdminPage from './pages/AdminPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminCreateSession from './pages/AdminCreateSession'
import AdminSessionDetail from './pages/AdminSessionDetail'
import { useAuthStore } from './store/authStore'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin" replace />
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/session/:sessionId" element={<SessionPage />} />
        <Route path="/display/:sessionId" element={<TreeDisplayPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/create-session" element={
          <ProtectedRoute>
            <AdminCreateSession />
          </ProtectedRoute>
        } />
        <Route path="/admin/session/:sessionId" element={
          <ProtectedRoute>
            <AdminSessionDetail />
          </ProtectedRoute>
        } />
        
        {/* Redirect old moderator route to admin */}
        <Route path="/moderator" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  )
}

export default App