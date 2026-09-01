import React from 'react'
import { Lock, Zap, Shield, FileText, Cloud, Cpu } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Cloud,
      title: '100% Offline',
      description: 'No internet required. Everything runs locally on your device for ultimate privacy and security.',
      highlight: true,
      color: 'emerald'
    },
    {
      icon: Cpu,
      title: 'Custom CRNN Model',
      description: 'Specialized handwriting recognition trained on diverse writing styles. Industry-leading accuracy.',
      highlight: false,
      color: 'blue'
    },
    {
      icon: Shield,
      title: 'Local NLP Summarization',
      description: 'Intelligent text processing directly on your device. Extract insights without leaving your computer.',
      highlight: false,
      color: 'emerald'
    },
    {
      icon: Lock,
      title: 'Military-Grade Security',
      description: 'Your handwriting never leaves your device. No tracking, no data collection, no compromise.',
      highlight: false,
      color: 'blue'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process multiple documents in seconds. No waiting for cloud servers or API responses.',
      highlight: false,
      color: 'emerald'
    },
    {
      icon: FileText,
      title: 'Multiple Export Formats',
      description: 'Save as TXT, PDF, DOCX, or copy directly to clipboard. Works with any application.',
      highlight: false,
      color: 'blue'
    },
  ]

  return (
    <section
      id="features"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 light:bg-slate-50 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 light:text-slate-900 mb-4 transition-colors duration-300">
            Powerful Features
          </h2>
          <p className="text-lg text-slate-400 light:text-slate-600 max-w-2xl mx-auto transition-colors duration-300">
            Everything you need to transform handwriting into actionable text
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isEmerald = feature.color === 'emerald'
            const bgColor = isEmerald ? 'bg-emerald-900/20' : 'bg-indigo-900/20'
            const textColor = isEmerald ? 'text-emerald-400' : 'text-indigo-400'
            const borderColor = isEmerald ? 'border-emerald-500/30' : 'border-indigo-500/30'

            return (
              <div
                key={index}
                className={`rounded-xl p-8 transition-all duration-300 h-full ${
                  feature.highlight
                    ? `bg-slate-800/80 light:bg-white backdrop-blur-xl border-2 ${borderColor} shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:scale-105`
                    : `bg-slate-800/50 light:bg-white backdrop-blur-sm border border-slate-700/50 light:border-slate-200 hover:shadow-lg hover:shadow-indigo-500/10 hover:scale-105`
                }`}
              >
                {/* Badge for highlighted feature */}
                {feature.highlight && (
                  <div className="inline-block mb-4 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                    CORE FEATURE
                  </div>
                )}

                {/* Icon */}
                <div className={`${bgColor} ${textColor} w-14 h-14 rounded-lg flex items-center justify-center mb-6`}>
                  <Icon size={28} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-100 light:text-slate-900 mb-3 transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 light:text-slate-600 leading-relaxed transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-900/40 to-indigo-900/40 light:from-emerald-100 light:to-indigo-100 border border-emerald-500/20 light:border-emerald-500/50 rounded-xl p-8 sm:p-12 text-center text-white light:text-slate-900 backdrop-blur-sm transition-colors duration-300">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-emerald-400 light:text-emerald-700 transition-colors duration-300">
            Ready to digitize your handwriting?
          </h3>
          <p className="text-slate-300 light:text-slate-700 mb-6 max-w-2xl mx-auto transition-colors duration-300">
            Start converting your handwritten notes today. No signup required. No limitations.
          </p>
          <a
            href="#hero-upload"
            className="inline-block px-8 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Get Started Now
          </a>
        </div>
      </div>
    </section>
  )
}

export default Features
