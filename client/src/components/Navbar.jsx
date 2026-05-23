import { useState, useEffect, useRef } from "react"
import { NavLink, useNavigate, useLocation } from "react-router"
import { useAuthStore } from "../context/AuthContext"

function Navbar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)
  const currentUser = useAuthStore((state) => state.currentUser)

  const navigate = useNavigate()
  const location = useLocation()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Determine current view from pathname to highlight the correct menu item
  const currentView = location.pathname.split("/").pop()

  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => {
                if (window.innerWidth < 1024 && isAuthenticated) {
                  setMobileMenuOpen(true)
                }
              }}
              className={`w-8 h-8 rounded-lg bg-linear-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-primary-500/20 ${isAuthenticated ? 'cursor-pointer lg:cursor-default' : ''}`}
            >
              K
            </div>

            <span 
              onClick={() => navigate("/")}
              className="font-display text-xl font-bold tracking-tight text-slate-900 cursor-pointer"
            >
              Kanvas
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-6">

            {isAuthenticated ? (
              <>
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

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all border border-slate-200/40 hover:border-slate-200 shadow-xs cursor-pointer select-none"
                  >
                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-600 border border-slate-200 uppercase">
                        {currentUser?.name?.[0]}
                      </div>
                    )}

                    <span className="text-sm font-semibold text-slate-700 hidden sm:inline">
                      {currentUser?.name}
                    </span>

                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
                      <NavLink
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Profile Details
                      </NavLink>

                      <hr className="border-slate-100 my-1" />

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false)
                          logout()
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 text-left cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `text-sm font-semibold px-3 py-2 ${
                      isActive
                        ? "text-primary-600"
                        : "text-slate-600 hover:text-slate-900"
                    }`
                  }
                >
                  Sign In
                </NavLink>

                <NavLink
                  to="/register"
                  className="text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl"
                >
                  Get Started
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed top-0 left-0 h-screen w-72 bg-white shadow-xl z-50 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold">Kanvas</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-bold cursor-pointer"
                >
                  ×
                </button>
              </div>

              {/* Create Board Action */}
              <button
                onClick={() => {
                  navigate("/create-board")
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-all shadow-md shadow-primary-500/10 cursor-pointer mb-6"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Board
              </button>

              {/* Navigation Links */}
              <div className="space-y-1">
                <button
                  onClick={() => {
                    navigate("/dashboard/boards")
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold cursor-pointer
                    ${currentView === "boards" ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                >
                  <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  My Boards
                </button>
                
                <button
                  onClick={() => {
                    navigate("/dashboard/shared")
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold cursor-pointer
                    ${currentView === "shared" ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                >
                  <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Shared Boards
                </button>

                <button
                  onClick={() => {
                    navigate("/dashboard/trash")
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold cursor-pointer
                    ${currentView === "trash" ? "bg-red-50 text-red-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                >
                  <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Trash
                </button>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <hr className="border-slate-100 my-2" />
              <button
                onClick={() => {
                  logout()
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 cursor-pointer transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Navbar