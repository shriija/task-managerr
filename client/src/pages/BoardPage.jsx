import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { useBoardStore } from "../context/BoardContext"
import { useAuthStore } from "../context/AuthContext"
import Board from "../components/Board"

function BoardPage() {

  const { id } = useParams()
  const { board, loading, error, fetchBoard, addList, reset } = useBoardStore()
  const currentUser = useAuthStore(s => s.currentUser)

  const [searchQuery, setSearchQuery] = useState("")

  // Fetch board data on mount
  useEffect(() => {
    if (id) fetchBoard(id)
    return () => reset()
  }, [id, fetchBoard, reset])

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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">

      {/* ─── SIDEBAR ──────────────────────────────────── */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-100
                         flex-col p-6 hidden lg:flex">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600
                          rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </div>
          <h1 className="font-extrabold text-lg text-gray-900 tracking-tight">
            Kanvas
          </h1>
        </div>

        {/* Nav items */}
        <nav className="space-y-1 text-sm">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                                 bg-primary-50 text-primary-600 font-semibold">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            Boards
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                                 text-gray-500 hover:bg-gray-50 hover:text-gray-700
                                 transition-colors">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            My Tasks
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                                 text-gray-500 hover:bg-gray-50 hover:text-gray-700
                                 transition-colors">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            Calendar
          </a>
        </nav>

        {/* Bottom: New Project */}
        <button
          onClick={() => addList(board?._id || "local", "New List")}
          className="mt-auto bg-gradient-to-r from-primary-500 to-primary-600
                     hover:from-primary-600 hover:to-primary-700
                     text-white text-sm font-semibold py-3 rounded-xl
                     shadow-sm hover:shadow-md
                     transition-all duration-200 cursor-pointer
                     flex items-center justify-center gap-2"
        >
          <span className="text-lg leading-none">+</span>
          New Column
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
                  className="w-8 h-8 rounded-full border-2 border-white
                             bg-gradient-to-br from-primary-300 to-primary-500
                             flex items-center justify-center shadow-sm"
                >
                  <span className="text-[10px] font-bold text-white">
                    {typeof m === "string" ? m.charAt(0).toUpperCase() : "U"}
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

        {/* ─── BOARD CANVAS ───────────────────────────── */}
        <Board />

      </main>

    </div>
  )
}

export default BoardPage