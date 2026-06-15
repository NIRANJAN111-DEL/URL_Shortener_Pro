import { Plus, Link2, Sparkles, Calendar, Lock } from 'lucide-react';
import { useState } from 'react';

const initial = { originalUrl: '', customAlias: '', expiresAt: '', password: '', isPublicStatsEnabled: true };

export default function UrlForm({ onSubmit }) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    await onSubmit(form);
    setForm(initial);
    setBusy(false);
  };

  return (
    <div className="panel p-6 bg-white dark:bg-slate-900">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Shorten a new URL</h3>
      <form onSubmit={submit} className="flex flex-col gap-4">
        {/* Main Inputs Row */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Destination URL */}
          <div className="relative">
            <Link2 className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" size={16} />
            <input 
              className="input pl-10" 
              name="originalUrl" 
              value={form.originalUrl} 
              onChange={update} 
              placeholder="Paste long URL (e.g., https://example.com/...)" 
              required 
            />
          </div>

          {/* Custom Alias */}
          <div className="relative">
            <Sparkles className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" size={16} />
            <input 
              className="input pl-10" 
              name="customAlias" 
              value={form.customAlias} 
              onChange={update} 
              placeholder="Custom alias (optional)" 
            />
          </div>

          {/* Expiry Date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" size={16} />
            <input 
              className="input pl-10 text-slate-500 dark:text-slate-400" 
              name="expiresAt" 
              type="date" 
              value={form.expiresAt} 
              onChange={update} 
            />
          </div>

          {/* Password Protection */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" size={16} />
            <input 
              className="input pl-10" 
              name="password" 
              value={form.password} 
              onChange={update} 
              placeholder="Password protect (optional)" 
            />
          </div>
        </div>

        {/* Footer Settings Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
            <input 
              type="checkbox" 
              name="isPublicStatsEnabled" 
              checked={form.isPublicStatsEnabled} 
              onChange={update} 
              className="rounded border-slate-300 text-mint focus:ring-mint accent-mint h-4 w-4"
            />
            <span>Enable public statistics page for this link</span>
          </label>
          
          <button 
            type="submit" 
            className="btn-primary px-6" 
            disabled={busy}
          >
            <Plus size={16} />
            <span>Shorten Link</span>
          </button>
        </div>
      </form>
    </div>
  );
}
