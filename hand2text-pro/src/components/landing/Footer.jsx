import React from 'react'
import { Github, Mail, Heart, Hand, Lock } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 light:bg-slate-50 text-slate-100 light:text-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Hand className="w-8 h-8 text-emerald-400 light:text-emerald-600 transition-colors duration-300" />
              <span className="text-xl font-bold text-emerald-400 light:text-emerald-600 transition-colors duration-300">Hand2Text Pro</span>
            </div>
            <p className="text-slate-400 light:text-slate-600 text-sm transition-colors duration-300">
              Transform handwritten notes into digital text securely and privately.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white light:text-slate-900 mb-4 transition-colors duration-300">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#hero"
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  How it Works
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#hero-upload"
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Try Now
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-white light:text-slate-900 mb-4 transition-colors duration-300">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#privacy"
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#disclaimer"
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white light:text-slate-900 mb-4 transition-colors duration-300">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400">
                <Mail size={18} className="text-emerald-400" />
                <a
                  href="mailto:support@hand2text.pro"
                  className="hover:text-emerald-400 transition-colors text-sm"
                >
                  support@hand2text.pro
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Github size={18} className="text-emerald-400" />
                <a
                  href="https://github.com/hand2text"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors text-sm"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 light:border-slate-200 my-8 transition-colors duration-300" />

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <p className="text-slate-400 light:text-slate-600 text-sm text-center sm:text-left transition-colors duration-300">
            © {currentYear} Hand2Text Pro. All rights reserved.
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> Crafted with </span>
            <Heart size={16} className="inline text-emerald-400 light:text-emerald-600 mx-1 transition-colors duration-300" />
            <span className="hidden sm:inline">for privacy advocates.</span>
          </p>

          {/* Security Badge */}
          <div className="flex items-center gap-2 bg-slate-800 light:bg-white px-4 py-2 rounded-lg transition-colors duration-300 border border-transparent light:border-slate-200">
            <Lock className="w-5 h-5 text-emerald-400 light:text-emerald-600 transition-colors duration-300" />
            <span className="text-sm text-slate-300 light:text-slate-700 transition-colors duration-300">100% Privacy Guaranteed</span>
          </div>
        </div>

        {/* Accessibility Info */}
        <div className="mt-6 text-xs text-slate-500 light:text-slate-400 text-center transition-colors duration-300">
          <p>
            Hand2Text Pro is committed to accessibility. 
            <a href="#accessibility" className="text-emerald-400 light:text-emerald-600 hover:underline ml-1 transition-colors duration-300">
              Learn more
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
