import { API_BASE } from '../api/client';
import { MessageCircle, Heart, Trash2, Share } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function PostCard({ post, currentUser, onDelete }) {
  const isAuthor = currentUser?.id === post.author_id;
  
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 hover:border-slate-700 transition duration-200 w-full max-w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand-500 font-bold overflow-hidden shrink-0">
            {post.author_avatar ? (
              <img src={post.author_avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              post.author_username[0].toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-white truncate">@{post.author_username}</p>
            <p className="text-xs text-slate-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        {isAuthor && (
          <button onClick={() => onDelete(post.id)} className="text-slate-500 hover:text-red-400 transition p-1 shrink-0">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content - Inline style is the bulletproof fix for long words/URLs */}
      <div 
        className="text-slate-200 whitespace-pre-wrap mb-3 leading-relaxed w-full"
        style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
      >
        {post.content}
      </div>

      {/* Image */}
      {post.image_url && (
        <div className="rounded-xl overflow-hidden mb-3 border border-slate-800 bg-slate-950 w-full">
          <img 
            src={post.image_url.startsWith('http') ? post.image_url : `${API_BASE}${post.image_url}`} 
            alt="post attachment" 
            className="w-full h-auto max-h-[500px] object-contain"
            loading="lazy"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-3 border-t border-slate-800/50 mt-2">
        <button className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition text-sm group">
          <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" /> 0
        </button>
        <button className="flex items-center gap-1.5 text-slate-400 hover:text-brand-400 transition text-sm group">
          <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" /> 0
        </button>
        <button className="flex items-center gap-1.5 text-slate-400 hover:text-green-400 transition text-sm group">
          <Share className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}
