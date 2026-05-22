import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import axios from "axios"
import { API_URL } from "../services/api"
import { useBoardStore } from "../context/BoardContext"
import { useAuthStore } from "../context/AuthContext"

/**
 * UserDashboard Component
 * 
 * The primary landing area for authenticated users.
 * Displays personal boards, shared boards, and deleted (trash) boards.
 * Handles fetching board lists, global dashboard stats, and soft-delete/restore functionality.
 */
function UserDashboard() {
  const navigate = useNavigate()
  
  // Destructure the active tab from the URL parameters (boards, shared, trash)
  const { tab } = useParams()
  // Default to "boards" if the tab parameter is not provided
  const currentView = tab || "boards"

  // Selectors from global stores
  const currentUser = useAuthStore((state) => state.currentUser)
  const deletedBoards = useBoardStore(s => s.deletedBoards)
  const fetchDeletedBoards = useBoardStore(s => s.fetchDeletedBoards)
  const restoreBoard = useBoardStore(s => s.restoreBoard)
  const permanentDeleteBoard = useBoardStore(s => s.permanentDeleteBoard)

  // Local state for dashboard data
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  // Keep track of counts for personal and shared boards to display in the overview cards
  const [stats, setStats] = useState({ personal: 0, shared: 0 })

  /**
   * Generates a dynamic greeting based on the user's current local time.
   * @returns {string} The greeting message (Good morning, Good afternoon, Good evening)
   */
  const getGreeting = () => {
    const hrs = new Date().getHours()
    if (hrs < 12) return "Good morning"
    if (hrs < 18) return "Good afternoon"
    return "Good evening"
  }

  // Effect to handle invalid tab routes and redirect to the default view
  useEffect(() => {
    if (!tab || !["boards", "shared", "trash"].includes(tab)) {
      navigate("/dashboard/boards", { replace: true })
    }
  }, [tab, navigate])

  /**
   * Fetches the board data for the current active tab (My Boards, Shared, Trash).
   * Depending on the view, it either fetches active boards from the API or delegates
   * to the BoardStore to fetch deleted items.
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError("")
        
        let endpoint = `${API_URL}/board-api/`
        // Update endpoint if viewing shared boards
        if (currentView === "shared") {
          endpoint = `${API_URL}/board-api/shared/all`
        }

        if (currentView === "trash") {
          // Fetch deleted boards via Zustand action
          await fetchDeletedBoards()
        } else {
          // Fetch active/shared boards
          const res = await axios.get(endpoint, { withCredentials: true })
          setBoards(res.data.payload || [])
        }
      } catch (err) {
        setError(err.response?.data?.message || `Failed to load ${currentView} workspaces`)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [currentView, fetchDeletedBoards])

  /**
   * Fetches independent dashboard statistics (total personal boards, total shared boards)
   * to ensure the top overview cards are always accurate regardless of the current active tab.
   */
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [personalRes, sharedRes] = await Promise.all([
          axios.get(`${API_URL}/board-api/`, { withCredentials: true }),
          axios.get(`${API_URL}/board-api/shared/all`, { withCredentials: true })
        ])
        setStats({
          personal: personalRes.data.payload?.length || 0,
          shared: sharedRes.data.payload?.length || 0
        })
      } catch (err) {
        console.error("Failed to load dashboard statistics", err)
      }
    }
    fetchCounts()
  }, [currentView])

  /**
   * Handles the soft deletion of a board.
   * Sends the delete request, removes the board from local UI state, and updates stats.
   * 
   * @param {Event} e - Click event
   * @param {string} boardId - The ID of the board to soft-delete
   */
  const handleDeleteBoard = async (e, boardId) => {
    e.stopPropagation() // Prevent the click from navigating to the board page
    try {
      await axios.delete(`${API_URL}/board-api/deleteBoard/${boardId}`, { withCredentials: true })
      setBoards(boards.filter(b => b._id !== boardId))
      setStats(prev => ({ ...prev, personal: Math.max(0, prev.personal - 1) }))
    } catch (err) {
      console.error("Failed to delete board", err)
    }
  }

  /**
   * Handles restoring a board from the trash.
   * Delegates to the BoardStore action and updates the personal boards stat.
   * 
   * @param {string} boardId - The ID of the board to restore
   */
  const handleRestore = async (boardId) => {
    await restoreBoard(boardId)
    setStats(prev => ({ ...prev, personal: prev.personal + 1 }))
  }

  // Filter the currently loaded boards based on the user's search query (case-insensitive)
  const filteredBoards = boards.filter(b => 
    b.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-slate-50 font-body">
      
      {/* ─── SIDEBAR ──────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-slate-200/80 p-6 hidden lg:flex flex-col justify-between shrink-0">
        <div>
          {/* Create Board Action */}
          <button
            onClick={() => navigate("/create-board")}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-all shadow-md shadow-primary-500/10 cursor-pointer mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Board
          </button>

          {/* Navigation Links */}
          <div className="space-y-1">
            <button
              onClick={() => navigate("/dashboard/boards")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold cursor-pointer
                ${currentView === "boards" ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
              `}
            >
              <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              My Boards
            </button>
            
            <button
              onClick={() => navigate("/dashboard/shared")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold cursor-pointer
                ${currentView === "shared" ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
              `}
            >
              <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Shared Boards
            </button>

            <button
              onClick={() => navigate("/dashboard/trash")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold cursor-pointer
                ${currentView === "trash" ? "bg-red-50 text-red-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
              `}
            >
              <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Trash
            </button>
          </div>
        </div>

        {/* Sidebar Footer walkthrough promo */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
          <p className="text-xs font-semibold text-slate-700 mb-1">Collaboration Workspace</p>
          <p className="text-[11px] text-slate-500 leading-normal">Changes auto-sync in real time with all workspace members.</p>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ──────────────────────────────────────────────── */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">
              {getGreeting()}, {currentUser?.name || "User"}
            </h1>
            <p className="text-slate-500 text-sm mt-1">Here's an overview of your active workspaces and boards.</p>
          </div>

          {/* Search Boards Input (Only visible in 'boards' or 'shared' tabs) */}
          {(currentView === "boards" || currentView === "shared") && (
            <div className="relative">
              <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search boards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-72 pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
              />
            </div>
          )}
        </div>

        {/* Dashboard Statistics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Boards</p>
            <p className="font-display text-3xl font-extrabold text-slate-900 mt-1">{stats.personal}</p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shared Workspaces</p>
            <p className="font-display text-3xl font-extrabold text-slate-900 mt-1">{stats.shared}</p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trash Bin</p>
            <p className="font-display text-3xl font-extrabold text-slate-900 mt-1">{deletedBoards.length}</p>
          </div>
        </div>

        {/* Error Alert Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200/50 rounded-2xl text-center">
            <p className="text-red-600 text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* ─── ACTIVE OR SHARED BOARDS GRID ────────────────────────────────────── */}
        {(currentView === "boards" || currentView === "shared") && (
          <div>
            <div className="flex items-center justify-between mb-5 border-b border-slate-200/60 pb-3">
              <h2 className="font-display text-lg font-bold text-slate-800 uppercase tracking-wider">
                {currentView === "boards" ? "Active Boards" : "Shared Boards"}
              </h2>
              {/* Show count of filtered results if searching */}
              {searchQuery && (
                <span className="text-xs text-slate-500">
                  Showing {filteredBoards.length} of {boards.length} results
                </span>
              )}
            </div>

            {loading ? (
              // Loading Skeleton Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse bg-white border border-slate-200/80 rounded-2xl h-36" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                
                {/* Create Board dotted button card (only shown in 'boards' view when not searching) */}
                {currentView === "boards" && !searchQuery && (
                  <div
                    onClick={() => navigate("/create-board")}
                    className="border-2 border-dashed border-slate-200 hover:border-primary-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50/50 transition-all duration-200 group h-36 text-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-primary-50 flex items-center justify-center transition-colors">
                      <span className="text-xl text-slate-400 group-hover:text-primary-600 leading-none">+</span>
                    </div>
                    <p className="font-bold text-sm text-slate-500 group-hover:text-primary-600 mt-3 transition-colors">Create Board</p>
                  </div>
                )}

                {/* Boards Iteration Grid */}
                {filteredBoards.map((board) => (
                  <div
                    key={board._id}
                    onClick={() => navigate(`/board/${board._id}`)}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 relative group cursor-pointer transition-all duration-200 h-36 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        {/* Board Initial Avatar */}
                        <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {board.title?.charAt(0)?.toUpperCase() || "B"}
                        </div>

                        {/* Owner Label for Shared Boards */}
                        {currentView === "shared" && board.owner && (
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 shadow-sm max-w-[120px]">
                            <div className="w-4 h-4 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center text-[8px] font-bold text-white shrink-0 overflow-hidden">
                              {board.owner.avatar ? (
                                <img src={board.owner.avatar} alt="" className="w-full h-full object-cover" />
                              ) : (
                                board.owner.name?.charAt(0).toUpperCase() || "O"
                              )}
                            </div>
                            <span className="text-[10px] font-semibold text-slate-500 truncate" title={board.owner.name}>
                              {board.owner.name}
                            </span>
                          </div>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-800 truncate mt-4" title={board.title}>
                        {board.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-slate-400 font-medium">
                        {new Date(board.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric"
                        })}
                      </p>

                      {/* Delete action (Only available for personal boards) */}
                      {currentView !== "shared" && (
                        <button
                          onClick={(e) => handleDeleteBoard(e, board._id)}
                          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer"
                          title="Move to Trash"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Empty State when search yields no results */}
            {!loading && filteredBoards.length === 0 && (
              <div className="text-center py-12 bg-white border border-slate-200/80 rounded-2xl">
                <p className="text-slate-400 text-sm font-semibold">No workspaces found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}

        {/* ─── TRASH TAB VIEW ─────────────────────────────────────────────────── */}
        {currentView === "trash" && (
          <div>
            <h2 className="font-display text-lg font-bold text-slate-800 uppercase tracking-wider mb-5 border-b border-slate-200/60 pb-3">
              Deleted Boards
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2].map(i => (
                  <div key={i} className="animate-pulse bg-white border border-slate-200/80 rounded-2xl h-36" />
                ))}
              </div>
            ) : deletedBoards.length === 0 ? (
              // Empty Trash State
              <div className="text-center py-12 bg-white border border-slate-200/80 rounded-2xl">
                <p className="text-slate-400 text-sm font-semibold">Trash is empty.</p>
              </div>
            ) : (
              // Deleted Boards Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {deletedBoards.map(board => (
                  <div 
                    key={board._id} 
                    className="bg-white rounded-2xl border border-red-100 p-6 flex flex-col justify-between h-36 shadow-sm hover:border-red-200 transition-all"
                  >
                    <div>
                      <h3 className="font-bold text-slate-800 truncate line-through decoration-red-300" title={board.title}>
                        {board.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Deleted: {new Date(board.deletedAt).toLocaleDateString("en-US")}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRestore(board._id)}
                        className="flex-1 text-xs font-bold py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all cursor-pointer border border-green-100 hover:border-green-200"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => permanentDeleteBoard(board._id)}
                        className="flex-1 text-xs font-bold py-2 bg-red-50/50 text-red-600 rounded-lg hover:bg-red-100 transition-all cursor-pointer border border-red-100 hover:border-red-200"
                      >
                        Delete Forever
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  )
}

export default UserDashboard