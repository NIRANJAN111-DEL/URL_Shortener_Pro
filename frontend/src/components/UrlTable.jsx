import { Copy, Edit3, BarChart3, QrCode, Globe, Heart, Activity, Trash2, MoreHorizontal, Check, Search, Lock, Calendar } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function CopyButton({ value, onCopy }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    if (onCopy) onCopy();
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button 
      onClick={handleCopy} 
      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors animate-in duration-200"
      title="Copy Link"
    >
      {copied ? <Check size={14} className="text-emerald-500 animate-in zoom-in-50 duration-200" /> : <Copy size={14} />}
    </button>
  );
}

export default function UrlTable({ urls, onDelete, onEdit, onToggleStar, onHealth, onToggleStatus, search, setSearch, status, setStatus }) {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const downloadQr = (code) => {
    const canvas = document.getElementById(`qr-${code}`);
    const link = document.createElement('a');
    link.download = `${code}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  useEffect(() => {
    const handleClose = () => setActiveMenuId(null);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  return (
    <div className="panel overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-soft relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <Check size={16} className="text-mint font-bold" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search & Filter Header */}
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 dark:border-slate-800/80 md:flex-row items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" size={16} />
          <input 
            className="input pl-10" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search links..." 
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 hidden md:inline">Status:</span>
          <select 
            className="input md:w-40 cursor-pointer" 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        {urls.length === 0 ? (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500 font-medium">
            No shortened links found matching your criteria.
          </div>
        ) : (
          <table className="w-full min-w-[980px] text-left text-sm border-collapse">
            <thead className="bg-slate-50/55 text-xs uppercase text-slate-500 dark:bg-slate-950/30 border-b border-slate-100 dark:border-slate-800/80">
              <tr>
                <th className="px-5 py-3.5 font-bold">Link Details</th>
                <th className="px-5 py-3.5 font-bold">Status</th>
                <th className="px-5 py-3.5 font-bold">Clicks</th>
                <th className="px-5 py-3.5 font-bold">Created</th>
                <th className="px-5 py-3.5 font-bold">Expiry</th>
                <th className="px-5 py-3.5 font-bold text-right pr-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {urls.map((url) => (
                <tr key={url._id} className="align-middle hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                  {/* Link Details */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <a 
                        className="font-bold text-slate-800 hover:text-mint dark:text-white dark:hover:text-mint transition-colors" 
                        href={url.shortUrl} 
                        target="_blank" 
                        rel="noreferrer"
                      >
                        {url.shortUrl.replace(/^https?:\/\//, '')}
                      </a>
                      <CopyButton value={url.shortUrl} onCopy={() => triggerToast('Link copied to clipboard!')} />
                      <QRCodeCanvas id={`qr-${url.shortCode}`} value={url.shortUrl} size={96} className="hidden" />
                    </div>
                    
                    {/* Visual Tags/Badges */}
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <div className="max-w-[260px] truncate text-xs text-slate-400 dark:text-slate-500" title={url.originalUrl}>
                        {url.originalUrl}
                      </div>
                      {url.isPasswordProtected && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded" title="Password Protected">
                          <Lock size={10} />
                          PASS
                        </span>
                      )}
                      {url.isPublicStatsEnabled && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/20 px-1.5 py-0.5 rounded" title="Public Stats Enabled">
                          <Globe size={10} />
                          STATS
                        </span>
                      )}
                      {url.expiresAt && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded" title={`Expires on ${new Date(url.expiresAt).toLocaleDateString()}`}>
                          <Calendar size={10} />
                          EXPIRY
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status Toggle Switch */}
                  <td className="px-5 py-4">
                    {url.expiresAt && new Date(url.expiresAt) <= new Date() ? (
                      <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100 dark:border-rose-800/30">
                        Expired
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onToggleStatus && onToggleStatus(url)}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            url.isActive ? 'bg-mint' : 'bg-slate-200 dark:bg-slate-800'
                          }`}
                          title={url.isActive ? 'Deactivate Link' : 'Activate Link'}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              url.isActive ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {url.isActive ? 'Active' : 'Paused'}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Clicks */}
                  <td className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-300">
                    {url.totalClicks.toLocaleString()}
                  </td>

                  {/* Created */}
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                    {new Date(url.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  {/* Expiry */}
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                    {url.expiresAt ? (
                      <span>
                        {new Date(url.expiresAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600 font-medium">Never</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right pr-8">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      {/* View Analytics */}
                      <Link 
                        className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all duration-200" 
                        to={`/analytics/${url._id}`} 
                        title="View Analytics"
                      >
                        <BarChart3 size={16} />
                      </Link>

                      {/* Edit Destination */}
                      <button 
                        className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all duration-200" 
                        onClick={() => onEdit(url)} 
                        title="Edit Destination"
                      >
                        <Edit3 size={16} />
                      </button>

                      {/* Star Link */}
                      <button 
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          url.isStarred 
                            ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20' 
                            : 'text-slate-500 hover:text-rose-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-slate-800'
                        }`} 
                        onClick={() => onToggleStar(url)} 
                        title={url.isStarred ? 'Unstar Link' : 'Star Link'}
                      >
                        <Heart size={16} fill={url.isStarred ? 'currentColor' : 'none'} />
                      </button>

                      {/* More Actions Dropdown */}
                      <div className="relative inline-block text-left">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === url._id ? null : url._id)} 
                          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all duration-200"
                          title="More Actions"
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {activeMenuId === url._id && (
                          <div className="absolute right-0 mt-1.5 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                            {/* QR Code */}
                            <button 
                              onClick={() => { downloadQr(url.shortCode); setActiveMenuId(null); }} 
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                            >
                              <QrCode size={14} />
                              Download QR Code
                            </button>

                            {/* Public Stats */}
                            <a 
                              href={`/stats/${url.shortCode}`} 
                              target="_blank"
                              rel="noreferrer"
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                              onClick={() => setActiveMenuId(null)}
                            >
                              <Globe size={14} />
                              Public Stats Page
                            </a>

                            {/* Health Check */}
                            <button 
                              onClick={() => { onHealth(url); setActiveMenuId(null); }} 
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Activity size={14} />
                              Check Link Health
                            </button>

                            {/* Divider */}
                            <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                            {/* Delete */}
                            <button 
                              onClick={() => { if (window.confirm('Delete this link?')) onDelete(url._id); setActiveMenuId(null); }} 
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                            >
                              <Trash2 size={14} />
                              Delete Link
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
