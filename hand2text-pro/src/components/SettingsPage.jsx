import React, { useContext, useState } from 'react'
import { LogOut, FileText, Settings, LayoutDashboard, Shield, Moon, Sun, Bell, Lock, Eye } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import { ThemeContext } from '../context/ThemeContext'

const SettingsPage = ({ onNavigate }) => {
  const { logout, currentUser } = useContext(AppContext)
  const { isDark, toggleTheme } = useContext(ThemeContext)
  const [notifications, setNotifications] = useState(true)
  const [autoDownload, setAutoDownload] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogout = () => {
    logout()
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
              <h1 className="text-2xl font-bold text-slate-100 light:text-slate-900">Hand2Text Pro</h1>
              <p className="text-xs text-slate-400 light:text-slate-600">Settings</p>
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
            <div className="badge-secure animate-slideInRight">
              <Shield className="w-4 h-4" />
              100% Offline | Secure
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700/50 light:hover:bg-slate-200/50 text-slate-300 light:text-slate-700 font-medium transition-all hover:text-white light:hover:text-slate-900">
              <FileText className="w-5 h-5" />
              My Documents
            </button>
            <button 
              onClick={() => onNavigate('settings')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-700/50 light:bg-slate-200/50 text-slate-300 light:text-slate-700 font-medium transition-all hover:bg-slate-600 light:hover:bg-slate-300">
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </nav>

          {/* User info */}
          <div className="mt-auto pt-8 border-t border-slate-700/50 light:border-slate-300/50">
            <div className="mb-4 p-4 bg-slate-700/30 light:bg-slate-200/30 rounded-lg border border-slate-600/30 light:border-slate-300/30">
              <p className="text-xs text-slate-500 light:text-slate-600 uppercase font-semibold tracking-wide">Logged in as</p>
              <p className="text-white light:text-slate-900 font-bold mt-2">{currentUser?.username}</p>
              <p className="text-slate-400 light:text-slate-600 text-xs">{currentUser?.email}</p>
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
          <div className="max-w-3xl">
            {/* Page Title */}
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-slate-100 light:text-slate-900 mb-2">
                Settings
              </h2>
              <p className="text-slate-400 light:text-slate-600 text-lg">
                Manage your preferences and account security
              </p>
            </div>

            {/* Account Settings Section */}
            <div className="card-glass p-8 mb-6">
              <h3 className="text-2xl font-bold text-white light:text-slate-900 mb-6 flex items-center gap-2">
                <Lock className="w-6 h-6" />
                Account Settings
              </h3>

              <div className="space-y-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 light:text-slate-700 mb-2 uppercase tracking-wide">
                    Username
                  </label>
                  <input
                    type="text"
                    value={currentUser?.username}
                    disabled
                    className="w-full px-4 py-3 bg-slate-700/30 light:bg-slate-100/50 backdrop-blur-sm border border-slate-600/30 light:border-slate-300/30 rounded-lg text-white light:text-slate-900 placeholder-slate-500 light:placeholder-slate-700 disabled:opacity-50 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 light:text-slate-700 mb-2 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    value={currentUser?.email}
                    disabled
                    className="w-full px-4 py-3 bg-slate-700/30 light:bg-slate-100/50 backdrop-blur-sm border border-slate-600/30 light:border-slate-300/30 rounded-lg text-white light:text-slate-900 placeholder-slate-500 light:placeholder-slate-700 disabled:opacity-50 transition-all"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 light:text-slate-700 mb-2 uppercase tracking-wide">
                    Change Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 bg-slate-700/30 light:bg-slate-100/50 backdrop-blur-sm border border-slate-600/30 light:border-slate-300/30 hover:border-slate-500/50 light:hover:border-slate-300 rounded-lg text-white light:text-slate-900 placeholder-slate-500 light:placeholder-slate-700 input-focus transition-all pr-12"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-300 light:hover:text-slate-600"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <button className="btn-primary w-full py-3">Update Password</button>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="card-glass p-8 mb-6">
              <h3 className="text-2xl font-bold text-white light:text-slate-900 mb-6 flex items-center gap-2">
                <Bell className="w-6 h-6" />
                Preferences
              </h3>

              <div className="space-y-4">
                {/* Notifications Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-700/30 light:bg-slate-100/30 rounded-lg border border-slate-600/30 light:border-slate-300/30 hover:border-slate-500/50 light:hover:border-slate-300 transition-all">
                  <div>
                    <p className="text-white light:text-slate-900 font-medium">Email Notifications</p>
                    <p className="text-slate-400 light:text-slate-600 text-sm">Receive updates about your documents</p>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      notifications ? 'bg-blue-600' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        notifications ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Auto Download Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-700/30 light:bg-slate-100/30 rounded-lg border border-slate-600/30 light:border-slate-300/30 hover:border-slate-500/50 light:hover:border-slate-300 transition-all">
                  <div>
                    <p className="text-white light:text-slate-900 font-medium">Auto Download Results</p>
                    <p className="text-slate-400 light:text-slate-600 text-sm">Automatically download processed documents</p>
                  </div>
                  <button
                    onClick={() => setAutoDownload(!autoDownload)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      autoDownload ? 'bg-blue-600' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        autoDownload ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="card-glass p-8">
              <h3 className="text-2xl font-bold text-white light:text-slate-900 mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Privacy & Security
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-slate-700/30 light:bg-slate-100/30 rounded-lg border border-slate-600/30 light:border-slate-300/30">
                  <p className="text-white light:text-slate-900 font-medium mb-2">Data Processing</p>
                  <p className="text-slate-400 light:text-slate-600 text-sm mb-4">
                    All your data is processed locally on your device. No data is transmitted to external servers.
                  </p>
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <Shield className="w-4 h-4" />
                    Your data is 100% secure and private
                  </div>
                </div>

                <button className="w-full px-4 py-3 bg-red-600/20 light:bg-red-100/30 hover:bg-red-600/30 light:hover:bg-red-100/40 text-red-400 light:text-red-600 rounded-lg transition-all border border-red-600/30 light:border-red-300/30 font-medium">
                  Delete All My Data
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default SettingsPage
