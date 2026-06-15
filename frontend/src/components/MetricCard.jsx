export default function MetricCard({ label, value, hint, icon: Icon, iconBg = 'bg-mint/10 text-mint' }) {
  return (
    <div className="panel group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700">
      {/* Top light glow effect */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-mint via-teal-500 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-all duration-300 group-hover:scale-105 origin-left">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        {Icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${iconBg}`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}
