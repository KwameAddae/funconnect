import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { Loader2, UserPlus, UserMinus, MessageCircle } from 'lucide-react';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const isSelf = currentUser?.id === parseInt(id);

  useEffect(() => {
    setLoading(true);
    const fetchProfile = async () => {
      try {
        // Fetch user details from search or feed
        const feedRes = await api.get('/api/posts/feed');
        const userPosts = feedRes.data.posts.filter((p) => p.author_id === parseInt(id));
        setPosts(userPosts);

        const username = userPosts[0]?.author_username || 'user';
        const avatar = userPosts[0]?.author_avatar || '';
        setProfile({ id: parseInt(id), username, avatar });

        if (currentUser && !isSelf) {
          const followRes = await api.get(`/api/users/${id}/followers`);
          setFollowing(followRes.data.followers.some((f) => f.id === currentUser.id));
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [id, currentUser, isSelf]);

  const handleFollow = async () => {
    try {
      if (following) await api.delete(`/api/users/${id}/follow`);
      else await api.post(`/api/users/${id}/follow`);
      setFollowing(!following);
    } catch (err) { alert('Action failed'); }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex justify-center pt-20"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      <TopBar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-brand-500 font-bold text-2xl overflow-hidden">
            {profile?.avatar ? <img src={profile.avatar} alt="" className="w-full h-full object-cover" /> : profile?.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white truncate">@{profile?.username}</h1>
            <p className="text-sm text-slate-500">{posts.length} posts</p>
            
            <div className="flex gap-2 mt-3">
              {!isSelf && currentUser && (
                <>
                  <button onClick={handleFollow} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition ${following ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-brand-600 text-white hover:bg-brand-700'}`}>
                    {following ? <><UserMinus className="w-4 h-4" /> Following</> : <><UserPlus className="w-4 h-4" /> Follow</>}
                  </button>
                  <button onClick={() => navigate(`/chat?user=${id}`)} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-slate-800 text-white hover:bg-slate-700 transition">
                    <MessageCircle className="w-4 h-4" /> Message
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-slate-500 py-10">No posts yet.</p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} currentUser={currentUser} onDelete={() => {}} />)
        )}
      </main>
      <BottomNav />
    </div>
  );
}
