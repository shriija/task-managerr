export default function Stats({ stats, deletedBoardsCount }) {
  return (
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
        <p className="font-display text-3xl font-extrabold text-slate-900 mt-1">{deletedBoardsCount}</p>
      </div>
    </div>
  )
}
