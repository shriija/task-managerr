import React, { useState } from 'react'
import { useAuthStore } from '../../context/AuthContext'
import Navigation from './Navigation'
import HeroSection from './HeroSection'
import StatsSection from './StatsSection'
import FeaturesSection from './FeaturesSection'
import CtaSection from './CtaSection'
import Footer from './Footer'

function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const startPath = isAuthenticated ? "/dashboard" : "/register"
  const [activeShowcase, setActiveShowcase] = useState("board")

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-body selection:bg-primary-100 selection:text-primary-900">
      <Navigation isAuthenticated={isAuthenticated} startPath={startPath} />
      <HeroSection startPath={startPath} activeShowcase={activeShowcase} setActiveShowcase={setActiveShowcase} />
      <StatsSection />
      <FeaturesSection />
      <CtaSection startPath={startPath} />
      <Footer />
    </div>
  )
}

export default Home
