import { ArrowRight, BarChart3, Link2, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 overflow-hidden font-sans">
      {/* Decorative Glow Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.06),transparent_50%)] pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] pointer-events-none" />

      <section className="relative z-10 flex min-h-screen flex-col justify-between">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-mint to-teal-500 text-slate-950 shadow-sm">
              <Link2 size={20} />
            </span>
            <span>LinkFlow Pro</span>
          </div>
          <Link className="btn-primary px-5 shadow-sm hover:shadow-md transition-all duration-200" to="/login">
            Open App <ArrowRight size={16} />
          </Link>
        </nav>

        {/* Centered Hero Content */}
        <div className="flex flex-col items-center justify-center text-center px-6 py-12 max-w-4xl mx-auto w-full flex-1 space-y-8">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-mint/10 border border-mint/20 px-3.5 py-1.5 text-xs font-semibold text-teal-600 dark:text-mint transition-all">
            <Sparkles size={12} className="animate-pulse" />
            <span>Next-Gen URL Management</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl text-slate-900 dark:text-white max-w-2xl">
            Shorten links. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint via-teal-600 to-indigo-600 dark:from-mint dark:to-indigo-400">
              Track conversion.
            </span>
          </h1>

          {/* Subtitle Description */}
          <p className="max-w-xl text-base leading-relaxed text-slate-500 dark:text-slate-400">
            A premium, secure URL shortening platform. Customize short links with aliases, analyze deep click statistics, enforce password protection, and filter bot traffic with ease.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link className="btn-primary px-8 py-3 text-sm shadow-md hover:shadow-lg transition-all rounded-xl" to="/register">
              Create Workspace
            </Link>
            <Link className="btn-secondary px-8 py-3 text-sm transition-all rounded-xl" to="/login">
              Sign In
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 w-full pt-10 border-t border-slate-200/50 dark:border-slate-800/80">
            {[
              { label: 'Links Created', value: '2,418', icon: Link2, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
              { label: 'Human Clicks', value: '98.2k', icon: BarChart3, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
              { label: 'Threats Blocked', value: '1,204', icon: ShieldCheck, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40' }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 bg-white/60 dark:bg-slate-900/60 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between text-left" key={item.label}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{item.label}</p>
                    <p className="mt-1 text-2xl font-black text-slate-800 dark:text-white">{item.value}</p>
                  </div>
                  <span className={`inline-flex p-2.5 rounded-xl ${item.bg} ${item.color}`}>
                    <Icon size={18} />
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer Accent spacer */}
        <div className="py-4" />
      </section>
    </main>
  );
}
