import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import axios from "axios"
import { API_URL } from "../../services/api"
import { useBoardStore } from "../../context/BoardContext"
import { useAuthStore } from "../../context/AuthContext"

import Sidebar from "./Sidebar"
import Header from "./Header"
import Stats from "./Stats"
import BoardsGrid from "./BoardsGrid"
import TrashGrid from "./TrashGrid"

function UserDashboard() {
  const navigate = useNavigate()
  const { tab } = useParams()
  const currentView = tab || "boards"

  const currentUser = useAuthStore((state) => state.currentUser)
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [stats, setStats] = useState({ personal: 0, shared: 0 })

  const deletedBoards = useBoardStore(s => s.deletedBoards)
  const fetchDeletedBoards = useBoardStore(s => s.fetchDeletedBoards)
  const restoreBoard = useBoardStore(s => s.restoreBoard)
  const permanentDeleteBoard = useBoardStore(s => s.permanentDeleteBoard)

  const getGreeting = () => {
    const hrs = new Date().getHours()
    if (hrs < 12) return "Good morning"
    if (hrs < 18) return "Good afternoon"
    return "Good evening"
  }

  useEffect(() => {
    if (!tab || !["boards", "shared", "trash"].includes(tab)) {
      navigate("/dashboard/boards", { replace: true })
    }
  }, [tab, navigate])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError("")
        
        let endpoint = `${API_URL}/board-api/`
        if (currentView === "shared") {
          endpoint = `${API_URL}/board-api/shared/all`
        }

        if (currentView === "trash") {
          await fetchDeletedBoards()
        } else {
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

  const handleDeleteBoard = async (e, boardId) => {
    e.stopPropagation()
    try {
      await axios.delete(`${API_URL}/board-api/deleteBoard/${boardId}`, { withCredentials: true })
      setBoards(boards.filter(b => b._id !== boardId))
      setStats(prev => ({ ...prev, personal: Math.max(0, prev.personal - 1) }))
    } catch (err) {
      console.error("Failed to delete board", err)
    }
  }

  const handleRestore = async (boardId) => {
    await restoreBoard(boardId)
    setStats(prev => ({ ...prev, personal: prev.personal + 1 }))
  }

  const filteredBoards = boards.filter(b => 
    b.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-slate-50 font-body">
      <Sidebar navigate={navigate} currentView={currentView} />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        <Header 
          getGreeting={getGreeting} 
          currentUser={currentUser} 
          currentView={currentView} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        <Stats stats={stats} deletedBoardsCount={deletedBoards.length} />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200/50 rounded-2xl text-center">
            <p className="text-red-600 text-sm font-semibold">{error}</p>
          </div>
        )}

        {(currentView === "boards" || currentView === "shared") && (
          <BoardsGrid 
            currentView={currentView}
            loading={loading}
            searchQuery={searchQuery}
            filteredBoards={filteredBoards}
            boards={boards}
            navigate={navigate}
            handleDeleteBoard={handleDeleteBoard}
          />
        )}

        {currentView === "trash" && (
          <TrashGrid 
            loading={loading}
            deletedBoards={deletedBoards}
            handleRestore={handleRestore}
            permanentDeleteBoard={permanentDeleteBoard}
          />
        )}

      </main>
    </div>
  )
}

export default UserDashboard
