export default function BoardsGrid({ currentView, loading, searchQuery, filteredBoards, boards, navigate, handleDeleteBoard }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5 border-b border-slate-200/60 pb-3">
        <h2 className="font-display text-lg font-bold text-slate-800 uppercase tracking-wider">
          {currentView === "boards" ? "Active Boards" : "Shared Boards"}
        </h2>
        {searchQuery && (
          <span className="text-xs text-slate-500">
            Showing {filteredBoards.length} of {boards.length} results
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse bg-white border border-slate-200/80 rounded-2xl h-36" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          
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

          {filteredBoards.map((board) => (
            <div
              key={board._id}
              onClick={() => navigate(`/board/${board._id}`)}
              className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 relative group cursor-pointer transition-all duration-200 h-36 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {board.title?.charAt(0)?.toUpperCase() || "B"}
                  </div>

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
      
      {!loading && filteredBoards.length === 0 && (
        <div className="text-center py-12 bg-white border border-slate-200/80 rounded-2xl">
          <p className="text-slate-400 text-sm font-semibold">No workspaces found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  )
}
