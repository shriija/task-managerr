export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Everything you need. Nothing you don't.
          </h2>
          <p className="text-slate-500 text-lg">
            We focus on clean workspaces and reliable collaboration features so your team stays focused on launching.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 transition-all hover:bg-white hover:shadow-md hover:border-slate-300">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 mb-6 border border-primary-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Visual Task Boards</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Organize tasks into customizable lists. Instantly see status labels, priorities, and deadlines in a structured dashboard.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 transition-all hover:bg-white hover:shadow-md hover:border-slate-300">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 mb-6 border border-primary-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Interactive Calendar</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Filter and schedule cards directly via a monthly grid. Add quick tasks to specific days or drag unscheduled tasks into cells.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 transition-all hover:bg-white hover:shadow-md hover:border-slate-300">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 mb-6 border border-primary-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Team Collaboration</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Invite team members via security-validated links, assign task cards, and synchronize project boards instantly over sockets.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 transition-all hover:bg-white hover:shadow-md hover:border-slate-300">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 mb-6 border border-primary-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Resource Uploads</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Attach documents, mockups, or design sheets directly to task boards for centralized access and easy referencing.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 transition-all hover:bg-white hover:shadow-md hover:border-slate-300">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 mb-6 border border-primary-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">History & Tracking</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Access audit logs detailing board adjustments, title modifications, assignments, and column movements.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 transition-all hover:bg-white hover:shadow-md hover:border-slate-300">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 mb-6 border border-primary-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Trash Management</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Restore accidentally deleted cards or lists from a centralized trash bin before they are permanently purged.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
