import { Link } from 'react-router-dom';
import { Zap, Users, MessageCircle, Image as ImageIcon } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center font-bold text-white">
            F
          </div>
          <span className="font-bold text-xl tracking-tight">FunConnect</span>
        </div>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm text-slate-300 hover:text-white transition"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm bg-brand-600 hover:bg-brand-700 rounded-lg font-medium transition"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          The social space <br />
          that actually <span className="text-brand-500">connects</span>.
        </h1>
        <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
          Real people, real conversations, no algorithm.
          Fast, private, and built for the way you actually want to talk.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="px-8 py-3 bg-brand-600 hover:bg-brand-700 rounded-lg font-semibold transition"
          >
            Join FunConnect
          </Link>
          <a
            href="#features"
            className="px-8 py-3 border border-slate-700 hover:border-slate-500 rounded-lg font-semibold transition"
          >
            Learn more
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { icon: Zap, title: 'Real-time everything', desc: 'Messages, presence, and updates land instantly. No refresh, no lag.' },
          { icon: Users, title: 'A real community', desc: 'Follow people who matter. See only what you actually care about.' },
          { icon: MessageCircle, title: 'Chat that works', desc: 'Threaded conversations, typed indicators, and message history that persists.' },
          { icon: ImageIcon, title: 'Photos, done right', desc: 'Post images that look sharp, load fast, and don\'t disappear.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
            <Icon className="w-8 h-8 text-brand-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} FunConnect. Built for real connections.
      </footer>
    </div>
  );
}
