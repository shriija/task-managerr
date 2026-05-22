import React, { useEffect, useState } from "react"
import { useBoardStore } from "../context/BoardContext"

function ActivityView({ boardId }) {
  const activities = useBoardStore((s) => s.activities)
  const fetchActivities = useBoardStore((s) => s.fetchActivities)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (boardId) {
      setLoading(true)
      fetchActivities(boardId).finally(() => setLoading(false))
    }
  }, [boardId, fetchActivities])

  // Helper to format timestamps relative to current time
  const formatRelativeTime = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHr = Math.floor(diffMin / 60)
    const diffDays = Math.floor(diffHr / 24)

    if (diffSec < 60) return "Just now"
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHr < 24) return `${diffHr}h ago`
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Format action text dynamically to bold quoted titles
  const formatActionText = (text) => {
    if (!text) return ""
    const regex = /"([^"]+)"/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }
      parts.push(
        <span key={match.index} className="font-semibold text-slate-800">
          "{match[1]}"
        </span>
      )
      lastIndex = regex.lastIndex
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }
    return parts.length > 0 ? parts : text
  }

  // Get action styling and icon
  const getActionTypeInfo = (actionText) => {
    const text = actionText.toLowerCase()
    if (text.includes("created")) {
      return {
        bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        ),
      }
    }
    if (text.includes("delete")) {
      return {
        bg: "bg-rose-50 text-rose-600 border-rose-100",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        ),
      }
    }
    if (text.includes("moved")) {
      return {
        bg: "bg-blue-50 text-blue-600 border-blue-100",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
        ),
      }
    }
    if (text.includes("assign") || text.includes("invite") || text.includes("joined") || text.includes("member")) {
      return {
        bg: "bg-purple-50 text-purple-600 border-purple-100",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766zM15 12a3 3 0 11-6 0 3 3 0 016 0zm6.562-1.95a3.75 3.75 0 11-3.031 3.031 3.75 3.75 0 003.03-3.03z" />
          </svg>
        ),
      }
    }
    return {
      bg: "bg-amber-50 text-amber-600 border-amber-100",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
        </svg>
      ),
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-linear-to-br from-slate-50/50 via-white to-slate-50/30">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-gray-500">Loading activities...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-linear-to-br from-slate-50/50 via-white to-slate-50/30">
      
      {/* View Header */}
      <div className="px-8 py-6 border-b border-gray-100 bg-white/50 shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">History & Activity Logs</h2>
          <p className="text-sm text-gray-500 mt-0.5">Audit feed of changes made to this board, tasks, columns, and assignments.</p>
        </div>
        <button
          onClick={() => {
            setLoading(true)
            fetchActivities(boardId).finally(() => setLoading(false))
          }}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          title="Refresh Logs"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>

      {/* Main timeline container */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {activities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-800">No activity yet</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm">Actions performed on tasks, lists, or board settings will show up here in a timeline.</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto relative pl-6 border-l-2 border-slate-100 space-y-6">
            {activities.map((activity, index) => {
              const typeInfo = getActionTypeInfo(activity.action)
              const userInitials = activity.user?.name
                ? activity.user.name.charAt(0).toUpperCase()
                : "U"

              return (
                <div key={activity._id} className="relative group animate-fade-in-up">
                  
                  {/* Timeline status indicator dot */}
                  <div className={`absolute -left-[31px] top-1.5 w-6 h-6 rounded-full border-2 border-white 
                                  flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${typeInfo.bg}`}>
                    {typeInfo.icon}
                  </div>

                  <div className="bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-slate-200/80 
                                  rounded-2xl p-4 shadow-xs hover:shadow-sm transition-all duration-200 flex gap-4 items-start">
                    
                    {/* User Avatar */}
                    {activity.user?.avatar ? (
                      <img
                        src={activity.user.avatar}
                        alt={activity.user.name || "User"}
                        className="w-8 h-8 rounded-full object-cover shadow-2xs border border-gray-100"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-400 to-primary-500
                                      flex items-center justify-center text-white text-xs font-bold shadow-2xs border border-gray-100">
                        {userInitials}
                      </div>
                    )}

                    {/* Action text details */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-600 leading-relaxed">
                        <span className="font-bold text-slate-900 mr-1.5">
                          {activity.user?.name || "Unknown User"}
                        </span>
                        {formatActionText(activity.action)}
                      </div>
                      
                      {/* Timestamp */}
                      <span className="text-[11px] font-medium text-slate-400 mt-1.5 block tracking-wide">
                        {formatRelativeTime(activity.timestamp)}
                      </span>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}

export default ActivityView
