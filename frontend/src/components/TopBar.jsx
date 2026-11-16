import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TopBar() {
  const { user, logout } = useAuth();
  return (
    <nav className="sticky top-0 z-40 bg-slate-900/70 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-brand-500/30">F</div>
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">FunConnect</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-300 truncate max-w-[100px]">@{user?.username}</span>
          <button onClick={logout} className="text-slate-400 hover:text-white transition active:scale-90" title="Log out">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
