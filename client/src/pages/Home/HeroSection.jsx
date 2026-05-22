import { NavLink } from 'react-router'

export default function HeroSection({ startPath, activeShowcase, setActiveShowcase }) {
  return (
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

        <div id="showcase" className="max-w-5xl mx-auto bg-slate-950 rounded-2xl p-4 shadow-2xl shadow-slate-950/20 border border-slate-800/80 scroll-mt-20">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/85"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/85"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/85"></span>
            </div>
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

          <div className="bg-slate-900 rounded-xl p-6 min-h-[360px] text-left border border-slate-800 overflow-hidden">
            {activeShowcase === "board" && (
              <div className="grid md:grid-cols-3 gap-5 animate-fade-in duration-200">
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
  )
}
