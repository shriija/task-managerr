import { useEffect, useState } from "react"
import { Navigate } from "react-router"
import { useAuthStore } from "../context/AuthContext"

function ProtectedRoute({ children }) {

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const verifySession = useAuthStore((s) => s.verifySession)
  const [checking, setChecking] = useState(true)

  // On mount, verify that the JWT cookie is still valid
  useEffect(() => {
    const check = async () => {
      await verifySession()
      setChecking(false)
    }
    check()
  }, [verifySession])

  // While checking, show a loading indicator
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute