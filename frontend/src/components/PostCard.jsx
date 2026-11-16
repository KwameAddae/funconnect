import { useState } from 'react';
import { API_BASE } from '../api/client';
import { MessageCircle, Heart, Trash2, Share } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function PostCard({ post, currentUser, onDelete }) {
  const isAuthor = currentUser?.id === post.author_id;
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 mb-4 hover:border-slate-700 transition-colors duration-300 w-full max-w-full shadow-lg shadow-black/20"
    >
      <div className="flex items-start justify-between mb-3">
        <Link to={`/profile/${post.author_id}`} className="flex items-center gap-3 group min-w-0">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand-500 font-bold overflow-hidden shrink-0 group-hover:ring-2 ring-brand-500 transition-all">
            {post.author_avatar ? (
              <img src={post.author_avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              post.author_username[0].toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-white truncate group-hover:text-brand-400 transition-colors">@{post.author_username}</p>
            <p className="text-xs text-slate-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </Link>
        {isAuthor && (
          <button onClick={() => onDelete(post.id)} className="text-slate-500 hover:text-red-400 transition p-1 shrink-0">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="text-slate-200 whitespace-pre-wrap mb-3 leading-relaxed w-full" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
        {post.content}
      </div>

      {post.image_url && (
        <div className="rounded-xl overflow-hidden mb-3 border border-slate-800 bg-slate-950 w-full relative min-h-[200px]">
          {!imgLoaded && <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-slate-800 text-slate-600 text-sm">Loading image...</div>}
          <img 
            src={post.image_url.startsWith('http') ? post.image_url : `${API_BASE}${post.image_url}`} 
            alt="post attachment" onLoad={() => setImgLoaded(true)}
            className={`w-full h-auto max-h-[500px] object-contain transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} loading="lazy"
          />
        </div>
      )}

      <div className="flex items-center gap-6 pt-3 border-t border-slate-800/50 mt-2">
        <button className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition text-sm group active:scale-95">
          <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" /> 0
        </button>
        <button className="flex items-center gap-1.5 text-slate-400 hover:text-brand-400 transition text-sm group active:scale-95">
          <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" /> 0
        </button>
        <button className="flex items-center gap-1.5 text-slate-400 hover:text-green-400 transition text-sm group active:scale-95">
          <Share className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
