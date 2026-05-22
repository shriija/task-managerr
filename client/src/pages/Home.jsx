import React, { useState } from 'react'
import { NavLink } from 'react-router'
import { useAuthStore } from '../context/AuthContext'

/**
 * Home Component
 * 
 * The landing page of the Kanvas application. 
 * Displays features, an interactive product showcase (mockup), and productivity stats.
 * Provides dynamic navigation depending on whether the user is authenticated.
 */
function Home() {
  // Access global authentication state to determine CTA routing
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const startPath = isAuthenticated ? "/dashboard" : "/register"
  
  // State for toggling between different views in the mockup showcase section
  const [activeShowcase, setActiveShowcase] = useState("board")

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-body selection:bg-primary-100 selection:text-primary-900">
      
      {/* ─── NAVIGATION ─── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-primary-500/20">
              K
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900">Kanvas</span>
          </div>
          
          {/* Main Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#showcase" className="hover:text-primary-600 transition-colors">Walkthrough</a>
            <a href="#cta" className="hover:text-primary-600 transition-colors">Get Started</a>
          </nav>
          
          {/* Conditional Auth Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <NavLink 
                to="/dashboard" 
                className="text-sm font-semibold text-white bg-slate-950 hover:bg-slate-800 px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                Go to Dashboard
              </NavLink>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors"
                >
                  Sign In
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-primary-500/10"
                >
                  Get Started
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="pt-20 pb-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-8 border border-slate-200/50">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            Simple & intuitive project management
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Streamline your workflow.<br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-primary-600 to-indigo-600">Focus on what matters.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Plan tasks, track real-time progress, and collaborate seamlessly with your team in a clean, professional workspace designed for execution.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <NavLink 
              to={startPath} 
              className="text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary-500/10"
            >
              Start for Free
            </NavLink>
            <a 
              href="#showcase" 
              className="text-base font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-6 py-3 rounded-xl transition-all"
            >
              See How It Works
            </a>
          </div>

          {/* Clean Mockup Panel / Interactive Showcase */}
          <div id="showcase" className="max-w-5xl mx-auto bg-slate-950 rounded-2xl p-4 shadow-2xl shadow-slate-950/20 border border-slate-800/80 scroll-mt-20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              {/* Window Controls Decoration */}
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/85"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/85"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/85"></span>
              </div>
              {/* View Toggle Controls */}
              <div className="flex gap-1 bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                <button 
                  onClick={() => setActiveShowcase("board")}
                  className={`text-xs font-semibold px-3 py-1 rounded-md transition-all cursor-pointer ${
                    activeShowcase === "board" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Board View
                </button>
                <button 
                  onClick={() => setActiveShowcase("calendar")}
                  className={`text-xs font-semibold px-3 py-1 rounded-md transition-all cursor-pointer ${
                    activeShowcase === "calendar" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Calendar View
                </button>
                <button 
                  onClick={() => setActiveShowcase("activity")}
                  className={`text-xs font-semibold px-3 py-1 rounded-md transition-all cursor-pointer ${
                    activeShowcase === "activity" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Activity Logs
                </button>
              </div>
            </div>

            {/* Showcase Canvas rendering the selected dummy view */}
            <div className="bg-slate-900 rounded-xl p-6 min-h-[360px] text-left border border-slate-800 overflow-hidden">
              
              {/* Board View Showcase */}
              {activeShowcase === "board" && (
                <div className="grid md:grid-cols-3 gap-5 animate-fade-in duration-200">
                  {/* List 1 */}
                  <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/60">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">To Do</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">2</span>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-all cursor-pointer">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-900/50 uppercase tracking-wider">High</span>
                        <h4 className="text-sm font-semibold text-slate-200 mt-2">Design main application dashboard</h4>
                        <p className="text-xs text-slate-500 mt-1">Review layout grids, colors, and side navigation menus.</p>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-all cursor-pointer">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-950 text-green-400 border border-green-900/50 uppercase tracking-wider">Low</span>
                        <h4 className="text-sm font-semibold text-slate-200 mt-2">Update asset directories</h4>
                        <p className="text-xs text-slate-500 mt-1">Clean up icons and delete unused assets from code.</p>
                      </div>
                    </div>
                  </div>

                  {/* List 2 */}
                  <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/60">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">In Progress</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">1</span>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-all cursor-pointer">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-900/50 uppercase tracking-wider">Medium</span>
                        <h4 className="text-sm font-semibold text-slate-200 mt-2">Setup authentication controller</h4>
                        <p className="text-xs text-slate-500 mt-1">Configure JSON Web Tokens and user authorization middleware.</p>
                      </div>
                    </div>
                  </div>

                  {/* List 3 */}
                  <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/60">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Completed</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">1</span>
                    </div>
                    <div className="space-y-3 opacity-60">
                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 line-through decoration-slate-600">
                        <h4 className="text-sm font-semibold text-slate-300">Draft project roadmap</h4>
                        <p className="text-xs text-slate-500 mt-1">Milestones and deliverable dates aligned.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Calendar View Showcase */}
              {activeShowcase === "calendar" && (
                <div className="animate-fade-in duration-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-sm font-bold text-slate-300">May 2026</h4>
                    <span className="text-xs text-slate-400">Month Grid</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 mb-1">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 14 }).map((_, i) => {
                      const dayNum = i + 18
                      const isToday = dayNum === 21
                      return (
                        <div key={i} className={`p-2 min-h-[60px] rounded-lg border text-left flex flex-col justify-between transition-all ${
                          isToday ? "bg-primary-950/30 border-primary-800/60" : "bg-slate-950/40 border-slate-800/40"
                        }`}>
                          <span className={`text-[10px] font-bold ${isToday ? "text-primary-400" : "text-slate-500"}`}>{dayNum}</span>
                          {dayNum === 21 && (
                            <span className="text-[8px] font-bold py-0.5 px-1 bg-red-950 text-red-400 border border-red-900/50 rounded line-clamp-1 uppercase">
                              Due: Setup auth
                            </span>
                          )}
                          {dayNum === 25 && (
                            <span className="text-[8px] font-bold py-0.5 px-1 bg-primary-950 text-primary-400 border border-primary-900/50 rounded line-clamp-1 uppercase">
                              Design dashboard
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Activity Logs Showcase */}
              {activeShowcase === "activity" && (
                <div className="animate-fade-in duration-200 space-y-4">
                  <h4 className="text-sm font-bold text-slate-300 mb-2">Live Board History</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-slate-950/40 rounded-lg border border-slate-800/50">
                      <div className="w-6 h-6 rounded-full bg-primary-900 text-primary-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                        C
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-300">
                          <span className="text-slate-100">charan</span> moved card <span className="text-primary-400">"Setup authentication controller"</span> from <span className="text-slate-400">To Do</span> to <span className="text-slate-400">In Progress</span>
                        </p>
                        <span className="text-[10px] text-slate-600 block mt-1">2 minutes ago</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-slate-950/40 rounded-lg border border-slate-800/50">
                      <div className="w-6 h-6 rounded-full bg-indigo-900 text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                        M
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-300">
                          <span className="text-slate-100">manohar</span> created card <span className="text-primary-400">"Update asset directories"</span> in <span className="text-slate-400">To Do</span>
                        </p>
                        <span className="text-[10px] text-slate-600 block mt-1">1 hour ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* ─── PRODUCTIVITY STATS ─── */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold text-slate-900 font-display">99.9%</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Platform Uptime</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-slate-900 font-display">5,000+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Boards Active</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-slate-900 font-display">12ms</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Websocket Latency</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-slate-900 font-display">100%</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Intuitive Design</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section id="features" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Everything you need. Nothing you don't.
            </h2>
            <p className="text-slate-500 text-lg">
              We focus on clean workspaces and reliable collaboration features so your team stays focused on launching.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 transition-all hover:bg-white hover:shadow-md hover:border-slate-300">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 mb-6 border border-primary-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Visual Task Boards</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Organize tasks into customizable lists. Instantly see status labels, priorities, and deadlines in a structured dashboard.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 transition-all hover:bg-white hover:shadow-md hover:border-slate-300">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 mb-6 border border-primary-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Interactive Calendar</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Filter and schedule cards directly via a monthly grid. Add quick tasks to specific days or drag unscheduled tasks into cells.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 transition-all hover:bg-white hover:shadow-md hover:border-slate-300">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 mb-6 border border-primary-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Team Collaboration</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Invite team members via security-validated links, assign task cards, and synchronize project boards instantly over sockets.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 transition-all hover:bg-white hover:shadow-md hover:border-slate-300">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 mb-6 border border-primary-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Resource Uploads</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Attach documents, mockups, or design sheets directly to task boards for centralized access and easy referencing.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 transition-all hover:bg-white hover:shadow-md hover:border-slate-300">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 mb-6 border border-primary-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">History & Tracking</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Access audit logs detailing board adjustments, title modifications, assignments, and column movements.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 transition-all hover:bg-white hover:shadow-md hover:border-slate-300">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 mb-6 border border-primary-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Trash Management</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Restore accidentally deleted cards or lists from a centralized trash bin before they are permanently purged.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── CALL TO ACTION ─── */}
      <section id="cta" className="py-20 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Start organizing your projects today.
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-8 text-base">
            Join thousands of individual developers and collaborative teams using Kanvas to build things faster.
          </p>
          <div className="flex justify-center">
            <NavLink 
              to={startPath} 
              className="text-base font-semibold text-white bg-primary-600 hover:bg-primary-500 px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary-500/10"
            >
              Get Started for Free
            </NavLink>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-white border-t border-slate-200 py-12 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-linear-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              K
            </div>
            <span className="font-display font-bold text-slate-900">Kanvas</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Kanvas. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#features" className="hover:text-slate-800 transition-colors">Privacy</a>
            <a href="#features" className="hover:text-slate-800 transition-colors">Terms</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-800 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Home;