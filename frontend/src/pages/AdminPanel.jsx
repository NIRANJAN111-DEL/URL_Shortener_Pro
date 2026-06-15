import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import MetricCard from '../components/MetricCard.jsx';
import { Users, Link2, Activity, Cpu } from 'lucide-react';

export default function AdminPanel() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    api.get('/admin/overview').then((res) => setOverview(res.data.data));
    api.get('/admin/users').then((res) => setUsers(res.data.data));
  }, [user]);

  if (user?.role !== 'admin') return <div className="panel p-6">Admin access required.</div>;

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black">Admin Panel</h2>
      {overview && (
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Users" value={overview.users} icon={Users} iconBg="bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" />
          <MetricCard label="URLs" value={overview.urls} icon={Link2} iconBg="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400" />
          <MetricCard label="Visits" value={overview.visits} icon={Activity} iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" />
          <MetricCard label="Bot visits" value={overview.bots} icon={Cpu} iconBg="bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400" />
        </div>
      )}
      <div className="panel overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950"><tr><th className="p-3">User</th><th className="p-3">Email</th><th className="p-3">Role</th></tr></thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {users.map((item) => <tr key={item._id}><td className="p-3">{item.name}</td><td className="p-3">{item.email}</td><td className="p-3">{item.role}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
