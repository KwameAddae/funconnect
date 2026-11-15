import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import ComposeBox from '../components/ComposeBox';
import PostCard from '../components/PostCard';
import { LogOut, Loader2 } from 'lucide-react';

export default function Feed() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We use the personalized feed endpoint
    api.get('/api/posts/feed/following')
      .then((res) => setPosts(res.data.posts))
      .catch((err) => console.error('Failed to load feed', err))
      .finally(() => setLoading(false));
  }, []);

  const handlePostCreated = (newPost) => {
    // Optimistically add the new post to the top of the list
    // We need to add the author info because the POST response doesn't include it
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
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-white text-sm">F</div>
            <span className="font-bold text-lg tracking-tight">FunConnect</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-300">@{user?.username}</span>
            <button onClick={logout} className="text-slate-400 hover:text-white transition" title="Log out">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <ComposeBox onPosted={handlePostCreated} />

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
            <h3 className="text-lg font-medium text-white mb-2">It's quiet here...</h3>
            <p className="text-slate-400 text-sm">Follow people or create your first post to get started.</p>
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                currentUser={user} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
