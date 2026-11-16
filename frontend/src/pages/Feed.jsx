import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import ComposeBox from '../components/ComposeBox';
import PostCard from '../components/PostCard';
import PostSkeleton from '../components/PostSkeleton';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/posts/feed/following')
      .then((res) => setPosts(res.data.posts))
      .catch((err) => console.error('Failed to load feed', err))
      .finally(() => setLoading(false));
  }, []);

  const handlePostCreated = (newPost) => {
    const postWithAuthor = { ...newPost, author_id: user.id, author_username: user.username, author_avatar: user.avatar_url };
    setPosts([postWithAuthor, ...posts]);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/api/posts/${postId}`);
      setPosts(posts.filter((p) => p.id !== postId));
    } catch { alert('Failed to delete post'); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      <TopBar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ComposeBox onPosted={handlePostCreated} />
        </motion.div>
        {loading ? (
          <div className="space-y-4"><PostSkeleton /><PostSkeleton /><PostSkeleton /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
            <h3 className="text-lg font-medium text-white mb-2">It's quiet here...</h3>
            <p className="text-slate-400 text-sm">Follow people or create your first post to get started.</p>
          </div>
        ) : (
          <motion.div layout>
            <AnimatePresence mode="popLayout">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} currentUser={user} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
