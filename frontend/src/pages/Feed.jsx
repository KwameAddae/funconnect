import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Feed() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="font-bold text-lg">FunConnect</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">@{user?.username}</span>
            <button onClick={logout} className="text-slate-400 hover:text-white transition">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username}!</h1>
        <p className="text-slate-400">You are successfully logged in. The feed is coming in the next step.</p>
      </div>
    </div>
  );
}
