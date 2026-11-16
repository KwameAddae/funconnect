import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import ComposeBox from '../components/ComposeBox';
import PostCard from '../components/PostCard';
import PostSkeleton from '../components/PostSkeleton';
import { LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Feed() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/posts/feed/following')
      .then((res) => setPosts(res.data.posts))
      .catch((err) => console.error('Failed to load feed', err))
      .finally(() => setLoading(false));
  }, []);

  const handlePostCreated = (newPost) => {
    const postWithAuthor = {
      ...newPost,
      author_id: user.id,
      author_username: user.username,
      author_avatar: user.avatar_url
    };
    setPosts([postWithAuthor, ...posts]);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/api/posts/${postId}`);
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Glassmorphic Navbar */}
      <motion.nav 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-10 bg-slate-900/70 backdrop-blur-xl border-b border-slate-800/80"
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-brand-500/30">F</div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">FunConnect</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-300">@{user?.username}</span>
            <button onClick={logout} className="text-slate-400 hover:text-white transition active:scale-90" title="Log out">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <ComposeBox onPosted={handlePostCreated} />
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : posts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed"
          >
            <h3 className="text-lg font-medium text-white mb-2">It's quiet here...</h3>
            <p className="text-slate-400 text-sm">Follow people or create your first post to get started.</p>
          </motion.div>
        ) : (
          <motion.div layout>
            <AnimatePresence mode="popLayout">
              {posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  currentUser={user} 
                  onDelete={handleDelete} 
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}
