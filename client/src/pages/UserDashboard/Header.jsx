export default function Header({ getGreeting, currentUser, currentView, searchQuery, setSearchQuery }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
      <div>
        <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">
          {getGreeting()}, {currentUser?.name || "User"}
        </h1>
        <p className="text-slate-500 text-sm mt-1">Here's an overview of your active workspaces and boards.</p>
      </div>

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
  )
}
