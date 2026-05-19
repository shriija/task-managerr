import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import axios from "axios"
import { API_URL } from "../services/api"

function UserDashboard() {

  const navigate = useNavigate()

  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch boards from API on mount
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setLoading(true)
        const res = await axios.get(
          `${API_URL}/board-api/`,
          { withCredentials: true }
        )
        setBoards(res.data.payload || [])
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load boards")
      } finally {
        setLoading(false)
      }
    }
    fetchBoards()
  }, [])

  return (
    <div className="min-h-screen flex bg-background-light">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 hidden lg:block">
        <h2 className="font-bold text-xl mb-6">TaskHub</h2>

        <button
          onClick={() => navigate("/create-board")}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600
                     hover:from-primary-600 hover:to-primary-700
                     text-white py-2.5 rounded-xl mb-6 font-semibold text-sm
                     shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
        >
          + Create Board
        </button>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Boards
        </p>

        {boards.map((b) => (
          <div
            key={b._id}
            onClick={() => navigate(`/board/${b._id}`)}
            className="p-2.5 rounded-xl hover:bg-primary-50 hover:text-primary-600
                       cursor-pointer text-sm text-gray-700 font-medium
                       transition-colors duration-150"
          >
            {b.title}
          </div>
        ))}
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">

        <h1 className="text-3xl font-black mb-8 mt-20">My Boards</h1>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-32" />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* Boards grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {/* Create New Board Card */}
            <div
              onClick={() => navigate("/create-board")}
              className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center
                         justify-center cursor-pointer hover:border-primary-400
                         hover:bg-primary-50/50 transition-all duration-200 group"
            >
              <span className="text-4xl text-gray-300 group-hover:text-primary-400
                               transition-colors">+</span>
              <p className="font-bold mt-2 text-gray-500 group-hover:text-primary-600
                            transition-colors">Create Board</p>
            </div>

            {/* Dynamic Boards */}
            {boards.map((board) => (
              <div
                key={board._id}
                onClick={() => navigate(`/board/${board._id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-100
                           p-6 hover:shadow-md hover:border-primary-200
                           hover:-translate-y-0.5
                           cursor-pointer transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl mb-3
                               bg-gradient-to-br from-primary-400 to-primary-600
                               flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">
                    {board.title?.charAt(0)?.toUpperCase() || "B"}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-gray-800">{board.title}</h3>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(board.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric"
                  })}
                </p>
              </div>
            ))}

          </div>
        )}

      </main>

    </div>
  )
}

export default UserDashboard