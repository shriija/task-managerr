import { NavLink } from "react-router"
import { useAuthStore } from "../context/AuthContext"

function Navbar() {

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)
  const currentUser = useAuthStore((state)=>state.currentUser)
  console.log(currentUser)

  return (
    <nav className="fixed top-0 w-full bg-white border-b z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <NavLink to="/" className="text-xl font-bold text-gray-900">
            Kanvas
          </NavLink>

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