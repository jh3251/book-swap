
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { firebase } from '../firebase';
import { UserProfile, Conversation, ChatMessage } from '../types';
import { Send, ArrowLeft, Loader2, User } from 'lucide-react';
import { useTranslation } from '../App';

interface ChatPageProps {
  user: UserProfile;
}

const ChatPage: React.FC<ChatPageProps> = ({ user }) => {
  const { id: conversationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) return;

    const fetchConv = async () => {
      const data = await firebase.db.getConversationById(conversationId);
      if (data && data.participants.includes(user.uid)) {
        setConversation(data);
      } else {
        navigate('/dashboard');
      }
      setLoading(false);
    };
    fetchConv();

    const unsubscribe = firebase.db.subscribeToMessages(conversationId, (data) => {
      setMessages(data);
    });

    return () => unsubscribe();
  }, [conversationId, user.uid, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId) return;
    
    const msg = newMessage;
    setNewMessage('');
    try {
      await firebase.db.sendMessage(conversationId, user.uid, msg);
    } catch (err) {
      console.error(err);
      setNewMessage(msg);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-40"><Loader2 className="w-10 h-10 animate-spin text-accent" /></div>;
  if (!conversation) return null;

  const otherParticipantId = conversation.participants.find(p => p !== user.uid) || '';
  const otherParticipantName = conversation.participantNames[otherParticipantId];

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
      {/* Header */}
      <div className="bg-white p-4 md:p-6 rounded-t-[2rem] border-x border-t border-emerald-50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-100 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-xl flex items-center justify-center font-black text-accent shadow-sm">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-black leading-none">{otherParticipantName}</h2>
              <Link to={`/books/${conversation.bookId}`} className="text-[10px] text-accent font-black uppercase mt-1 hover:underline flex items-center gap-1">
                {conversation.bookTitle}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto bg-zinc-50/50 p-4 md:p-8 space-y-4 border-x border-emerald-50">
        {messages.map((msg) => {
          const isMine = msg.senderId === user.uid;
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                isMine 
                  ? 'bg-zinc-900 text-white rounded-br-none' 
                  : 'bg-white text-black border border-emerald-50 rounded-bl-none'
              }`}>
                <p className="text-sm md:text-base font-medium leading-relaxed">{msg.text}</p>
                <p className={`text-[9px] font-black uppercase mt-1.5 ${isMine ? 'text-zinc-500' : 'text-zinc-300'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input */}
      <div className="bg-white p-4 md:p-6 rounded-b-[2rem] border-x border-b border-emerald-50 shadow-sm">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={lang === 'bn' ? 'বার্তা লিখুন...' : 'Type a message...'}
            className="flex-grow bg-zinc-50 border border-emerald-50 px-6 py-4 rounded-xl md:rounded-2xl outline-none font-bold text-black focus:ring-4 focus:ring-accent/5 transition-all"
          />
          <button type="submit" className="bg-accent text-white p-4 rounded-xl md:rounded-2xl shadow-lg shadow-accent/20 hover:bg-accent-hover transition active:scale-95">
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
