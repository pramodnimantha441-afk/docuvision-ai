import React, { useContext, useState, useEffect } from 'react'
import { AppProvider, AppContext } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import LandingPage from './components/LandingPage'
import SecureAccessPortal from './pages/SecureAccessPortal'
import Dashboard from './components/Dashboard'
import MyDocuments from './components/MyDocuments'
import SettingsPage from './components/SettingsPage'
import OrchestrationModal from './components/OrchestrationModal'
import DualPaneWorkspace from './components/DualPaneWorkspace'
import './index.css'

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('landing')
  const { showProcessingModal, startProcessing, setShowProcessingModal } = useContext(AppContext)
  const { currentUser, loading } = useAuth()

  useEffect(() => {
    if (currentUser && currentPage === 'landing') {
      setCurrentPage('dashboard')
    }
  }, [currentUser, currentPage])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
        <p className="text-lg font-medium">Initializing...</p>
      </div>
    )
  }

  const navigateToPage = (page) => {
    setCurrentPage(page)
  }

  // Show landing page to unauthenticated users
  if (currentPage === 'landing') {
    return <LandingPage onGetStarted={() => setCurrentPage('login')} onLoginSuccess={() => setCurrentPage('dashboard')} />
  }

  if (!currentUser) {
    return (
      <SecureAccessPortal
        onLogin={() => setCurrentPage('dashboard')}
      />
    )
  }

  return (
    <>
      <Toaster position='top-right' />
      {currentPage === 'dashboard' && <Dashboard onNavigate={navigateToPage} />}
      {currentPage === 'documents' && <MyDocuments onNavigate={navigateToPage} />}
      {currentPage === 'settings' && <SettingsPage onNavigate={navigateToPage} />}
      {currentPage === 'editor' && <DualPaneWorkspace onNavigate={navigateToPage} />}
      {showProcessingModal && (
        <OrchestrationModal
          onClose={() => setShowProcessingModal(false)}
          onStart={() => {
            setShowProcessingModal(false)
            setCurrentPage('editor')
            startProcessing()
          }}
        />
      )}
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
