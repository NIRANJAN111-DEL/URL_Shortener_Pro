import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="panel p-8 text-center">
        <h1 className="text-4xl font-black">404</h1>
        <p className="mt-2 text-slate-500">This page does not exist.</p>
        <Link className="btn-primary mt-6" to="/dashboard">Back to Dashboard</Link>
      </div>
    </main>
  );
}
