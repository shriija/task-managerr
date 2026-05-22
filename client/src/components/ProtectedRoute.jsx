import { useEffect, useState } from "react"
import { Navigate } from "react-router"
import { useAuthStore } from "../context/AuthContext"

/**
 * ProtectedRoute Component
 * 
 * A wrapper component that enforces authentication requirements for specific routes.
 * It verifies the user's session state on mount. If the user is unauthenticated,
 * they are redirected to the login page.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The child components to render if authentication passes.
 */
function ProtectedRoute({ children }) {

  // Selectors from the global AuthStore Zustand context
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const verifySession = useAuthStore((s) => s.verifySession)
  
  // Local state to track whether the initial session verification is still in progress
  const [checking, setChecking] = useState(true)

  // On mount, verify that the JWT cookie is still valid via backend API request
  useEffect(() => {
    const check = async () => {
      await verifySession()
      setChecking(false) // Verification complete, ready to render
    }
    check()
  }, [verifySession])

  // While checking the session, show a full-screen loading spinner
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  // If the session verification fails or the user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // User is authenticated, render the protected content
  return children
}

export default ProtectedRoute