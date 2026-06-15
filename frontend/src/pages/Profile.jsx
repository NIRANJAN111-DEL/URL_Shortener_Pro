import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="panel max-w-2xl p-6">
      <h2 className="text-2xl font-black">Profile</h2>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <Info label="Name" value={user?.name} />
        <Info label="Email" value={user?.email} />
        <Info label="Role" value={user?.role} />
        <Info label="Joined" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'} />
      </dl>
    </div>
  );
}

function Info({ label, value }) {
  return <div><dt className="text-sm text-slate-500">{label}</dt><dd className="font-bold">{value}</dd></div>;
}
