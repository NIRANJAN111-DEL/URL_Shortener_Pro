import { Upload, Link2, BarChart3, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import MetricCard from '../components/MetricCard.jsx';
import UrlForm from '../components/UrlForm.jsx';
import UrlTable from '../components/UrlTable.jsx';

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [error, setError] = useState('');

  const fetchUrls = async () => {
    const { data } = await api.get('/urls', { params: { search, status } });
    setUrls(data.data.items);
  };

  useEffect(() => {
    const timeout = setTimeout(fetchUrls, 250);
    return () => clearTimeout(timeout);
  }, [search, status]);

  const metrics = useMemo(() => ({
    links: urls.length,
    clicks: urls.reduce((sum, item) => sum + item.totalClicks, 0),
    starred: urls.filter((item) => item.isStarred).length
  }), [urls]);

  const create = async (payload) => {
    setError('');
    try {
      await api.post('/urls', payload);
      await fetchUrls();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create URL');
    }
  };

  const edit = async (url) => {
    const originalUrl = window.prompt('Update destination URL', url.originalUrl);
    if (!originalUrl) return;
    await api.patch(`/urls/${url._id}`, { originalUrl });
    fetchUrls();
  };

  const bulkUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const csv = await file.text();
    await api.post('/urls/bulk', { csv });
    fetchUrls();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-black">Dashboard</h2>
          <p className="text-sm text-slate-500">Create, monitor, and analyze every short link.</p>
        </div>
        <label className="btn-secondary cursor-pointer">
          <Upload size={18} />Bulk CSV
          <input type="file" accept=".csv,text/csv" className="hidden" onChange={bulkUpload} />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Links" value={metrics.links} icon={Link2} iconBg="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400" />
        <MetricCard label="Total clicks" value={metrics.clicks} icon={BarChart3} iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" />
        <MetricCard label="Starred" value={metrics.starred} icon={Star} iconBg="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400" />
      </div>
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <UrlForm onSubmit={create} />
      <UrlTable
        urls={urls}
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        onEdit={edit}
        onDelete={async (id) => { await api.delete(`/urls/${id}`); fetchUrls(); }}
        onToggleStar={async (url) => { await api.patch(`/urls/${url._id}`, { isStarred: !url.isStarred }); fetchUrls(); }}
        onHealth={async (url) => { await api.post(`/urls/${url._id}/health`); fetchUrls(); }}
        onToggleStatus={async (url) => { await api.patch(`/urls/${url._id}`, { isActive: !url.isActive }); fetchUrls(); }}
      />
    </div>
  );
}
