import { BarChart3, Home, Link2, LogOut, Moon, Shield, Sun, User } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const nav = [
  { to: '/dashboard', label: 'Links', icon: Link2 },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/admin', label: 'Admin', icon: Shield, admin: true }
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:block">
        <NavLink to="/dashboard" className="flex items-center gap-3 text-xl font-black">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-mint text-slate-950"><Home size={20} /></span>
          LinkFlow Pro
        </NavLink>
        <nav className="mt-8 space-y-2">
          {nav.filter((item) => !item.admin || user?.role === 'admin').map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold ${isActive ? 'bg-slate-100 text-ink dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Workspace</p>
            <h1 className="text-lg font-bold">{user?.name || 'LinkFlow'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary px-3" onClick={toggleTheme} aria-label="Toggle theme">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button className="btn-secondary px-3" onClick={() => navigate('/dashboard')} aria-label="Dashboard"><BarChart3 size={18} /></button>
            <button className="btn-secondary px-3" onClick={() => { logout(); navigate('/login'); }} aria-label="Logout"><LogOut size={18} /></button>
          </div>
        </header>
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
