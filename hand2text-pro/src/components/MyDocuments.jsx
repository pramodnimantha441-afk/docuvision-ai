import React, { useContext } from 'react'
import { LogOut, FileText, Settings, LayoutDashboard, Shield, Download, Moon, Sun, Search, Filter, Trash2, CheckCircle2 } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import { ThemeContext } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import * as api from '../services/api'
import toast from 'react-hot-toast'

const MyDocuments = ({ onNavigate }) => {
  const { logout: appLogout, recentDocuments, loadDocumentsFromDB, setEditorContent, setSummaryData } = useContext(AppContext)
  const { isDark, toggleTheme } = useContext(ThemeContext)
  const { currentUser, signOut } = useAuth()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filterStatus, setFilterStatus] = React.useState('all')

  const handleLogout = async () => {
    await signOut()
    appLogout()
    onNavigate('login')
  }

  const handleDelete = async (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await api.deleteDocument(docId)
        toast.success('Document deleted successfully')
        loadDocumentsFromDB()
      } catch (error) {
        console.error('Error deleting document:', error)
        toast.error('Failed to delete document')
      }
    }
  }

  const handleView = (doc) => {
    setEditorContent(doc.transcribed_text || '')
    setSummaryData(doc)
    onNavigate('editor')
  }

  const filteredDocuments = recentDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const docStatus = doc.status || 'Completed'
    const matchesStatus = filterStatus === 'all' || docStatus.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

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
              <p className="text-xs text-slate-400 light:text-slate-600">My Digitized Documents</p>
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
              <span>AI Storage</span>
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700/50 light:hover:bg-slate-200/50 text-slate-300 light:text-slate-700 font-medium transition-all hover:text-white light:hover:text-slate-900">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button 
              onClick={() => onNavigate('documents')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-700/50 light:bg-slate-200/50 text-slate-300 light:text-slate-700 font-medium transition-all hover:bg-slate-600 light:hover:bg-slate-300">
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
          <div className="max-w-5xl mx-auto">
            {/* Page Title */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-slate-100 light:text-slate-900 mb-2">
                My Documents
              </h2>
              <p className="text-slate-400 light:text-slate-600 text-lg">
                Manage and view all your digitized documents
              </p>
            </div>

            {/* Search and Filter */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-4 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-700/30 light:bg-slate-100/50 backdrop-blur-sm border border-slate-600/30 light:border-slate-300/30 hover:border-slate-500/50 light:hover:border-slate-300 rounded-lg text-white light:text-slate-900 placeholder-slate-500 light:placeholder-slate-700 input-focus transition-all outline-none"
                  />
                </div>
              </div>
              <div className="relative">
                <Filter className="w-5 h-5 absolute left-4 top-3 text-slate-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-700/30 light:bg-slate-100/50 backdrop-blur-sm border border-slate-600/30 light:border-slate-300/30 hover:border-slate-500/50 light:hover:border-slate-300 rounded-lg text-white light:text-slate-900 input-focus transition-all appearance-none cursor-pointer outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Processing">Processing</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Documents List */}
            <div className="space-y-4">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <div key={doc.id} className="card-glass p-6 transition-all hover:scale-[1.01]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-slate-700/50 light:bg-slate-200/50 rounded-xl">
                          <FileText className="w-8 h-8 text-indigo-400 light:text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-white light:text-slate-900">{doc.name}</h4>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-400 light:text-slate-600">
                            <span>{new Date(doc.date).toLocaleString()}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {doc.status || 'Completed'}
                            </span>
                            {doc.confidence && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                <span className="text-indigo-300">Confidence: {(doc.confidence * 100).toFixed(1)}%</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto">
                        <button
                          onClick={() => handleView(doc)}
                          className="flex-1 md:flex-none inline-flex justify-center items-center gap-2 px-4 py-2 text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:bg-slate-700/50 light:hover:bg-slate-200/50 rounded-lg transition-all border border-slate-600/30 light:border-slate-300/30 hover:border-slate-500/50 light:hover:border-slate-300"
                        >
                          <FileText className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="flex-none inline-flex items-center justify-center p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 light:hover:bg-slate-200/50 rounded-lg transition-all border border-transparent hover:border-red-500/30"
                          title="Delete Document"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Summary Preview */}
                    {doc.key_points && doc.key_points.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-700/30 light:border-slate-300/30">
                        <p className="text-sm font-semibold text-slate-300 light:text-slate-700 mb-2">Key Points:</p>
                        <ul className="list-disc pl-5 text-sm text-slate-400 light:text-slate-600 space-y-1">
                          {doc.key_points.slice(0, 2).map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                          {doc.key_points.length > 2 && (
                            <li className="text-indigo-400">+{doc.key_points.length - 2} more points...</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="card-glass p-12 text-center">
                  <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4 opacity-50" />
                  <p className="text-slate-400 light:text-slate-600 text-lg">
                    {searchTerm || filterStatus !== 'all' ? 'No documents match your search' : 'No documents yet'}
                  </p>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25"
                  >
                    <FileText className="w-4 h-4" />
                    Go to Dashboard to Upload
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default MyDocuments
