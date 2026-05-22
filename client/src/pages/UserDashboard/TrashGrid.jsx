export default function TrashGrid({ loading, deletedBoards, handleRestore, permanentDeleteBoard }) {
  return (
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
        <div className="text-center py-12 bg-white border border-slate-200/80 rounded-2xl">
          <p className="text-slate-400 text-sm font-semibold">Trash is empty.</p>
        </div>
      ) : (
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
  )
}
