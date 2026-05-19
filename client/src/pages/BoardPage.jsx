import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { useBoardStore } from "../context/BoardContext"
import { useAuthStore } from "../context/AuthContext"
import Board from "../components/Board"
import CalendarView from "../components/CalendarView"
import TrashView from "../components/TrashView"
import InviteModal from "../components/InviteModal"
import * as socketService from "../socket/socketService"

function BoardPage() {

  const { id } = useParams()
  const { board, loading, error, fetchBoard, addList, reset, setupSocket, updateBoardSettings } = useBoardStore()
  const currentUser = useAuthStore(s => s.currentUser)
  

  const [searchQuery, setSearchQuery] = useState("")
  const [currentView, setCurrentView] = useState("board")
  const [showInvite, setShowInvite] = useState(false)

  const isOwner = board?.owner?._id === currentUser?._id || board?.owner === currentUser?._id

  // Fetch board data on mount
  useEffect(() => {
    if (id) fetchBoard(id)
    return () => reset()
  }, [id, fetchBoard, reset])

  // Socket setup
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

  // ── Loading Skeleton ─────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen bg-background-light">

        {/* Sidebar skeleton */}
        <aside className="w-64 bg-white border-r p-6 hidden lg:flex flex-col gap-6">
          <div className="animate-pulse bg-gray-200 rounded-lg h-8 w-32" />
          <div className="space-y-3 mt-4">
            <div className="animate-pulse bg-gray-200 rounded-lg h-5 w-full" />
            <div className="animate-pulse bg-gray-200 rounded-lg h-5 w-3/4" />
            <div className="animate-pulse bg-gray-200 rounded-lg h-5 w-5/6" />
          </div>
          <div className="animate-pulse bg-gray-200 rounded-xl h-10 w-full mt-auto" />
        </aside>

        {/* Main skeleton */}
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
              <div key={i} className="w-80 flex-shrink-0">
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

  // ── Error State ──────────────────────────────────────
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

  // ── Main Board Layout ────────────────────────────────
  return (
    <>
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">

      {/* ─── SIDEBAR ──────────────────────────────────── */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-100
                         flex-col p-6 hidden lg:flex">

        {/* Nav items */}
        <nav className="space-y-1 text-sm">
          <button 
            onClick={() => setCurrentView("board")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              currentView === "board" 
                ? "bg-primary-50 text-primary-600 font-semibold" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}>
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            Lists
          </button>
          <button 
            onClick={() => setCurrentView("my-tasks")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              currentView === "my-tasks"
                ? "bg-primary-50 text-primary-600 font-semibold"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}>
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            My Tasks
          </button>
          <button 
            onClick={() => setCurrentView("calendar")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              currentView === "calendar"
                ? "bg-primary-50 text-primary-600 font-semibold"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}>
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            Calendar
          </button>
          <button 
            onClick={() => setCurrentView("trash")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              currentView === "trash"
                ? "bg-red-50 text-red-600 font-semibold"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}>
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Trash
          </button>
        </nav>

        {/* Bottom: New Project */}
        <button
          onClick={() => addList(board?._id || "local", "New List")}
          className="mt-3.5 bg-gradient-to-r from-primary-500 to-primary-600
                     hover:from-primary-600 hover:to-primary-700
                     text-white text-sm font-semibold py-3 rounded-xl
                     shadow-sm hover:shadow-md
                     transition-all duration-200 cursor-pointer
                     flex items-center justify-center gap-2"
        >
          <span className="text-lg leading-none">+</span>
          New List
        </button>

      </aside>

      {/* ─── MAIN ─────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* ─── HEADER ─────────────────────────────────── */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100
                           flex items-center justify-between px-8 flex-shrink-0">

          <div className="flex items-center gap-4">
            {/* Board title */}
            <h2 className="font-bold text-lg text-gray-900">
              {board?.title || "Board"}
            </h2>

            {/* Members */}
            <div className="flex -space-x-2.5 ml-2">
              {(board?.members || []).slice(0, 4).map((m, i) => (
                <div
                  key={i}
                  title={m?.name || m}
                  className="w-8 h-8 rounded-full border-2 border-white
                             bg-gradient-to-br from-primary-300 to-primary-500
                             flex items-center justify-center shadow-sm cursor-default"
                >
                  <span className="text-[10px] font-bold text-white">
                    {m?.name ? m.name.charAt(0).toUpperCase() : (typeof m === "string" ? m.charAt(0).toUpperCase() : "U")}
                  </span>
                </div>
              ))}
              {(board?.members?.length || 0) > 4 && (
                <div className="w-8 h-8 rounded-full border-2 border-white
                               bg-gray-100 flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-gray-500">
                    +{board.members.length - 4}
                  </span>
                </div>
              )}
            </div>

            {/* Invite button — owner only */}
            {isOwner && (
              <button
                onClick={() => setShowInvite(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5
                           bg-gradient-to-r from-primary-500 to-primary-600
                           hover:from-primary-600 hover:to-primary-700
                           text-white text-xs font-semibold rounded-lg
                           shadow-sm hover:shadow-md transition-all duration-200 ml-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
                Invite
              </button>
            )}

            {/* Multiple Assignees Toggle */}
            {isOwner && (
              <label className="flex items-center gap-2 cursor-pointer ml-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Multiple Assignees</span>
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={board?.allowMultipleAssignees || false} onChange={() => updateBoardSettings(id, { allowMultipleAssignees: !board?.allowMultipleAssignees })} />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${board?.allowMultipleAssignees ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${board?.allowMultipleAssignees ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm
                         w-56 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-primary-200
                         focus:border-primary-300 transition-all bg-gray-50/50"
            />
          </div>

        </header>

        {/* ─── BOARD CANVAS / VIEWS ───────────────────────────── */}
        {currentView === "calendar" ? (
          <CalendarView />
        ) : currentView === "trash" ? (
          <TrashView boardId={id} />
        ) : (
          <Board searchQuery={searchQuery} filterByMe={currentView === "my-tasks"} />
        )}

      </main>

    </div>

    {/* ─── INVITE MODAL (portal-level overlay) ─────────────── */}
    {showInvite && (
      <InviteModal
        boardId={id}
        onClose={() => setShowInvite(false)}
      />
    )}
  </>
  )
}

export default BoardPage