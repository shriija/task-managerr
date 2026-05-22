export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 text-center text-slate-500 text-sm">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-linear-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            K
          </div>
          <span className="font-display font-bold text-slate-900">Kanvas</span>
        </div>
        <div>
          &copy; {new Date().getFullYear()} Kanvas. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#features" className="hover:text-slate-800 transition-colors">Privacy</a>
          <a href="#features" className="hover:text-slate-800 transition-colors">Terms</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-800 transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  )
}
