import React, { useState, useEffect } from 'react'
import { Menu, X, Hand, Lock } from 'lucide-react'

const Header = ({ onGetStarted }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    } else if (sectionId === 'hero-upload' || sectionId === 'login') {
      onGetStarted()
      setMobileMenuOpen(false)
    }
  }

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'How it Works', id: 'how-it-works' },
    { label: 'Features', id: 'features' },
    { label: 'Try Now', id: 'login' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/90 light:bg-white/90 backdrop-blur-xl border-b border-slate-700/50 light:border-slate-200'
          : 'bg-slate-900 light:bg-white'
      }`}
      role="banner"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="#hero"
              className="text-2xl font-bold text-emerald-600 flex items-center gap-2"
              aria-label="Hand2Text Pro Home"
            >
              <Hand className="w-8 h-8 text-emerald-600" />
              <span className="hidden sm:inline">Hand2Text Pro</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex gap-8 items-center"
            role="navigation"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-slate-300 light:text-slate-600 hover:text-emerald-400 light:hover:text-emerald-600 font-medium transition-colors duration-200 text-sm lg:text-base"
                aria-label={`Navigate to ${link.label}`}
              >
                {link.label}
              </button>
            ))}
            
            {/* Sign In Button */}
            <button
              onClick={() => onGetStarted()}
              className="ml-4 px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200 flex items-center gap-2"
              aria-label="Sign in to your account"
            >
              <Lock size={18} />
              Sign In
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 light:hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-slate-100 light:text-slate-900" />
            ) : (
              <Menu size={24} className="text-slate-100 light:text-slate-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav
            className="md:hidden py-4 border-t border-slate-700 light:border-slate-200 bg-slate-900 light:bg-white"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-slate-300 light:text-slate-600 hover:text-emerald-400 light:hover:text-emerald-600 font-medium transition-colors py-2 text-left"
                >
                  {link.label}
                </button>
              ))}
              
              <button
                onClick={() => {
                  onGetStarted()
                  setMobileMenuOpen(false)
                }}
                className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200 flex items-center gap-2 w-full justify-center"
                aria-label="Sign in to your account"
              >
                <Lock size={18} />
                Sign In
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
