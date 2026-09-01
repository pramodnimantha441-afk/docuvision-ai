import React, { useContext } from 'react'
import { LogOut, FileText, Settings, LayoutDashboard, Shield, Download, Zap, Moon, Sun } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import { ThemeContext } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

const Dashboard = ({ onNavigate }) => {
  const { logout: appLogout, recentDocuments, handleFileUpload } = useContext(AppContext)
  const { isDark, toggleTheme } = useContext(ThemeContext)
  const { currentUser, signOut } = useAuth()
  const [dragActive, setDragActive] = React.useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleLogout = async () => {
    await signOut()
    appLogout()
    onNavigate('login')
  }

  return (
    <div className="min-h-screen bg-slate-900 light:bg-white transition-colors duration-300">
      {/* Header */}
      <header className="bg-slate-800/50 light:bg-slate-100/50 backdrop-blur-xl border-b border-slate-700/50 light:border-slate-300/50 sticky top-0 z-40 shadow-lg transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 animate-slideInLeft">
            <div className="p-2 bg-slate-700/30 light:bg-slate-200/30 rounded-lg border border-slate-600/30 light:border-slate-300/30 shadow-lg">
              <FileText className="w-6 h-6 text-slate-300 light:text-slate-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 light:text-slate-900">DocuVision AI</h1>
              <p className="text-xs text-slate-400 light:text-slate-600">Handwritten Document Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-700/50 light:bg-slate-200/50 hover:bg-slate-600 light:hover:bg-slate-300 transition-all text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="badge-secure animate-slideInRight flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>AI Processing Active</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800/50 light:bg-slate-100/50 backdrop-blur-xl border-r border-slate-700/50 light:border-slate-300/50 p-6 shadow-xl overflow-y-auto transition-colors duration-300">
          <nav className="space-y-2">
            <div className="text-xs font-semibold text-slate-400 light:text-slate-600 uppercase tracking-widest mb-4 pl-4">
              Navigation
            </div>
            <button 
              onClick={() => onNavigate('dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-700/50 light:bg-slate-200/50 text-slate-300 light:text-slate-700 font-medium transition-all hover:bg-slate-600 light:hover:bg-slate-300">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button 
              onClick={() => onNavigate('documents')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700/50 light:hover:bg-slate-200/50 text-slate-300 light:text-slate-700 font-medium transition-all hover:text-white light:hover:text-slate-900">
              <FileText className="w-5 h-5" />
              My Documents
            </button>
            <button 
              onClick={() => onNavigate('settings')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700/50 light:hover:bg-slate-200/50 text-slate-300 light:text-slate-700 font-medium transition-all hover:text-white light:hover:text-slate-900">
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </nav>

          {/* User info */}
          <div className="mt-auto pt-8 border-t border-slate-700/50 light:border-slate-300/50">
            <div className="mb-4 p-4 bg-slate-700/30 light:bg-slate-200/30 rounded-lg border border-slate-600/30 light:border-slate-300/30 flex flex-col items-center">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="w-10 h-10 rounded-full mb-2" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mb-2">
                  {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0)}
                </div>
              )}
              <p className="text-white light:text-slate-900 font-bold mt-2 text-center">{currentUser?.displayName || 'User'}</p>
              <p className="text-slate-400 light:text-slate-600 text-xs text-center truncate w-full" title={currentUser?.email}>{currentUser?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-700/50 light:bg-slate-200/50 backdrop-blur-sm hover:bg-slate-600/60 light:hover:bg-slate-300/60 text-white light:text-slate-900 rounded-lg transition-all text-sm font-medium border border-slate-600/30 light:border-slate-300/30"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 animate-fadeIn bg-slate-900 light:bg-white transition-colors duration-300">
          <div className="max-w-5xl">
            {/* Welcome section */}
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-slate-100 light:text-slate-900 mb-2">
                Welcome back, {currentUser?.displayName?.split(' ')[0] || 'User'}!
              </h2>
              <p className="text-slate-400 light:text-slate-600 text-lg">
                Upload your handwritten notes to get started with digitization
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <div className="card-glass p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 light:text-slate-600 text-sm uppercase tracking-wide">Documents</p>
                    <p className="text-3xl font-bold text-slate-200 light:text-slate-900 mt-2">{recentDocuments.length}</p>
                  </div>
                  <FileText className="w-10 h-10 text-slate-400 light:text-slate-600" />
                </div>
              </div>
              <div className="card-glass p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 light:text-slate-600 text-sm uppercase tracking-wide">Model</p>
                    <p className="text-3xl font-bold text-slate-200 light:text-slate-900 mt-2">CRNN</p>
                  </div>
                  <Zap className="w-10 h-10 text-slate-400 light:text-slate-600" />
                </div>
              </div>
              <div className="card-glass p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 light:text-slate-600 text-sm uppercase tracking-wide">Security</p>
                    <p className="text-3xl font-bold text-slate-200 light:text-slate-900 mt-2">100%</p>
                  </div>
                  <Shield className="w-10 h-10 text-slate-400 light:text-slate-600" />
                </div>
              </div>
            </div>

            {/* Upload Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`card-glass p-16 text-center cursor-pointer transition-all border-2 ${
                dragActive 
                  ? 'bg-slate-700/40 light:bg-slate-300/40 border-slate-500 shadow-lg' 
                  : 'border-slate-600/30 light:border-slate-300/30 hover:border-slate-500/50 light:hover:border-slate-300 hover:bg-slate-700/20 light:hover:bg-slate-200/20'
              }`}
            >
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-slate-700/30 light:bg-slate-200/30 rounded-2xl border border-slate-600/30 light:border-slate-300/30 shadow-lg animate-float">
                  <FileText className="w-14 h-14 text-slate-300 light:text-slate-700" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white light:text-slate-900 mb-3">Drag & Drop Your Notes</h3>
              <p className="text-slate-300 light:text-slate-700 mb-8 max-w-lg mx-auto">
                Upload scanned images (JPG, PNG) of your handwritten notes. Processing happens securely.
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  multiple
                />
                <span className="btn-primary inline-flex cursor-pointer text-base py-3 px-6">
                  <FileText className="w-5 h-5 mr-2" />
                  Browse Files
                </span>
              </label>
            </div>

            {/* Recent Documents */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-white light:text-slate-900 mb-6">Recent Documents</h3>
              <div className="card-glass overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/30 light:border-slate-300/30 bg-slate-900/30 light:bg-slate-100/30">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wide">
                          File Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wide">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wide">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wide">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentDocuments.slice(0, 5).map((doc) => (
                        <tr key={doc.id} className="border-b border-slate-700/20 light:border-slate-300/20 hover:bg-slate-700/20 light:hover:bg-slate-200/20 transition-all">
                          <td className="px-6 py-4">
                            <span className="text-white light:text-slate-900 font-medium flex items-center gap-2">
                              <FileText className="w-4 h-4 text-slate-400" />
                              {doc.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-400 light:text-slate-600">{new Date(doc.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-700/50 light:bg-slate-200/50 text-slate-300 light:text-slate-700 rounded-full text-xs font-semibold border border-slate-600/30 light:border-slate-300/30">
                              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                              {doc.status || 'Completed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => onNavigate('editor')}
                              className="inline-flex items-center gap-2 px-4 py-2 text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:bg-slate-700/50 light:hover:bg-slate-200/50 rounded-lg transition-all border border-slate-600/30 light:border-slate-300/30 hover:border-slate-500/50 light:hover:border-slate-300"
                            >
                              <Download className="w-4 h-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                      {recentDocuments.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                            No documents found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
