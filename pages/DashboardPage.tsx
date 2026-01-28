
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { firebase } from '../firebase';
import { BookListing, UserProfile } from '../types';
import BookCard from '../components/BookCard';
import { PlusCircle, Package, Heart, Settings, LayoutGrid, Trash2, Save, Loader2, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../App';
import AdSense from '../components/AdSense';

interface DashboardPageProps {
  user: UserProfile;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'ads' | 'saved' | 'account'>('ads');
  const [listings, setListings] = useState<BookListing[]>([]);
  const [savedListings, setSavedListings] = useState<BookListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteProfileConfirm, setShowDeleteProfileConfirm] = useState(false);
  const [deletingProfile, setDeletingProfile] = useState(false);
  
  const { t, lang } = useTranslation();

  const [name, setName] = useState(user.displayName);
  const [username, setUsername] = useState(user.username || '');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
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
  }, [user.uid]);

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
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto px-4 mt-2 md:mt-4 pb-20">
      <aside className="lg:col-span-1">
        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 shadow-2xl shadow-emerald-900/5 border border-emerald-50">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-xl flex items-center justify-center font-black text-sm md:text-lg text-black overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
              <span className="text-black font-black uppercase">{(name || user.displayName || 'A').charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <p className="font-black text-black leading-tight text-sm md:text-base truncate">{name || 'Anonymous'}</p>
              <p className="text-[8px] text-accent font-black uppercase mt-0.5 truncate">MEMBER</p>
            </div>
          </div>

          <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 md:gap-2 no-scrollbar pb-1 lg:pb-0">
            <button 
              onClick={() => setActiveTab('ads')}
              className={`flex-shrink-0 lg:w-full flex items-center justify-start gap-3 p-3 font-black rounded-xl transition text-[9px] md:text-[11px] uppercase ${activeTab === 'ads' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-emerald-50/50 text-black hover:bg-emerald-100'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5 md:w-4 md:h-4" /> Ads
            </button>
            <button 
              onClick={() => setActiveTab('saved')}
              className={`flex-shrink-0 lg:w-full flex items-center justify-start gap-3 p-3 font-black rounded-xl transition text-[9px] md:text-[11px] uppercase ${activeTab === 'saved' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-emerald-50/50 text-black hover:bg-emerald-100'}`}
            >
              <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 ${activeTab === 'saved' ? 'text-white' : 'text-accent'}`} /> Saved
            </button>
            <button 
              onClick={() => setActiveTab('account')}
              className={`flex-shrink-0 lg:w-full flex items-center justify-start gap-3 p-3 font-black rounded-xl transition text-[9px] md:text-[11px] uppercase ${activeTab === 'account' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-emerald-50/50 text-black hover:bg-emerald-100'}`}
            >
              <Settings className={`w-3.5 h-3.5 md:w-4 md:h-4 ${activeTab === 'account' ? 'text-white' : 'text-accent'}`} /> Profile
            </button>
          </nav>
        </div>
      </aside>

      <main className="lg:col-span-3 space-y-4 md:space-y-6">
        {activeTab === 'ads' && (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#f0fdf4] p-4 md:p-6 rounded-[1.5rem] border border-emerald-100/50 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg md:rounded-xl shadow-sm">
                   <Package className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-serif font-black text-black leading-none">Your Ads</h2>
                  <p className="text-zinc-400 text-[8px] md:text-[9px] font-black uppercase mt-1">{listings.length} Items Live</p>
                </div>
              </div>
              <Link to="/sell" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-zinc-800 transition text-[9px] font-black uppercase shadow-lg shadow-black/10">
                <PlusCircle className="w-3.5 h-3.5" /> New Ad
              </Link>
            </div>
            <div className="bg-orange-50/60 border border-orange-100/50 rounded-xl px-4 py-2 flex items-center gap-3">
               <Info className="w-4 h-4 text-orange-400 flex-shrink-0" />
               <p className={`text-[9px] md:text-[11px] font-bold text-orange-800 leading-relaxed ${lang === 'bn' ? 'font-bn' : ''}`}>{t('deleteReminder')}</p>
            </div>
            {loading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">{[...Array(2)].map((_, i) => (<div key={i} className="bg-white rounded-[1.5rem] h-40 animate-pulse border border-emerald-50"></div>))}</div> : listings.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">{listings.map(book => (<BookCard key={book.id} book={book} showActions onDelete={(id) => setDeletingId(id)} onEdit={(id) => navigate(`/edit/${id}`)} />))}</div>) : (<div className="text-center py-16 bg-white rounded-[2rem] border-2 border-dashed border-emerald-100 shadow-sm px-6"><h3 className="text-lg font-black text-black mb-2">Nothing listed</h3><Link to="/sell" className="bg-accent text-white px-8 py-4 rounded-xl font-black uppercase text-[9px]">Post New Ad</Link></div>)}
          </>
        )}

        {activeTab === 'saved' && (
          <>
            <div className="flex items-center gap-3 bg-white p-4 rounded-[1.5rem] border border-emerald-50 shadow-sm mb-4">
              <div className="p-2 bg-red-50 rounded-lg"><Heart className="w-4 h-4 text-red-500 fill-current" /></div>
              <div><h2 className="text-lg font-black text-black leading-none">Bookmarked</h2><p className="text-zinc-400 text-[8px] font-black uppercase mt-1">{savedListings.length} Saved Books</p></div>
            </div>
            {savedListings.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">{savedListings.map(book => (<BookCard key={book.id} book={book} />))}</div>) : (<div className="text-center py-16 bg-white rounded-[2rem] border border-emerald-50 shadow-sm px-6"><h3 className="text-lg font-black text-black">No saved items</h3><Link to="/" className="mt-8 inline-block bg-accent text-white px-8 py-3 rounded-xl font-black uppercase text-[9px]">Browse Feed</Link></div>)}
          </>
        )}

        {activeTab === 'account' && (
          <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-2xl shadow-emerald-900/5 border border-emerald-50">
            <h2 className="text-2xl font-serif font-black text-black mb-6">Profile Settings</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
              <div className="space-y-6">
                <div><label className="block text-[9px] font-black text-black uppercase mb-2 ml-1">{t('fullName')}</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-[#f0fdf4] border border-emerald-100/50 rounded-xl outline-none font-black text-black text-sm" /></div>
                <div><label className="block text-[9px] font-black text-black uppercase mb-2 ml-1">{t('userName')}</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-emerald-300 text-sm">@</span><input type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))} className="w-full pl-8 pr-4 py-3 bg-[#f0fdf4] border border-emerald-100/50 rounded-xl outline-none font-black text-black text-sm" /></div></div>
                <div><label className="block text-[9px] font-black text-black uppercase mb-2 ml-1">{t('emailAddress')}</label><input type="text" value={user.email} disabled className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl font-black text-zinc-400 opacity-60 text-sm cursor-not-allowed" /></div>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <button type="submit" disabled={updating} className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-xl font-black text-[9px] uppercase flex items-center justify-center gap-3 shadow-lg disabled:opacity-50">{updating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}{t('saveProfile')}</button>
                {updateSuccess && <div className="flex items-center gap-2 text-emerald-600 font-black text-[9px] uppercase"><CheckCircle2 className="w-4 h-4" /> Saved!</div>}
              </div>
              <div className="pt-6 border-t border-emerald-50"><button type="button" onClick={() => setShowDeleteProfileConfirm(true)} className="text-red-600 font-black text-[9px] uppercase flex items-center gap-2 hover:text-red-700 transition"><Trash2 className="w-3 h-3" />{t('deleteProfile')}</button></div>
            </form>
          </div>
        )}

        {/* Dashboard Bottom Ad */}
        <AdSense slot="9988776655" />
      </main>

      {/* Modals... */}
      {deletingId && (activeTab === 'ads') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setDeletingId(null)}></div>
          <div className="relative bg-white rounded-[1.5rem] shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in">
             <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500" /></div>
             <h3 className="text-lg font-black text-black mb-3">Delete this ad?</h3>
             <div className="space-y-3"><button onClick={confirmDelete} className="w-full bg-red-600 text-white py-3 rounded-xl font-black uppercase text-[9px]">Confirm Delete</button><button onClick={() => setDeletingId(null)} className="w-full bg-emerald-50 text-black py-3 rounded-xl font-black uppercase text-[9px]">Cancel</button></div>
          </div>
        </div>
      )}
      {showDeleteProfileConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowDeleteProfileConfirm(false)}></div>
          <div className="relative bg-white rounded-[1.5rem] shadow-2xl w-full max-w-md p-6 md:p-8 text-center animate-in zoom-in">
             <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-6 h-6 text-red-500" /></div>
             <h3 className="text-xl font-black text-black mb-2">{t('confirmDeleteProfile')}</h3>
             <p className="text-zinc-500 font-bold text-[11px] mb-6">{t('deleteProfileWarning')}</p>
             <div className="flex flex-col gap-3"><button onClick={handleDeleteProfile} disabled={deletingProfile} className="w-full bg-red-600 text-white py-4 rounded-xl font-black text-[9px] uppercase flex items-center justify-center gap-2">{deletingProfile ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}Confirm Deletion</button><button onClick={() => setShowDeleteProfileConfirm(false)} className="w-full bg-zinc-100 text-black py-4 rounded-xl font-black text-[9px] uppercase">Go Back</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
