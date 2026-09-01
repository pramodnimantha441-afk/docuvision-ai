import React from 'react'
import { Upload, Zap, Brain, Download, ArrowRight } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Upload',
      description: 'Select your handwritten notes or documents',
      color: 'emerald'
    },
    {
      icon: Zap,
      title: 'Extract',
      description: 'AI-powered text extraction with high accuracy',
      color: 'blue'
    },
    {
      icon: Brain,
      title: 'Summarize',
      description: 'NLP-based intelligent summarization',
      color: 'emerald'
    },
    {
      icon: Download,
      title: 'Export',
      description: 'Save your processed text in any format',
      color: 'blue'
    },
  ]

  return (
    <section
      id="how-it-works"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50 light:bg-slate-50 backdrop-blur-sm border-y border-slate-700/50 light:border-slate-200 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 light:text-slate-900 mb-4 transition-colors duration-300">
            How It Works
          </h2>
          <p className="text-lg text-slate-400 light:text-slate-600 max-w-2xl mx-auto transition-colors duration-300">
            Four simple steps to transform your handwriting into digital text
          </p>
        </div>

        {/* Steps Container */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isEmerald = step.color === 'emerald'
            const bgColor = isEmerald ? 'bg-emerald-900/20' : 'bg-indigo-900/20'
            const textColor = isEmerald ? 'text-emerald-400' : 'text-indigo-400'
            const borderColor = isEmerald ? 'border-emerald-500/30' : 'border-indigo-500/30'

            return (
              <div key={index} className="relative">
                {/* Step Card */}
                <div
                  className={`bg-slate-800/80 light:bg-white backdrop-blur-xl border-2 ${borderColor} rounded-xl p-8 text-center h-full transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:scale-105`}
                >
                  {/* Step Number */}
                  <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2">
                    <div className={`w-10 h-10 rounded-full ${bgColor} ${textColor} font-bold text-lg flex items-center justify-center border-2 ${borderColor}`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`${bgColor} ${textColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <Icon size={32} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-100 light:text-slate-900 mb-3 transition-colors duration-300">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 light:text-slate-600 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (hide on last item and mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    <div className="text-slate-300 light:text-slate-400">
                      <ArrowRight size={24} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Mobile Flow (vertical arrows) */}
        <div className="md:hidden flex flex-col items-center gap-4">
          {steps.map((_, index) => (
            index < steps.length - 1 && (
              <div key={`arrow-${index}`} className="text-slate-300 transform rotate-90">
                <ArrowRight size={24} />
              </div>
            )
          ))}
        </div>

        {/* Flow Explanation */}
        <div className="mt-16 bg-slate-800/50 light:bg-white backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 light:border-slate-200 shadow-xl transition-colors duration-300">
          <h3 className="text-xl font-bold text-slate-100 light:text-slate-900 mb-4 transition-colors duration-300">Process Overview</h3>
          <div className="grid md:grid-cols-2 gap-6 text-slate-300 light:text-slate-600 transition-colors duration-300">
            <div>
              <p className="font-semibold text-emerald-400 mb-2">✓ Advanced Recognition</p>
              <p>Our custom CRNN model recognizes handwritten text with exceptional accuracy, handling various writing styles and angles.</p>
            </div>
            <div>
              <p className="font-semibold text-indigo-400 mb-2">✓ Intelligent Summarization</p>
              <p>Local NLP processing creates smart summaries of your content, preserving key information while reducing word count.</p>
            </div>
            <div>
              <p className="font-semibold text-emerald-400 mb-2">✓ Privacy First</p>
              <p>Everything happens on your device. No uploads, no tracking, no cloud storage. Your handwriting stays yours.</p>
            </div>
            <div>
              <p className="font-semibold text-indigo-400 mb-2">✓ Multiple Formats</p>
              <p>Export your results as TXT, PDF, DOCX, or copy to clipboard. Perfect for any workflow.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
