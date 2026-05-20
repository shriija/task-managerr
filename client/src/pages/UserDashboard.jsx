import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import axios from "axios"
import { API_URL } from "../services/api"
import { useBoardStore } from "../context/BoardContext"

function UserDashboard() {

  const navigate = useNavigate()

  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [currentView, setCurrentView] = useState("boards") // "boards" or "trash"
  const deletedBoards = useBoardStore(s => s.deletedBoards)
  const fetchDeletedBoards = useBoardStore(s => s.fetchDeletedBoards)
  const restoreBoard = useBoardStore(s => s.restoreBoard)
  const permanentDeleteBoard = useBoardStore(s => s.permanentDeleteBoard)

  useEffect(() => {
    if (currentView === "boards") {
      const fetchBoards = async () => {
        try {
          setLoading(true)
          const res = await axios.get(`${API_URL}/board-api/`, { withCredentials: true })
          setBoards(res.data.payload || [])
        } catch (err) {
          setError(err.response?.data?.message || "Failed to load boards")
        } finally {
          setLoading(false)
        }
      }
      fetchBoards()
    } else if (currentView === "shared") {
      const fetchShared = async () => {
        try {
          setLoading(true)
          const res = await axios.get(`${API_URL}/board-api/shared/all`, { withCredentials: true })
          setBoards(res.data.payload || [])
        } catch (err) {
          setError(err.response?.data?.message || "Failed to load shared boards")
        } finally {
          setLoading(false)
        }
      }
      fetchShared()
    } else if (currentView === "trash") {
      fetchDeletedBoards()
    }
  }, [currentView, fetchDeletedBoards])

  // Delete Board (soft delete) directly via axios in Dashboard
  const handleDeleteBoard = async (e, boardId) => {
    e.stopPropagation()
    try {
      await axios.delete(`${API_URL}/board-api/deleteBoard/${boardId}`, { withCredentials: true })
      setBoards(boards.filter(b => b._id !== boardId))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex bg-background-light">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 hidden lg:block">
        <h2 className="font-bold text-xl mb-6">TaskHub</h2>

        <button
          onClick={() => navigate("/create-board")}
          className="w-full bg-linear-to-r from-primary-500 to-primary-600
                     hover:from-primary-600 hover:to-primary-700
                     text-white py-2.5 rounded-xl mb-6 font-semibold text-sm
                     shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
        >
          + Create Board
        </button>

        <div className="space-y-1">
          <button
            onClick={() => setCurrentView("boards")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium
              ${currentView === "boards" ? "bg-primary-50 text-primary-600" : "text-gray-600 hover:bg-gray-50"}
            `}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" />
            </svg>
            My Boards
          </button>
          <button
            onClick={() => setCurrentView("shared")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium
              ${currentView === "shared" ? "bg-primary-50 text-primary-600" : "text-gray-600 hover:bg-gray-50"}
            `}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            Shared Boards
          </button>
          <button
            onClick={() => setCurrentView("trash")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium
              ${currentView === "trash" ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-50"}
            `}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Trash
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">

        <h1 className="text-3xl font-black mb-8 mt-20">
          {currentView === "boards" ? "My Boards" : currentView === "shared" ? "Shared Boards" : "Trash"}
        </h1>

        {/* Loading */}
        {loading && (currentView === "boards" || currentView === "shared") && (
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
        {(currentView === "boards" || currentView === "shared") && !loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Create New Board Card */}
            {currentView === "boards" && (
              <div
                onClick={() => navigate("/create-board")}
                className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center
                           justify-center cursor-pointer hover:border-primary-400
                           hover:bg-primary-50/50 transition-all duration-200 group"
              >
                <span className="text-4xl text-gray-300 group-hover:text-primary-400 transition-colors">+</span>
                <p className="font-bold mt-2 text-gray-500 group-hover:text-primary-600 transition-colors">Create Board</p>
              </div>
            )}

            {/* Dynamic Boards */}
            {boards.map((board) => (
              <div
                key={board._id}
                onClick={() => navigate(`/board/${board._id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-100
                           p-6 hover:shadow-md hover:border-primary-200
                           hover:-translate-y-0.5 relative group
                           cursor-pointer transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl mb-3
                               bg-linear-to-br from-primary-400 to-primary-600
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
                {currentView === "shared" && board.owner && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                    <span className="text-[10px] font-medium text-gray-500">Owner:</span>
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-[8px] font-bold text-white">
                      {board.owner.avatar ? (
                        <img src={board.owner.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        board.owner.name?.charAt(0).toUpperCase() || "O"
                      )}
                    </div>
                  </div>
                )}
                
                {currentView !== "shared" && (
                  <button
                    onClick={(e) => handleDeleteBoard(e, board._id)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                    title="Move to Trash"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Trash View */}
        {currentView === "trash" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {deletedBoards.length === 0 ? (
              <p className="text-gray-400 text-sm">Trash is empty.</p>
            ) : (
              deletedBoards.map(board => (
                <div key={board._id} className="bg-white rounded-xl shadow-sm border border-red-100 p-6 opacity-75 hover:opacity-100 transition-opacity">
                  <h3 className="font-bold text-lg text-gray-800 line-through decoration-red-400">{board.title}</h3>
                  <p className="text-xs text-gray-400 mt-2">
                    Deleted on {new Date(board.deletedAt).toLocaleDateString("en-US")}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => restoreBoard(board._id)}
                      className="flex-1 text-xs font-semibold py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => permanentDeleteBoard(board._id)}
                      className="flex-1 text-xs font-semibold py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Delete Forever
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </main>

    </div>
  )
}

export default UserDashboard