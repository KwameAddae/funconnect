import { useState, useRef } from 'react';
import api from '../api/client';
import { Image as ImageIcon, X } from 'lucide-react';

export default function ComposeBox({ onPosted }) {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      return setError('Image must be under 5MB');
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
  };

  const clearImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imageFile) return;
    setLoading(true);
    setError('');

    try {
      let image_url = '';

      // 1. Upload image first if present
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await api.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        image_url = uploadRes.data.url;
      }

      // 2. Create the post
      const res = await api.post('/api/posts', { content, image_url });
      
      // 3. Reset and notify parent
      setContent('');
      clearImage();
      onPosted(res.data.post);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
      {error && <div className="bg-red-500/10 text-red-400 p-2 rounded-lg mb-3 text-sm">{error}</div>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="w-full bg-transparent text-white placeholder-slate-500 resize-none focus:outline-none text-lg min-h-[80px]"
          maxLength={2000}
        />
        
        {previewUrl && (
          <div className="relative inline-block mt-2 mb-3">
            <img src={previewUrl} alt="preview" className="h-32 rounded-lg object-cover border border-slate-700" />
            <button type="button" onClick={clearImage} className="absolute -top-2 -right-2 bg-slate-800 text-white p-1 rounded-full hover:bg-red-500 transition">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
          <div className="flex items-center gap-3">
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageSelect} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-brand-500 hover:bg-brand-500/10 p-2 rounded-full transition">
              <ImageIcon className="w-5 h-5" />
            </button>
            <span className="text-xs text-slate-500">{content.length}/2000</span>
          </div>
          <button 
            type="submit" 
            disabled={loading || (!content.trim() && !imageFile)}
            className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-1.5 rounded-full font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
