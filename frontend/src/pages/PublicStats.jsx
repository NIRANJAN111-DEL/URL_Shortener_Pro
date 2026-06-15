import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { AnalyticsView } from './Analytics.jsx';

export default function PublicStats() {
  const { shortCode } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/public/stats/${shortCode}`).then((res) => setData(res.data.data)).catch((err) => setError(err.response?.data?.message || 'Stats unavailable'));
  }, [shortCode]);

  if (error) return <main className="grid min-h-screen place-items-center p-4"><div className="panel p-6">{error}</div></main>;
  if (!data) return <main className="p-6">Loading stats...</main>;
  return <main className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 sm:p-6"><AnalyticsView data={data} /></main>;
}
