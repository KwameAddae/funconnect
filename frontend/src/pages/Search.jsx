import { useState } from 'react';
import api from '../api/client';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import PostCard from '../components/PostCard';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Search() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (q.trim().length < 2) return setError('Type at least 2 characters');
    setError(''); setLoading(true);
    try {
      const res = await api.get(`/api/search?q=${encodeURIComponent(q)}`);
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      <TopBar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSearch} className="relative mb-6">
          <SearchIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type="text" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search users or posts..."
            className="w-full bg-slate-900 border border-slate-800 rounded-full pl-12 pr-4 py-3 text-white focus:outline-none focus:border-brand-500"
          />
        </form>
        {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>
        ) : results && (
          <div className="space-y-6">
            {results.users.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">Users</h3>
                <div className="space-y-2">
                  {results.users.map((u) => (
                    <Link key={u.id} to={`/profile/${u.id}`} className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand-500 font-bold">
                        {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full rounded-full object-cover" /> : u.username[0].toUpperCase()}
                      </div>
                      <div><p className="font-medium text-white">@{u.username}</p>{u.bio && <p className="text-xs text-slate-500 truncate">{u.bio}</p>}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {results.posts.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">Posts</h3>
                {results.posts.map((post) => <PostCard key={post.id} post={post} currentUser={null} onDelete={() => {}} />)}
              </div>
            )}
            {results.users.length === 0 && results.posts.length === 0 && (
              <p className="text-center text-slate-500 py-10">No results found.</p>
            )}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
