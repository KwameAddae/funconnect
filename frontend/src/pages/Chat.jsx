import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api, { API_BASE } from '../api/client';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { Send, Loader2 } from 'lucide-react';

export default function Chat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    api.get('/api/messages/conversations').then((res) => setConversations(res.data.conversations)).finally(() => setLoading(false));
    const token = localStorage.getItem('funconnect_token');
    const s = io(API_BASE, { auth: { token } });
    s.on('message:new', (msg) => {
      if (activeChat && (msg.sender_id === activeChat.id || msg.sender_id === user.id)) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    setSocket(s);
    return () => s.disconnect();
  }, [activeChat?.id]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const openChat = async (other) => {
    setActiveChat(other);
    const res = await api.get(`/api/messages/${other.id}`);
    setMessages(res.data.messages);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket || !activeChat) return;
    socket.emit('message:send', { to: activeChat.id, content: input });
    setInput('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      <TopBar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        {!activeChat ? (
          <div>
            <h2 className="text-lg font-bold mb-4">Messages</h2>
            {loading ? <Loader2 className="w-6 h-6 text-brand-500 animate-spin mx-auto" /> :
              conversations.length === 0 ? <p className="text-slate-500 text-center py-10">No conversations yet.</p> :
              conversations.map((c) => (
                <button key={c.other_id} onClick={() => openChat({ id: c.other_id, username: c.other_username })}
                  className="w-full flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl mb-2 hover:border-slate-700 transition text-left">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand-500 font-bold">{c.other_username[0].toUpperCase()}</div>
                  <div className="flex-1 min-w-0"><p className="font-medium text-white">@{c.other_username}</p><p className="text-xs text-slate-500 truncate">{c.last_content}</p></div>
                  {c.unread > 0 && <span className="bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full">{c.unread}</span>}
                </button>
              ))
            }
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
              <button onClick={() => setActiveChat(null)} className="text-brand-500 text-sm">← Back</button>
              <p className="font-semibold">@{activeChat.username}</p>
            </div>
            <div className="space-y-2 mb-4 max-h-[60vh] overflow-y-auto">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${m.sender_id === user.id ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-100'}`}>{m.content}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 text-white focus:outline-none focus:border-brand-500" />
              <button type="submit" className="bg-brand-600 hover:bg-brand-700 p-3 rounded-full text-white transition"><Send className="w-4 h-4" /></button>
            </form>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
