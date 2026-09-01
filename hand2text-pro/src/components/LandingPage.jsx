import React, { useState } from 'react'
import Header from './landing/Header'
import HeroSection from './landing/HeroSection'
import HowItWorks from './landing/HowItWorks'
import Features from './landing/Features'
import Footer from './landing/Footer'

const LandingPage = ({ onGetStarted, onLoginSuccess }) => {
  return (
    <div className="bg-slate-900 light:bg-slate-50 text-slate-100 light:text-slate-900 min-h-screen transition-colors duration-300">
      <Header onGetStarted={onGetStarted} />
      <HeroSection onGetStarted={onGetStarted} />
      <HowItWorks />
      <Features />
      <Footer />
    </div>
  )
}

export default LandingPage
