import React, { useState } from 'react'
import { Upload, FileUp, Lock, Rocket, Sparkles } from 'lucide-react'

const HeroSection = ({ onGetStarted }) => {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = React.useRef(null)

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
      onGetStarted()
    }
  }

  const handleFileSelect = () => {
    onGetStarted()
  }

  return (
    <section
      id="hero"
      className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-900 light:bg-slate-50 transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-100 light:text-slate-900 mb-6 leading-tight transition-colors duration-300">
            Digitize Your
            <br />
            <span className="text-emerald-500 light:text-emerald-600">Handwriting. Securely.</span>
          </h1>
          <p className="text-xl text-slate-400 light:text-slate-600 max-w-2xl mx-auto transition-colors duration-300">
            Convert handwritten notes to digital text instantly. 100% offline, completely private.
            No cloud uploads. Your data, your control.
          </p>
        </div>

        {/* Upload Box */}
        <div
          id="hero-upload"
          className={`mt-16 relative transition-all duration-300 ${
            dragActive ? 'transform scale-105' : ''
          }`}
        >
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-12 sm:p-16 text-center transition-all duration-300 cursor-pointer ${
              dragActive
                ? 'border-emerald-500 bg-emerald-900/20 light:bg-emerald-100/50'
                : 'border-slate-700 light:border-slate-300 bg-slate-800/50 light:bg-white hover:border-emerald-500 light:hover:border-emerald-500'
            }`}
            role="button"
            aria-label="Upload your handwritten notes"
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                fileInputRef.current?.click()
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="File upload input"
            />

            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-emerald-500/20 light:bg-emerald-100 rounded-full w-fit">
                <Upload
                  size={32}
                  className="text-emerald-400 light:text-emerald-600"
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-100 light:text-slate-900 mb-2">
                  Upload Your Notes
                </h2>
                <p className="text-slate-400 light:text-slate-600 mb-4">
                  Drag and drop your images or PDFs here, or click to select files
                </p>
                <p className="text-sm text-slate-500 light:text-slate-400">
                  Supported formats: JPG, PNG, PDF
                </p>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-6 px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                aria-label="Click to select files"
              >
                <FileUp className="inline mr-2" size={20} />
                Choose Files
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-8 text-sm text-slate-400 light:text-slate-600 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-emerald-500 light:text-emerald-600" />
            <span>100% Offline</span>
          </div>
          <div className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-emerald-500 light:text-emerald-600" />
            <span>Lightning Fast</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-500 light:text-emerald-600" />
            <span>AI Powered</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
