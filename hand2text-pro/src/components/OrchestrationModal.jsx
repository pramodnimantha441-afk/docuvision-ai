import React, { useContext } from 'react'
import { X, Zap, MessageSquare, Play, Upload, Wrench, Sparkles, Bot } from 'lucide-react'
import { AppContext } from '../context/AppContext'

const ProcessingSteps = [
  { label: 'Uploading', icon: Upload },
  { label: 'Preprocessing (OpenCV)', icon: Wrench },
  { label: 'Extracting Text (CRNN)', icon: Sparkles },
  { label: 'Summarizing (NLP)', icon: Bot }
]

const OrchestrationModal = ({ onClose, onStart }) => {
  const { processingMode, setProcessingMode, processingStep } = useContext(AppContext)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fadeIn transition-colors duration-300">
      <div className="card-glass w-full max-w-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-100 light:text-slate-900">Processing Options</h2>
            <p className="text-slate-400 light:text-slate-600 text-sm mt-2">Choose how to process your document</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 light:hover:bg-slate-200/50 rounded-lg transition-all text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selection */}
        <div className="space-y-3 mb-10">
          {/* Full Transcription */}
          <label className="flex items-start gap-4 p-4 border-2 border-slate-600/30 light:border-slate-300/30 rounded-lg cursor-pointer hover:border-slate-500/50 light:hover:border-slate-300 transition-all hover:bg-slate-700/20 light:hover:bg-slate-200/20" style={{ borderColor: processingMode === 'transcription' ? 'rgb(71 85 105 / 0.5)' : 'inherit' }}>
            <input
              type="radio"
              name="mode"
              value="transcription"
              checked={processingMode === 'transcription'}
              onChange={(e) => setProcessingMode(e.target.value)}
              className="mt-1 w-4 h-4 cursor-pointer"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-700/30 light:bg-slate-200/30 rounded-lg">
                  <Zap className="w-5 h-5 text-slate-300 light:text-slate-700" />
                </div>
                <h3 className="font-semibold text-white light:text-slate-900">Full Transcription</h3>
              </div>
              <p className="text-slate-400 light:text-slate-600 text-sm mt-2 ml-9">
                Extract all handwritten text with maximum detail and formatting preservation.
              </p>
            </div>
          </label>

          {/* AI-Powered Summarization */}
          <label className="flex items-start gap-4 p-4 border-2 border-slate-600/30 light:border-slate-300/30 rounded-lg cursor-pointer hover:border-slate-500/50 light:hover:border-slate-300 transition-all hover:bg-slate-700/20 light:hover:bg-slate-200/20" style={{ borderColor: processingMode === 'summarization' ? 'rgb(71 85 105 / 0.5)' : 'inherit' }}>
            <input
              type="radio"
              name="mode"
              value="summarization"
              checked={processingMode === 'summarization'}
              onChange={(e) => setProcessingMode(e.target.value)}
              className="mt-1 w-4 h-4 cursor-pointer"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-700/30 light:bg-slate-200/30 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-slate-300 light:text-slate-700" />
                </div>
                <h3 className="font-semibold text-white light:text-slate-900">AI-Powered Summarization</h3>
              </div>
              <p className="text-slate-400 light:text-slate-600 text-sm mt-2 ml-9">
                Get a concise summary of key points and action items from your notes.
              </p>
            </div>
          </label>
        </div>

        {/* Processing Steps Preview */}
        <div className="mb-10 p-6 bg-slate-700/20 light:bg-slate-200/20 rounded-lg border border-slate-600/30 light:border-slate-300/30 transition-colors duration-300">
          <p className="text-xs font-semibold text-slate-400 light:text-slate-600 uppercase mb-4 tracking-widest">Processing Pipeline</p>
          <div className="space-y-3">
            {ProcessingSteps.map((step, idx) => {
              const IconComponent = step.icon
              return (
                <div key={idx} className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      idx <= processingStep
                        ? 'bg-slate-700 light:bg-slate-300 text-white light:text-slate-900 shadow-lg'
                        : 'bg-slate-700 light:bg-slate-200 text-slate-400 light:text-slate-600'
                    }`}
                  >
                    {idx < processingStep ? '✓' : idx + 1}
                  </div>
                  <div>
                    <span className={idx <= processingStep ? 'text-white light:text-slate-900 font-semibold' : 'text-slate-400 light:text-slate-600'}>
                      {step.label}
                    </span>
                    <IconComponent className="w-4 h-4 text-slate-400 light:text-slate-600 ml-2 inline" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={onStart}
            className="btn-primary flex-1 flex items-center justify-center gap-2 text-base font-semibold py-3"
          >
            <Play className="w-4 h-4" />
            Start Processing
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrchestrationModal
