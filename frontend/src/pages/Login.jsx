import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@linkflow.dev', password: 'Password123!' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <AuthShell title="Welcome back" footer={<Link className="font-semibold text-mint" to="/register">Create an account</Link>}>
      <form onSubmit={submit} className="space-y-4">
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button className="btn-primary w-full">Sign In</button>
      </form>
    </AuthShell>
  );
}

function AuthShell({ title, footer, children }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="panel w-full max-w-md p-6">
        <h1 className="text-2xl font-black">{title}</h1>
        <div className="mt-6">{children}</div>
        <div className="mt-5 text-center text-sm text-slate-500">{footer}</div>
      </div>
    </main>
  );
}
