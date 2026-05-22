import { NavLink } from "react-router"
import { useAuthStore } from "../context/AuthContext"

function Navbar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)
  const currentUser = useAuthStore((state) => state.currentUser)

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-primary-500/20">
            K
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900">Kanvas</span>
        </NavLink>

        {/* Navigation / Actions */}
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2">
                {currentUser?.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-6 h-6 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200 uppercase">
                    {currentUser?.name?.[0]}
                  </div>
                )}
                <span className="text-sm font-medium text-slate-600 hidden sm:inline">
                  {currentUser?.name}
                </span>
              </div>

              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm ${
                    isActive 
                      ? "text-white bg-slate-950 hover:bg-slate-800" 
                      : "text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200"
                  }`
                }
              >
                Dashboard
              </NavLink>

              <button
                onClick={logout}
                className="text-sm font-semibold text-red-600 hover:text-white hover:bg-red-600 px-4 py-2 rounded-xl border border-red-200 hover:border-red-600 transition-colors duration-200 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-sm font-semibold px-3 py-2 transition-colors ${
                    isActive ? "text-primary-600" : "text-slate-600 hover:text-slate-900"
                  }`
                }
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
    </nav>
  )
}

export default Navbar