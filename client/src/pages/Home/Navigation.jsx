import { NavLink } from 'react-router'

export default function Navigation({ isAuthenticated, startPath }) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-primary-500/20">
            K
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900">Kanvas</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
          <a href="#showcase" className="hover:text-primary-600 transition-colors">Walkthrough</a>
          <a href="#cta" className="hover:text-primary-600 transition-colors">Get Started</a>
        </nav>
        
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
  )
}
