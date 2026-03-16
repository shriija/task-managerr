import { NavLink } from "react-router"


function Navbar() {
  return (
     <nav className="fixed top-0 w-full bg-white border-b z-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex justify-between items-center h-16">

      {/* Logo */}
      <NavLink to="/" className="text-xl font-bold text-gray-900">
        GruhaBuddy
      </NavLink>

      {/* Navigation */}
      <div className="flex items-center gap-6">

        {0 ? (
          <>
            <span className="text-sm text-gray-700">
              Hello
            </span>

            <NavLink
              to="/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              Dashboard
            </NavLink>

            <button

              className="text-sm font-medium text-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className="text-sm font-medium bg-black text-white px-4 py-2 rounded"
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