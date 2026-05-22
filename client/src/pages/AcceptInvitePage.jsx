import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import axios from "axios"
import { API_URL as API } from "../services/api"

/**
 * AcceptInvitePage Component
 * 
 * Handles the flow of a user clicking an invitation link to join a board.
 * Extracts the invite token from the URL, validates it against the backend API,
 * and then automatically redirects the user to the respective board upon success.
 */
function AcceptInvitePage() {
  const { token } = useParams()
  const navigate = useNavigate()
  
  // Track the current validation state
  const [status, setStatus] = useState("loading") // "loading" | "success" | "error"
  const [message, setMessage] = useState("")
  const [boardId, setBoardId] = useState(null)

  // Validate the token as soon as the component mounts
  useEffect(() => {
    const accept = async () => {
      try {
        // Submit the token to the backend for verification and consumption
        const res = await axios.get(`${API}/board-api/invite/accept/${token}`, {
          withCredentials: true,
        })
        
        // Destructure the resulting boardId and whether they were already a member
        const { boardId: bid, alreadyMember } = res.data.payload
        setBoardId(bid)
        setMessage(alreadyMember ? "You're already a member of this board." : "You've joined the board!")
        setStatus("success")

        // Auto-redirect to the board view after 2 seconds
        setTimeout(() => navigate(`/board/${bid}`), 2000)
      } catch (err) {
        // Handle invalid, expired, or non-existent tokens
        const msg = err.response?.data?.message || "Something went wrong"
        setMessage(msg)
        setStatus("error")
      }
    }
    accept()
  }, [token, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 text-center">

        {/* ─── LOADING STATE ─── */}
        {status === "loading" && (
          <>
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-primary-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Joining Board…</h2>
            <p className="text-sm text-gray-500">Verifying your invite link</p>
          </>
        )}

        {/* ─── SUCCESS STATE ─── */}
        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              {message.includes("already") ? "Already a Member" : "You're In! 🎉"}
            </h2>
            <p className="text-sm text-gray-500 mb-5">{message}</p>
            
            {/* Auto-redirect spinner indicator */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Redirecting to board…
            </div>
            
            {/* Manual redirect button (fallback) */}
            {boardId && (
              <button
                onClick={() => navigate(`/board/${boardId}`)}
                className="mt-4 w-full bg-linear-to-r from-primary-500 to-primary-600
                           hover:from-primary-600 hover:to-primary-700
                           text-white text-sm font-semibold py-2.5 rounded-xl
                           transition-all shadow-sm hover:shadow-md"
              >
                Go to Board Now
              </button>
            )}
          </>
        )}

        {/* ─── ERROR STATE ─── */}
        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              {message.includes("expired") ? "Link Expired" : "Invalid Link"}
            </h2>
            <p className="text-sm text-gray-500 mb-5">{message}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-linear-to-r from-gray-700 to-gray-900
                         hover:from-gray-800 hover:to-black
                         text-white text-sm font-semibold py-2.5 rounded-xl
                         transition-all shadow-sm hover:shadow-md"
            >
              Go to Dashboard
            </button>
          </>
        )}

      </div>
    </div>
  )
}

export default AcceptInvitePage
