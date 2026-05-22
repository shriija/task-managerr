export default function Header({
  board,
  isOwner,
  editingTitle,
  titleValue,
  setTitleValue,
  handleTitleSave,
  handleTitleKeyDown,
  setEditingTitle,
  setShowMembers,
  setShowInvite,
  updateBoardSettings,
  id,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-4">
        {isOwner ? (
          editingTitle ? (
            <input
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyDown}
              className="font-bold text-lg text-gray-900 outline-none border-b-2 border-primary-500 bg-transparent py-0.5"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => setEditingTitle(true)}>
              <h2 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                {board?.title || "Board"}
              </h2>
              <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
            </div>
          )
        ) : (
          <h2 className="font-bold text-lg text-gray-900">
            {board?.title || "Board"}
          </h2>
        )}

        <div 
          onClick={() => setShowMembers(true)}
          className="flex -space-x-2.5 ml-2 cursor-pointer hover:opacity-85 active:scale-95 transition-all"
          title="View & Manage Members"
        >
          {(board?.members || []).slice(0, 4).map((m, i) => (
            <div
              key={i}
              title={m?.name || m}
              className="w-8 h-8 rounded-full border-2 border-white bg-linear-to-br from-primary-300 to-primary-500 flex items-center justify-center shadow-sm cursor-default"
            >
              <span className="text-[10px] font-bold text-white">
                {m?.name ? m.name.charAt(0).toUpperCase() : (typeof m === "string" ? m.charAt(0).toUpperCase() : "U")}
              </span>
            </div>
          ))}
          {(board?.members?.length || 0) > 4 && (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
              <span className="text-[10px] font-semibold text-gray-500">
                +{board.members.length - 4}
              </span>
            </div>
          )}
        </div>

        {isOwner && (
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ml-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
            Invite
          </button>
        )}

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
          className="border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm w-56 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all bg-gray-50/50"
        />
      </div>
    </header>
  );
}
