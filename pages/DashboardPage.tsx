
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { firebase } from '../firebase';
import { BookListing, UserProfile, Conversation } from '../types';
import BookCard from '../components/BookCard';
import { PlusCircle, Package, Heart, Settings, LayoutGrid, Trash2, Save, Loader2, CheckCircle2, Info, AlertTriangle, MessageCircle, ChevronRight, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '../App';

interface DashboardPageProps {
  user: UserProfile;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'ads' | 'saved' | 'account' | 'messages'>('ads');
  const [listings, setListings] = useState<BookListing[]>([]);
  const [savedListings, setSavedListings] = useState<BookListing[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteProfileConfirm, setShowDeleteProfileConfirm] = useState(false);
  const [deletingProfile, setDeletingProfile] = useState(false);
  
  const { t, lang } = useTranslation();

  const [name, setName] = useState(user.displayName);
  const [username, setUsername] = useState(user.username || '');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Password Update State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passUpdating, setPassUpdating] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userAds = await firebase.db.getUserListings(user.uid);
        setListings(userAds);
        
        const allListings = await firebase.db.getListings();
        const savedIds = JSON.parse(localStorage.getItem('bk_saved_v1') || '[]');
        setSavedListings(allListings.filter(l => savedIds.includes(l.id)));
      } catch (e) {
        console.error("Error fetching listings", e);
      }
      setLoading(false);
    };
    fetchData();

    const unsubConv = firebase.db.subscribeToConversations(user.uid, (data) => {
      setConversations(data);
    });

    return () => unsubConv();
  }, [user.uid]);

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }, [conversations]);

  const confirmDelete = async () => {
    if (!deletingId) return;
    const idToDelete = deletingId;
    setDeletingId(null); 
    const previousListings = [...listings];
    setListings(listings.filter(l => l.id !== idToDelete));
    try {
      await firebase.db.deleteListing(idToDelete);
    } catch (e) {
      setListings(previousListings);
      alert("Failed to delete the listing.");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await firebase.auth.updateProfile(name, undefined, username);
      await firebase.auth.reloadUser();
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    if (newPassword.length < 6) {
      setPassError(lang === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError(lang === 'bn' ? 'পাসওয়ার্ড মেলেনি।' : 'Passwords do not match.');
      return;
    }

    setPassUpdating(true);
    try {
      await firebase.auth.updatePassword(newPassword);
      setPassSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccess(false), 3000);
    } catch (err: any) {
      setPassError(lang === 'bn' ? 'পাসওয়ার্ড আপডেট করা সম্ভব হয়নি। পুনরায় লগইন করে চেষ্টা করুন।' : 'Failed to update password. Please re-login and try again.');
    } finally {
      setPassUpdating(false);
    }
  };

  const handleDeleteProfile = async () => {
    setDeletingProfile(true);
    try {
      await firebase.auth.deleteAccount();
      navigate('/');
    } catch (err: any) {
      alert("Failed to delete account.");
    } finally {
      setDeletingProfile(false);
      setShowDeleteProfileConfirm(false);
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4 mt-4 md:mt-8 pb-20">
      <aside className="lg:col-span-1">
        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-emerald-900/5 border border-emerald-50">
          <div className="flex items-center gap-4 mb-8 md:mb-10">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-100 rounded-2xl flex items-center justify-center font-black text-base md:text-xl text-black overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
              <span className="text-black font-black uppercase">{(name || user.displayName || 'A').charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <p className="font-black text-black leading-tight text-base md:text-lg truncate">{name || 'Anonymous'}</p>
              <p className="text-[10px] text-accent font-black uppercase mt-0.5 truncate">MEMBER</p>
            </div>
          </div>

          <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 md:gap-3 no-scrollbar pb-2 lg:pb-0">
            <button onClick={() => setActiveTab('ads')} className={`flex-shrink-0 lg:w-full flex items-center justify-start gap-4 p-4 font-black rounded-2xl transition text-[10px] md:text-xs uppercase ${activeTab === 'ads' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-emerald-50/50 text-black hover:bg-emerald-100'}`}>
              <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" /> Ads
            </button>
            <button onClick={() => setActiveTab('messages')} className={`flex-shrink-0 lg:w-full flex items-center justify-start gap-4 p-4 font-black rounded-2xl transition text-[10px] md:text-xs uppercase ${activeTab === 'messages' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-emerald-50/50 text-black hover:bg-emerald-100'}`}>
              <MessageCircle className={`w-4 h-4 md:w-5 md:h-5 ${activeTab === 'messages' ? 'text-white' : 'text-accent'}`} /> Messages
            </button>
            <button onClick={() => setActiveTab('saved')} className={`flex-shrink-0 lg:w-full flex items-center justify-start gap-4 p-4 font-black rounded-2xl transition text-[10px] md:text-xs uppercase ${activeTab === 'saved' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-emerald-50/50 text-black hover:bg-emerald-100'}`}>
              <Heart className={`w-4 h-4 md:w-5 md:h-5 ${activeTab === 'saved' ? 'text-white' : 'text-accent'}`} /> Saved
            </button>
            <button onClick={() => setActiveTab('account')} className={`flex-shrink-0 lg:w-full flex items-center justify-start gap-4 p-4 font-black rounded-2xl transition text-[10px] md:text-xs uppercase ${activeTab === 'account' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-emerald-50/50 text-black hover:bg-emerald-100'}`}>
              <Settings className={`w-4 h-4 md:w-5 md:h-5 ${activeTab === 'account' ? 'text-white' : 'text-accent'}`} /> Profile
            </button>
          </nav>
        </div>
      </aside>

      <main className="lg:col-span-3 space-y-6 md:space-y-8">
        {activeTab === 'ads' && (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#f0fdf4] p-6 md:p-8 rounded-[2rem] border border-emerald-100/50 gap-6">
              <div className="flex items-center gap-4 md:gap-5">
                <div className="p-3 bg-white rounded-xl md:rounded-2xl shadow-sm"><Package className="w-5 h-5 md:w-6 md:h-6 text-accent" /></div>
                <div><h2 className="text-xl md:text-2xl font-serif font-black text-black leading-none">Your Ads</h2><p className="text-zinc-400 text-[9px] md:text-[10px] font-black uppercase mt-1.5">{listings.length} Items Live</p></div>
              </div>
              <Link to="/sell" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-2xl hover:bg-zinc-800 transition text-[10px] font-black uppercase shadow-xl shadow-black/10"><PlusCircle className="w-4 h-4" /> New Ad</Link>
            </div>
            {loading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">{[...Array(2)].map((_, i) => (<div key={i} className="bg-white rounded-[2rem] h-64 animate-pulse border border-emerald-50"></div>))}</div> : listings.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">{listings.map(book => (<BookCard key={book.id} book={book} showActions onDelete={(id) => setDeletingId(id)} onEdit={(id) => navigate(`/edit/${id}`)} />))}</div>) : (<div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-emerald-100 shadow-sm px-6"><h3 className="text-xl font-black text-black mb-2">Nothing listed</h3><Link to="/sell" className="bg-accent text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px]">Post New Ad</Link></div>)}
          </>
        )}

        {activeTab === 'messages' && (
          <>
            <div className="flex items-center gap-4 bg-white p-6 rounded-[2rem] border border-emerald-50 shadow-sm mb-6">
              <div className="p-3 bg-emerald-50 rounded-xl"><MessageCircle className="w-5 h-5 text-accent" /></div>
              <div><h2 className="text-xl font-black text-black leading-none">Chats</h2><p className="text-zinc-400 text-[9px] font-black uppercase mt-1.5">{sortedConversations.length} Active Conversations</p></div>
            </div>
            {sortedConversations.length > 0 ? (
              <div className="space-y-4">
                {sortedConversations.map(conv => {
                  const otherId = conv.participants.find(p => p !== user.uid) || '';
                  const otherName = conv.participantNames[otherId];
                  return (
                    <Link 
                      key={conv.id} 
                      to={`/chat/${conv.id}`}
                      className="flex items-center gap-4 bg-white p-4 md:p-6 rounded-[1.5rem] border border-emerald-50 hover:bg-zinc-50 transition shadow-sm group"
                    >
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-50 rounded-2xl flex items-center justify-center font-black text-accent shadow-sm flex-shrink-0">
                        {conv.bookImageUrl ? <img src={conv.bookImageUrl} className="w-full h-full object-cover rounded-2xl" alt="" /> : <User className="w-6 h-6" />}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-black text-black text-base md:text-lg leading-tight truncate">{otherName}</h3>
                        <p className="text-[10px] md:text-[11px] font-black text-accent uppercase tracking-wider mb-1">{conv.bookTitle}</p>
                        <p className="text-[12px] md:text-sm text-zinc-400 font-medium truncate max-w-md">{conv.lastMessage || 'Start conversation...'}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border border-emerald-50 shadow-sm px-6"><h3 className="text-xl font-black text-black">No messages yet</h3></div>
            )}
          </>
        )}

        {activeTab === 'saved' && (
          <>
            <div className="flex items-center gap-4 bg-white p-6 rounded-[2rem] border border-emerald-50 shadow-sm mb-6">
              <div className="p-3 bg-red-50 rounded-xl"><Heart className="w-5 h-5 text-red-500 fill-current" /></div>
              <div><h2 className="text-xl font-black text-black leading-none">Bookmarked</h2><p className="text-zinc-400 text-[9px] font-black uppercase mt-1.5">{savedListings.length} Saved Books</p></div>
            </div>
            {savedListings.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">{savedListings.map(book => (<BookCard key={book.id} book={book} />))}</div>) : (<div className="text-center py-20 bg-white rounded-[2.5rem] border border-emerald-50 shadow-sm px-6"><h3 className="text-xl font-black text-black">No saved items</h3><Link to="/" className="mt-10 inline-block bg-accent text-white px-10 py-4 rounded-xl font-black uppercase text-[10px]">Browse Feed</Link></div>)}
          </>
        )}

        {activeTab === 'account' && (
          <div className="space-y-8">
            <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-2xl shadow-emerald-900/5 border border-emerald-50">
              <h2 className="text-3xl font-serif font-black text-black mb-8">Profile Settings</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-10 max-w-xl">
                <div className="space-y-8">
                  <div><label className="block text-[10px] font-black text-black uppercase mb-3 ml-1">{t('fullName')}</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-6 py-4 bg-[#f0fdf4] border border-emerald-100/50 rounded-2xl outline-none font-black text-black text-base" /></div>
                  <div><label className="block text-[10px] font-black text-black uppercase mb-3 ml-1">{t('userName')}</label><div className="relative"><span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-emerald-300 text-lg">@</span><input type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))} className="w-full pl-12 pr-6 py-4 bg-[#f0fdf4] border border-emerald-100/50 rounded-2xl outline-none font-black text-black text-base" /></div></div>
                  <div><label className="block text-[10px] font-black text-black uppercase mb-3 ml-1">{t('emailAddress')}</label><input type="text" value={user.email} disabled className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-black text-zinc-400 opacity-60 text-base cursor-not-allowed" /></div>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
                  <button type="submit" disabled={updating} className="w-full sm:w-auto bg-black text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-4 shadow-xl disabled:opacity-50">{updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{t('saveProfile')}</button>
                  {updateSuccess && <div className="flex items-center gap-3 text-emerald-600 font-black text-[10px] uppercase"><CheckCircle2 className="w-5 h-5" /> Saved!</div>}
                </div>
              </form>
            </div>

            {/* Change Password Section */}
            <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-2xl shadow-emerald-900/5 border border-emerald-50">
              <h2 className="text-3xl font-serif font-black text-black mb-8 flex items-center gap-3"><Lock className="w-8 h-8 text-accent" /> Security</h2>
              <form onSubmit={handleUpdatePassword} className="space-y-8 max-w-xl">
                {passError && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[12px] font-black uppercase border border-red-100 flex items-center gap-3"><Info className="w-4 h-4" /> {passError}</div>}
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-black uppercase mb-3 ml-1">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-200 w-5 h-5" />
                      <input 
                        required 
                        type={showPass ? "text" : "password"} 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        className="w-full pl-14 pr-14 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none font-black text-black text-base" 
                        placeholder="............" 
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-200 hover:text-accent p-1 transition-colors">
                        {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-black uppercase mb-3 ml-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-200 w-5 h-5" />
                      <input 
                        required 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        className="w-full pl-14 pr-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none font-black text-black text-base" 
                        placeholder="............" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
                  <button type="submit" disabled={passUpdating} className="w-full sm:w-auto bg-accent text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-4 shadow-xl shadow-accent/20 disabled:opacity-50">
                    {passUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Update Password
                  </button>
                  {passSuccess && <div className="flex items-center gap-3 text-emerald-600 font-black text-[10px] uppercase"><CheckCircle2 className="w-5 h-5" /> Password Updated!</div>}
                </div>
              </form>
            </div>

            <div className="bg-red-50/30 rounded-[2rem] p-6 md:p-10 border border-red-100/50">
              <button type="button" onClick={() => setShowDeleteProfileConfirm(true)} className="text-red-600 font-black text-[10px] uppercase flex items-center gap-3 hover:text-red-700 transition"><Trash2 className="w-4 h-4" />{t('deleteProfile')}</button>
            </div>
          </div>
        )}
      </main>

      {/* Modals... */}
      {deletingId && (activeTab === 'ads') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setDeletingId(null)}></div>
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in">
             <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 className="w-8 h-8 text-red-500" /></div>
             <h3 className="text-xl font-black text-black mb-3">Delete this ad?</h3>
             <div className="space-y-4"><button onClick={confirmDelete} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black uppercase text-[10px]">Confirm Delete</button><button onClick={() => setDeletingId(null)} className="w-full bg-emerald-50 text-black py-4 rounded-2xl font-black uppercase text-[10px]">Cancel</button></div>
          </div>
        </div>
      )}
      {showDeleteProfileConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowDeleteProfileConfirm(false)}></div>
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 md:p-12 text-center animate-in zoom-in">
             <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"><AlertTriangle className="w-8 h-8 text-red-500" /></div>
             <h3 className="text-2xl font-black text-black mb-4">{t('confirmDeleteProfile')}</h3>
             <p className="text-zinc-500 font-bold text-sm mb-10">{t('deleteProfileWarning')}</p>
             <div className="flex flex-col gap-4"><button onClick={handleDeleteProfile} disabled={deletingProfile} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-3">{deletingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}Confirm Deletion</button><button onClick={() => setShowDeleteProfileConfirm(false)} className="w-full bg-zinc-100 text-black py-5 rounded-2xl font-black text-[10px] uppercase">Go Back</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
