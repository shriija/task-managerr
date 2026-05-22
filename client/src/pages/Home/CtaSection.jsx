import { NavLink } from 'react-router'

export default function CtaSection({ startPath }) {
  return (
    <section id="cta" className="py-20 bg-slate-900 text-white text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Start organizing your projects today.
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto mb-8 text-base">
          Join thousands of individual developers and collaborative teams using Kanvas to build things faster.
        </p>
        <div className="flex justify-center">
          <NavLink 
            to={startPath} 
            className="text-base font-semibold text-white bg-primary-600 hover:bg-primary-500 px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary-500/10"
          >
            Get Started for Free
          </NavLink>
        </div>
      </div>
    </section>
  )
}
