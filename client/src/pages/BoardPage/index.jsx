import { useParams, useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { useBoardStore } from "../../context/BoardContext"
import { useAuthStore } from "../../context/AuthContext"
import Board from "../../components/Board"
import CalendarView from "../../components/CalendarView"
import TrashView from "../../components/TrashView"
import ActivityView from "../../components/ActivityView"
import InviteModal from "../../components/InviteModal"
import MembersModal from "../../components/MembersModal"
import * as socketService from "../../socket/socketService"
import Sidebar from "./Sidebar"
import Header from "./Header"

function BoardPage() {
  const { id, view } = useParams()
  const navigate = useNavigate()
  const currentView = view || "board"
  const { board, loading, error, fetchBoard, addList, reset, setupSocket, updateBoardSettings } = useBoardStore()
  const currentUser = useAuthStore(s => s.currentUser)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [showInvite, setShowInvite] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState("")

  const isOwner = board?.owner?._id === currentUser?._id || board?.owner === currentUser?._id

  useEffect(() => {
    if (board) setTitleValue(board.title)
  }, [board])

  const handleTitleSave = () => {
    const trimmed = titleValue.trim()
    if (!trimmed) {
      setTitleValue(board?.title || "")
      setEditingTitle(false)
      return
    }
    if (trimmed !== board?.title) {
      updateBoardSettings(id, { title: trimmed })
    }
    setEditingTitle(false)
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") handleTitleSave()
    if (e.key === "Escape") {
      setTitleValue(board?.title || "")
      setEditingTitle(false)
    }
  }

  useEffect(() => {
    if (!view || !["board", "my-tasks", "calendar", "trash", "activity"].includes(view)) {
      navigate(`/board/${id}/board`, { replace: true })
    }
  }, [id, view, navigate])

  useEffect(() => {
    if (id) fetchBoard(id)
    return () => reset()
  }, [id, fetchBoard, reset])

  useEffect(() => {
    if (id && currentUser) {
      const socket = socketService.connectSocket()
      setupSocket(socket)
      socketService.joinBoard(id, currentUser)
    }
    return () => {
      if (id) socketService.leaveBoard(id)
    }
  }, [id, currentUser, setupSocket])

  if (loading) {
    return (
      <div className="flex h-screen bg-background-light">
        <aside className="w-64 bg-white border-r p-6 hidden lg:flex flex-col gap-6">
          <div className="animate-pulse bg-gray-200 rounded-lg h-8 w-32" />
          <div className="space-y-3 mt-4">
            <div className="animate-pulse bg-gray-200 rounded-lg h-5 w-full" />
            <div className="animate-pulse bg-gray-200 rounded-lg h-5 w-3/4" />
            <div className="animate-pulse bg-gray-200 rounded-lg h-5 w-5/6" />
          </div>
          <div className="animate-pulse bg-gray-200 rounded-xl h-10 w-full mt-auto" />
        </aside>
        <main className="flex-1 flex flex-col">
          <header className="h-16 bg-white border-b flex items-center px-8 gap-4">
            <div className="animate-pulse bg-gray-200 rounded-lg h-6 w-48" />
            <div className="flex -space-x-2 ml-4">
              <div className="animate-pulse bg-gray-200 rounded-full w-8 h-8" />
              <div className="animate-pulse bg-gray-200 rounded-full w-8 h-8" />
              <div className="animate-pulse bg-gray-200 rounded-full w-8 h-8" />
            </div>
          </header>
          <div className="flex-1 p-8 flex gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-80 shrink-0">
                <div className="animate-pulse bg-gray-200 rounded-xl h-10 w-full mb-3" />
                <div className="animate-pulse bg-gray-200 rounded-xl h-20 w-full mb-2" />
                <div className="animate-pulse bg-gray-200 rounded-xl h-16 w-full mb-2" />
                <div className="animate-pulse bg-gray-200 rounded-xl h-14 w-full" />
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-background-light items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Board not found</h2>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <Sidebar 
          id={id} 
          currentView={currentView} 
          addList={addList} 
          board={board} 
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Header
            board={board}
            isOwner={isOwner}
            editingTitle={editingTitle}
            titleValue={titleValue}
            setTitleValue={setTitleValue}
            handleTitleSave={handleTitleSave}
            handleTitleKeyDown={handleTitleKeyDown}
            setEditingTitle={setEditingTitle}
            setShowMembers={setShowMembers}
            setShowInvite={setShowInvite}
            updateBoardSettings={updateBoardSettings}
            id={id}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          {currentView === "calendar" ? (
            <CalendarView searchQuery={searchQuery} />
          ) : currentView === "activity" ? (
            <ActivityView boardId={id} />
          ) : currentView === "trash" ? (
            <TrashView boardId={id} />
          ) : (
            <Board searchQuery={searchQuery} filterByMe={currentView === "my-tasks"} />
          )}
        </main>
      </div>
      {showInvite && <InviteModal boardId={id} onClose={() => setShowInvite(false)} />}
      {showMembers && <MembersModal onClose={() => setShowMembers(false)} />}
    </>
  )
}

export default BoardPage
