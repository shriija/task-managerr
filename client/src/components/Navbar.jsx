import { NavLink } from "react-router"
import { useAuthStore } from "../context/AuthContext"

function Navbar() {

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)
  const currentUser = useAuthStore((state)=>state.currentUser)
  console.log(currentUser)

  return (
    <nav className=" top-0 w-full bg-white border-b z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center gap-2.5 my-8">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600
                          rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </div>
          <NavLink to="/" className="text-xl font-bold text-gray-900">
            Kanvas
          </NavLink>
        </div>
          

          {/* Navigation */}
          <div className="flex items-center gap-6">

            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700">
                  {currentUser.name}
                </span>

                <NavLink
                  to="/dashboard"
                  className= {({isActive})=>isActive? "text-sm font-medium text-white hover:text-gray-600 bg-gray-900 px-4 py-2 rounded" : ""}
                >
                  Dashboard
                </NavLink>

                <button
                  onClick={logout}
                  className="text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 px-4 py-2 rounded transition-colors duration-200 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({isActive}) =>
                    isActive
                      ? "text-sm font-medium text-white bg-black px-4 py-2 rounded"
                      : "text-sm font-medium text-gray-700 hover:bg-gray-700 hover:text-white px-4 py-2 rounded"
                  }
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className={({isActive}) =>
                    isActive
                      ? "text-sm font-medium text-white bg-black px-4 py-2 rounded"
                      : "text-sm font-medium text-gray-700 hover:bg-gray-700 hover:text-white px-4 py-2 rounded"
                  }
                >
                  Sign Up
                </NavLink>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar