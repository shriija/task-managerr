import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router"
import { API_URL } from "../services/api"

function CreateBoardPage() {

  const [mode, setMode] = useState("")
  const [title, setTitle] = useState("")
  const [inviteLink, setInviteLink] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  // Create Board
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
          background: "#0052cc"
        },
        {
          withCredentials: true
        }
      )

      const board = res.data.payload

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

  // Join Through Link
  const joinBoard = () => {

    if (!inviteLink.trim()) {

      setError("Invite link required")
      return
    }

    try {

      const url = new URL(inviteLink)

      const token = url.pathname.split("/").pop()

      navigate(`/invite/${token}`)

    } catch {

      setError("Invalid invite link")
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-black text-gray-900 mb-2">
          Workspace Access
        </h1>

        <p className="text-sm text-gray-500 mb-8">
          Create a new board or join using an invite link
        </p>

        {/* SELECT MODE */}
        {!mode && (

          <div className="space-y-4">

            <button
              onClick={() => {
                setMode("create")
                setError("")
              }}
              className="w-full p-5 border-2 border-gray-200 rounded-2xl
                         hover:border-primary-500 hover:bg-primary-50
                         transition-all duration-200 text-left cursor-pointer"
            >

              <h2 className="font-bold text-lg text-gray-900">
                Create New Board
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Start a fresh workspace for your tasks
              </p>

            </button>

            <button
              onClick={() => {
                setMode("join")
                setError("")
              }}
              className="w-full p-5 border-2 border-gray-200 rounded-2xl
                         hover:border-emerald-500 hover:bg-emerald-50
                         transition-all duration-200 text-left cursor-pointer"
            >

              <h2 className="font-bold text-lg text-gray-900">
                Join Through Link
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Join an existing workspace using an invite link
              </p>

            </button>

          </div>
        )}

        {/* CREATE BOARD */}
        {mode === "create" && (

          <div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Board title"
              className="w-full border border-gray-200 rounded-xl p-3 mb-4
                         focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            {error && (
              <p className="text-red-500 text-sm mb-3">
                {error}
              </p>
            )}

            <div className="flex gap-3">

              <button
                onClick={() => {
                  setMode("")
                  setError("")
                }}
                className="flex-1 py-3 rounded-xl border border-gray-200
                           hover:bg-gray-100 transition-all"
              >
                Back
              </button>

              <button
                disabled={loading}
                onClick={createBoard}
                className="flex-1 py-3 rounded-xl bg-primary-600
                           hover:bg-primary-700 text-white font-semibold
                           transition-all"
              >
                {loading ? "Creating..." : "Create"}
              </button>

            </div>

          </div>
        )}

        {/* JOIN BOARD */}
        {mode === "join" && (

          <div>

            <input
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
              placeholder="Paste invite link"
              className="w-full border border-gray-200 rounded-xl p-3 mb-4
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {error && (
              <p className="text-red-500 text-sm mb-3">
                {error}
              </p>
            )}

            <div className="flex gap-3">

              <button
                onClick={() => {
                  setMode("")
                  setError("")
                }}
                className="flex-1 py-3 rounded-xl border border-gray-200
                           hover:bg-gray-100 transition-all"
              >
                Back
              </button>

              <button
                onClick={joinBoard}
                className="flex-1 py-3 rounded-xl bg-emerald-600
                           hover:bg-emerald-700 text-white font-semibold
                           transition-all"
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