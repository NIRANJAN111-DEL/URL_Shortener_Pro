import { Download, BarChart3, User, Cpu, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { CountryBars, DailyTrend, Distribution } from '../components/Charts.jsx';
import MetricCard from '../components/MetricCard.jsx';

export default function Analytics() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/analytics/${id}`).then((res) => setData(res.data.data));
  }, [id]);

  if (!data) return <p>Loading analytics...</p>;

  const exportCsv = async () => {
    const res = await api.get(`/urls/${id}/export`, { responseType: 'blob' });
    const href = URL.createObjectURL(res.data);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${data.url.shortCode}-analytics.csv`;
    link.click();
    URL.revokeObjectURL(href);
  };

  return <AnalyticsView data={data} onExport={exportCsv} />;
}

export function AnalyticsView({ data, onExport }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-black">Analytics</h2>
          <p className="break-all text-sm text-slate-500">{data.url.originalUrl}</p>
        </div>
        {onExport && <button className="btn-secondary" onClick={onExport}><Download size={18} />Export CSV</button>}
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total clicks" value={data.totals.totalClicks} icon={BarChart3} iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" />
        <MetricCard label="Human clicks" value={data.totals.humanClicks} icon={User} iconBg="bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" />
        <MetricCard label="Bot clicks" value={data.totals.botClicks} icon={Cpu} iconBg="bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400" />
        <MetricCard label="Last visited" value={data.totals.lastVisitedAt ? new Date(data.totals.lastVisitedAt).toLocaleDateString() : 'Never'} icon={Calendar} iconBg="bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400" />
      </div>
      <section className="panel p-4"><h3 className="mb-4 font-bold">Daily Click Trend</h3><DailyTrend data={data.daily} /></section>
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="panel p-4"><h3 className="mb-4 font-bold">Top Countries</h3><CountryBars data={data.topCountries} /></section>
        <section className="panel p-4"><h3 className="mb-4 font-bold">Devices</h3><Distribution data={data.devices} /></section>
        <section className="panel p-4"><h3 className="mb-4 font-bold">Browsers</h3><Distribution data={data.browsers} /></section>
      </div>
      <section className="panel overflow-hidden">
        <div className="border-b border-slate-200 p-4 font-bold dark:border-slate-800">Recent Visits</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {data.recentVisits.map((visit) => (
                <tr key={visit._id}>
                  <td className="p-3">{new Date(visit.visitedAt).toLocaleString()}</td>
                  <td className="p-3">{visit.country} / {visit.city}</td>
                  <td className="p-3">{visit.device}</td>
                  <td className="p-3">{visit.browser}</td>
                  <td className="p-3">{visit.os}</td>
                  <td className="p-3">{visit.isBot ? 'Bot' : 'Human'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
