import { Navigate } from "react-router"
import { useAuthStore } from "../context/AuthContext"

function ProtectedRoute({ children }) {

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute