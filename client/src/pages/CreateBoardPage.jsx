import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router"
import { API_URL } from "../services/api"

/**
 * CreateBoardPage Component
 * 
 * Provides a UI for users to either create a new workspace (board) or join an 
 * existing one via an invitation link. Operates in three states: selection mode, 
 * creation mode, and join mode.
 */
function CreateBoardPage() {

  // "create" | "join" | "" (empty string implies selection mode)
  const [mode, setMode] = useState("")
  
  // State for creation mode
  const [title, setTitle] = useState("")
  
  // State for join mode
  const [inviteLink, setInviteLink] = useState("")
  
  // Shared UI states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  /**
   * Handles the creation of a new board.
   * Validates the input title, posts to the API, and automatically redirects
   * the user to the newly created board upon success.
   */
  const createBoard = async () => {
    if (!title.trim()) {
      setError("Board title is required")
      return
    }

    try {
      setError("")
      setLoading(true)

      const res = await axios.post(
        `${API_URL}/board-api/addBoard`,
        {
          title: title.trim(),
          background: "#0052cc" // Default board background color
        },
        {
          withCredentials: true
        }
      )

      const board = res.data.payload

      // Redirect to the newly created board
      navigate(`/board/${board._id}`)

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Something went wrong while creating board"
      )
    } finally {
      setLoading(false)
    }
  }

  /**
   * Parses an invitation link and extracts the token to route the user
   * to the standard accept invite handler.
   */
  const joinBoard = () => {
    if (!inviteLink.trim()) {
      setError("Invite link required")
      return
    }

    try {
      // Extract the token from the end of the provided URL
      const url = new URL(inviteLink)
      const token = url.pathname.split("/").pop()

      // Redirect to the AcceptInvitePage which handles the actual verification
      navigate(`/invite/${token}`)
    } catch {
      setError("Invalid invite link")
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 px-4 font-body">
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-100 w-full max-w-md">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Workspace Access
          </h1>
          <p className="text-sm text-slate-500">
            Create a new board or join using an invite link
          </p>
        </div>

        {/* ─── SELECT MODE ─── */}
        {!mode && (
          <div className="space-y-4">
            <button
              onClick={() => {
                setMode("create")
                setError("")
              }}
              className="w-full p-5 border border-slate-200 rounded-2xl hover:border-primary-500 hover:bg-slate-50/50 transition-all duration-200 text-left cursor-pointer"
            >
              <h2 className="font-bold text-lg text-slate-900">
                Create New Board
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Start a fresh workspace for your tasks
              </p>
            </button>

            <button
              onClick={() => {
                setMode("join")
                setError("")
              }}
              className="w-full p-5 border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-slate-50/50 transition-all duration-200 text-left cursor-pointer"
            >
              <h2 className="font-bold text-lg text-slate-900">
                Join Through Link
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Join an existing workspace using an invite link
              </p>
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full text-center mt-6 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Cancel & Go Back
            </button>
          </div>
        )}

        {/* ─── CREATE BOARD MODE ─── */}
        {mode === "create" && (
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Board Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Project Apollo"
              className="w-full bg-slate-50/50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all mb-4"
            />

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200/50 rounded-xl text-center">
                <p className="text-red-600 text-xs font-semibold">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setMode("")
                  setError("")
                }}
                className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold transition-all cursor-pointer"
              >
                Back
              </button>

              <button
                disabled={loading}
                onClick={createBoard}
                className="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        )}

        {/* ─── JOIN BOARD MODE ─── */}
        {mode === "join" && (
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Invite Link</label>
            <input
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
              placeholder="Paste link here..."
              className="w-full bg-slate-50/50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all mb-4"
            />

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200/50 rounded-xl text-center">
                <p className="text-red-600 text-xs font-semibold">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setMode("")
                  setError("")
                }}
                className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold transition-all cursor-pointer"
              >
                Back
              </button>

              <button
                onClick={joinBoard}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all cursor-pointer"
              >
                Join Board
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default CreateBoardPage