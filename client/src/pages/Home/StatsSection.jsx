export default function StatsSection() {
  return (
    <section className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-extrabold text-slate-900 font-display">99.9%</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Platform Uptime</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-slate-900 font-display">5,000+</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Boards Active</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-slate-900 font-display">12ms</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Websocket Latency</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-slate-900 font-display">100%</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Intuitive Design</p>
          </div>
        </div>
      </div>
    </section>
  )
}
