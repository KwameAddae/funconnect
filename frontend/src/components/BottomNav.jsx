import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageCircle, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const path = location.pathname;

  const links = [
    { to: '/feed', icon: Home, label: 'Feed' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/chat', icon: MessageCircle, label: 'Chat' },
    { to: `/profile/${user?.id}`, icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800/80 pb-safe">
      <div className="max-w-2xl mx-auto flex items-center justify-around py-3">
        {links.map(({ to, icon: Icon, label }) => {
          const active = path === to || (to !== '/feed' && path.startsWith(to));
          return (
            <Link key={to} to={to} className={`flex flex-col items-center gap-1 transition ${active ? 'text-brand-500' : 'text-slate-500 hover:text-slate-300'}`}>
              <Icon className={`w-5 h-5 ${active ? 'fill-brand-500/20' : ''}`} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
