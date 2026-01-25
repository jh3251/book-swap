
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { firebase } from '../firebase';
import { BookListing, UserProfile } from '../types';
import BookCard from '../components/BookCard';
import { PlusCircle, Package, Heart, Settings, LayoutGrid, Trash2, X, Save, Loader2, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../App';

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

  // Account settings state - photo related state removed
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
        
        // Fetch saved books
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
      console.error("Delete failed:", e);
      setListings(previousListings);
      alert("Failed to delete the listing. Please try again.");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      // Called with undefined for photoFile to remove/not update photo
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
      if (err.code === 'auth/requires-recent-login') {
        alert(lang === 'bn' 
          ? 'এই অ্যাকশনটির জন্য সাম্প্রতিক লগইন প্রয়োজন। অনুগ্রহ করে লগআউট করে আবার লগইন করুন এবং চেষ্টা করুন।' 
          : 'This sensitive action requires a recent login. Please log out, log back in, and try again.');
      } else {
        alert(lang === 'bn' ? 'অ্যাকাউন্ট ডিলিট করতে সমস্যা হয়েছে।' : 'Failed to delete account.');
      }
    } finally {
      setDeletingProfile(false);
      setShowDeleteProfileConfirm(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4 mt-4 md:mt-8 pb-20">
      {/* Sidebar Navigation */}
      <aside className="lg:col-span-1">
        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-emerald-900/5 border border-emerald-50">
          <div className="flex items-center gap-4 mb-8 md:mb-10">
            {/* Displaying only initials for simplicity */}
            <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-100 rounded-2xl flex items-center justify-center font-black text-base md:text-xl text-black overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
              <span className="text-black font-black uppercase">{(name || user.displayName || 'A').charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <p className="font-black text-black leading-tight text-base md:text-lg truncate">
                {name || 'Anonymous'}
              </p>
              <p className="text-[10px] text-accent font-black uppercase tracking-[0.2em] mt-0.5 truncate">
                MEMBER
              </p>
            </div>
          </div>

          <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 md:gap-3 no-scrollbar pb-2 lg:pb-0">
            <button 
              onClick={() => setActiveTab('ads')}
              className={`flex-shrink-0 lg:w-full flex items-center justify-start gap-4 p-4 font-black rounded-2xl transition text-[10px] md:text-xs uppercase tracking-[0.15em] ${
                activeTab === 'ads' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-emerald-50/50 text-black hover:bg-emerald-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" /> Ads
            </button>
            <button 
              onClick={() => setActiveTab('saved')}
              className={`flex-shrink-0 lg:w-full flex items-center justify-start gap-4 p-4 font-black rounded-2xl transition text-[10px] md:text-xs uppercase tracking-[0.15em] ${
                activeTab === 'saved' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-emerald-50/50 text-black hover:bg-emerald-100'
              }`}
            >
              <Heart className={`w-4 h-4 md:w-5 md:h-5 ${activeTab === 'saved' ? 'text-white' : 'text-accent'}`} /> Saved
            </button>
            <button 
              onClick={() => setActiveTab('account')}
              className={`flex-shrink-0 lg:w-full flex items-center justify-start gap-4 p-4 font-black rounded-2xl transition text-[10px] md:text-xs uppercase tracking-[0.15em] ${
                activeTab === 'account' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-emerald-50/50 text-black hover:bg-emerald-100'
              }`}
            >
              <Settings className={`w-4 h-4 md:w-5 md:h-5 ${activeTab === 'account' ? 'text-white' : 'text-accent'}`} /> Profile
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:col-span-3 space-y-6 md:space-y-8">
        {activeTab === 'ads' && (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#f0fdf4] p-6 md:p-8 rounded-[2rem] border border-emerald-100/50 gap-6">
              <div className="flex items-center gap-4 md:gap-5">
                <div className="p-3 bg-white rounded-xl md:rounded-2xl shadow-sm">
                   <Package className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-serif font-black text-black leading-none">Your Ads</h2>
                  <p className="text-zinc-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-1.5">{listings.length} Items Live</p>
                </div>
              </div>
              <Link to="/sell" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-2xl hover:bg-zinc-800 transition text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10">
                <PlusCircle className="w-4 h-4" /> New Ad
              </Link>
            </div>

            {/* Deletion Reminder Text */}
            <div className="bg-orange-50/60 border border-orange-100/50 rounded-2xl px-6 py-4 flex items-center gap-4 animate-in slide-in-from-top-2 duration-500">
               <Info className="w-5 h-5 text-orange-400 flex-shrink-0" />
               <p className={`text-[11px] md:text-[13px] font-bold text-orange-800 leading-relaxed ${lang === 'bn' ? 'font-bn' : ''}`}>
                 {t('deleteReminder')}
               </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[2rem] md:rounded-[2.5rem] h-64 md:h-80 animate-pulse border border-emerald-50 shadow-sm"></div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {listings.map(book => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    showActions 
                    onDelete={handleDeleteClick}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 md:py-32 bg-white rounded-[2.5rem] md:rounded-[3rem] border-2 border-dashed border-emerald-100 shadow-sm px-6">
                <div className="w-20 h-20 bg-[#f0fdf4] rounded-full flex items-center justify-center mx-auto mb-8 text-accent">
                   <Package className="w-10 h-10" />
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-black text-black mb-2">Nothing listed</h3>
                <p className="text-zinc-400 mb-10 font-bold uppercase tracking-widest text-[10px]">Empty shelf. Start selling today.</p>
                <Link to="/sell" className="bg-accent text-white px-10 md:px-12 py-5 rounded-2xl font-black hover:bg-accent-hover transition inline-block uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-accent/20">
                  Post New Ad
                </Link>
              </div>
            )}
          </>
        )}

        {activeTab === 'saved' && (
          <>
            <div className="flex items-center gap-4 md:gap-5 bg-white p-6 md:p-8 rounded-[2rem] border border-emerald-50 shadow-sm mb-6 md:mb-8">
              <div className="p-3 bg-red-50 rounded-xl md:rounded-2xl shadow-sm">
                 <Heart className="w-5 h-5 md:w-6 md:h-6 text-red-500 fill-current" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-serif font-black text-black leading-none">Bookmarked</h2>
                <p className="text-zinc-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-1.5">{savedListings.length} Saved Books</p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[2rem] md:rounded-[2.5rem] h-64 md:h-80 animate-pulse border border-emerald-50 shadow-sm"></div>
                ))}
              </div>
            ) : savedListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {savedListings.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 md:py-32 bg-white rounded-[2.5rem] md:rounded-[3rem] border border-emerald-50 shadow-sm px-6">
                <Heart className="w-12 h-12 md:w-16 md:h-16 text-emerald-100 mx-auto mb-6" />
                <h3 className="text-xl md:text-2xl font-serif font-black text-black">No saved items</h3>
                <p className="text-zinc-400 mt-2 font-bold uppercase tracking-widest text-[10px]">Items you save will appear here</p>
                <Link to="/" className="mt-10 inline-block bg-accent text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px]">Browse Feed</Link>
              </div>
            )}
          </>
        )}

        {activeTab === 'account' && (
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-emerald-900/5 border border-emerald-50 animate-in fade-in duration-500">
            <h2 className="text-3xl md:text-4xl font-serif font-black text-black mb-8 md:mb-12">Profile Settings</h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-10 md:space-y-12 max-w-xl">
              <div className="space-y-8 md:space-y-10">
                <div>
                  <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-3 ml-1">
                    {t('fullName')}
                  </label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 md:px-8 py-4 md:py-5 bg-[#f0fdf4] border border-emerald-100/50 rounded-2xl focus:ring-4 focus:ring-accent/5 outline-none font-black text-black text-base md:text-lg transition-all"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-3 ml-1">
                    {t('userName')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-emerald-300 text-lg">@</span>
                    <input 
                      type="text" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      className="w-full pl-12 md:pl-14 pr-6 md:pr-8 py-4 md:py-5 bg-[#f0fdf4] border border-emerald-100/50 rounded-2xl focus:ring-4 focus:ring-accent/5 outline-none font-black text-black text-base md:text-lg transition-all"
                      placeholder="studentname"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-3 ml-1">
                    {t('emailAddress')}
                  </label>
                  <input 
                    type="text" 
                    value={user.email} 
                    disabled
                    className="w-full px-6 md:px-8 py-4 md:py-5 bg-zinc-50 border border-zinc-100 rounded-2xl font-black text-zinc-400 cursor-not-allowed opacity-60 text-base md:text-lg"
                  />
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
                <button 
                  type="submit" 
                  disabled={updating}
                  className="w-full sm:w-auto bg-black text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-xl shadow-black/20 hover:bg-zinc-800 transition disabled:opacity-50"
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {t('saveProfile')}
                </button>
                
                {updateSuccess && (
                  <div className="flex items-center gap-3 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] animate-in fade-in slide-in-from-left-4">
                    <CheckCircle2 className="w-5 h-5" /> All changes saved!
                  </div>
                )}
              </div>

              <div className="pt-10 md:pt-14 border-t border-emerald-50">
                <button 
                  type="button" 
                  onClick={() => setShowDeleteProfileConfirm(true)}
                  className="text-red-600 hover:text-red-700 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  {t('deleteProfile')}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal for Listings */}
      {deletingId && (activeTab === 'ads') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setDeletingId(null)}
          ></div>
          <div className="relative bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl w-full max-w-sm p-8 md:p-10 text-center animate-in zoom-in duration-300">
             <button 
              onClick={() => setDeletingId(null)}
              className="absolute top-6 right-6 p-2 text-zinc-300 hover:text-black transition"
             >
               <X className="w-6 h-6" />
             </button>

             <div className="w-16 h-16 md:w-20 md:h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 border-4 border-red-100">
                <Trash2 className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
             </div>

             <h3 className="text-xl md:text-2xl font-serif font-black text-black mb-3">Delete this ad?</h3>
             <p className="text-zinc-500 font-medium text-xs md:text-sm leading-relaxed mb-8 px-2">
               This listing will be permanently removed.
             </p>

             <div className="space-y-4">
               <button 
                onClick={confirmDelete}
                className="w-full bg-red-600 text-white py-4 md:py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 hover:bg-red-700 transition"
               >
                 Confirm Delete
               </button>
               <button 
                onClick={() => setDeletingId(null)}
                className="w-full bg-emerald-50 text-black py-4 md:py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-100 transition border border-emerald-100"
               >
                 Cancel
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteProfileConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowDeleteProfileConfirm(false)}
          ></div>
          <div className="relative bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 md:p-12 text-center animate-in zoom-in duration-300">
             <button 
              onClick={() => setShowDeleteProfileConfirm(false)}
              className="absolute top-6 right-6 p-2 text-zinc-300 hover:text-black transition"
             >
               <X className="w-6 h-6" />
             </button>

             <div className="w-16 h-16 md:w-20 md:h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 border-4 border-red-100">
                <AlertTriangle className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
             </div>

             <h3 className="text-2xl md:text-3xl font-serif font-black text-black mb-4">{t('confirmDeleteProfile')}</h3>
             <p className="text-zinc-500 font-bold text-[13px] md:text-sm leading-relaxed mb-10 px-4">
               {t('deleteProfileWarning')}
             </p>

             <div className="flex flex-col gap-4">
               <button 
                onClick={handleDeleteProfile}
                disabled={deletingProfile}
                className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 hover:bg-red-700 transition flex items-center justify-center gap-3"
               >
                 {deletingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                 {lang === 'bn' ? 'স্থায়ীভাবে ডিলিট করুন' : 'Confirm Permanent Deletion'}
               </button>
               <button 
                onClick={() => setShowDeleteProfileConfirm(false)}
                className="w-full bg-zinc-100 text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-200 transition"
               >
                 {lang === 'bn' ? 'ফিরে যান' : 'Go Back'}
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
