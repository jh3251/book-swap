
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { firebase } from '../firebase';
import { BookListing, UserProfile } from '../types';
import { MapPin, Phone, User, Calendar, ChevronLeft, ShieldCheck, Share2, Bookmark, Mail, CheckCircle2, X, Link as LinkIcon, MessageCircle, Facebook } from 'lucide-react';
import { useTranslation } from '../App';
import { DIVISIONS, DISTRICTS, UPAZILAS } from '../constants';

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const [book, setBook] = useState<BookListing | null>(null);
  const [seller, setSeller] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);

  useEffect(() => {
    const unsub = firebase.auth.onAuthStateChanged(setCurrentUser);
    
    const fetchAll = async () => {
      if (!id) return;
      setLoading(true);
      const data = await firebase.db.getListingById(id);
      if (data) {
        setBook(data);
        const userData = await firebase.db.getUserById(data.sellerId);
        setSeller(userData);
        
        // Check if saved
        const savedIds = JSON.parse(localStorage.getItem('bk_saved_v1') || '[]');
        setIsSaved(savedIds.includes(id));
      }
      setLoading(false);
    };
    fetchAll();
    return () => unsub();
  }, [id]);

  const handleSave = () => {
    if (!id) return;
    const savedIds = JSON.parse(localStorage.getItem('bk_saved_v1') || '[]');
    let newList;
    if (savedIds.includes(id)) {
      newList = savedIds.filter((sid: string) => sid !== id);
      setIsSaved(false);
    } else {
      newList = [...savedIds, id];
      setIsSaved(true);
    }
    localStorage.setItem('bk_saved_v1', JSON.stringify(newList));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      alert('Failed to copy link.');
    }
  };

  const shareWhatsApp = () => {
    if (!book) return;
    const text = encodeURIComponent(`Check out this book: ${book.title} for ৳${book.price} on BookSwap! ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleCallClick = (e: React.MouseEvent) => {
    if (!isPhoneRevealed) {
      e.preventDefault();
      setIsPhoneRevealed(true);
    }
  };

  const localizedLocation = useMemo(() => {
    if (!book) return null;
    if (lang !== 'bn') {
      return {
        upazila: book.location.upazilaName,
        district: book.location.districtName,
        division: book.location.divisionName
      };
    }
    
    const upazila = UPAZILAS.find(u => u.id === book.location.upazilaId);
    const district = DISTRICTS.find(d => d.id === book.location.districtId);
    const division = DIVISIONS.find(d => d.id === book.location.divisionId);
    
    return {
      upazila: upazila?.nameBn || book.location.upazilaName,
      district: district?.nameBn || book.location.districtName,
      division: division?.nameBn || book.location.divisionName
    };
  }, [book, lang]);

  if (loading) {
    return (
      <div className="flex flex-col items-center py-32 space-y-4">
        <div className="w-16 h-16 border-4 border-emerald-100 border-t-accent rounded-full animate-spin"></div>
        <p className="font-semibold text-black">Gathering details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-32 space-y-6">
        <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <ChevronLeft className="w-10 h-10 text-emerald-200" />
        </div>
        <h2 className="text-3xl font-bold font-serif text-black">Listing not found</h2>
        <button onClick={() => navigate('/')} className="bg-accent text-white px-10 py-4 rounded-xl font-semibold uppercase tracking-widest text-xs shadow-xl">
          Return to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 relative">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-black hover:text-accent font-semibold transition uppercase tracking-widest text-xs"
        >
          <ChevronLeft className="w-4 h-4 mr-1.5" /> {t('back')}
        </button>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <button 
              onClick={handleSave}
              className={`p-3 rounded-xl transition shadow-sm border ${
                isSaved 
                  ? 'bg-accent border-accent text-white' 
                  : 'bg-white border-emerald-50 text-black hover:bg-emerald-50'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={() => setShowShareModal(true)}
              className="p-3 bg-white border border-emerald-50 rounded-xl text-black hover:bg-emerald-50 transition shadow-sm"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 border border-emerald-50 overflow-hidden">
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-emerald-50/30 flex items-center justify-center">
              <img 
                src={book.imageUrl || `https://picsum.photos/seed/${book.id}/800/600`} 
                alt={book.title}
                className="max-h-full max-w-full object-contain hover:scale-105 transition duration-1000"
              />
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-emerald-50 space-y-6">
            <h2 className="text-2xl font-serif font-bold text-black border-b border-emerald-50 pb-4">{lang === 'bn' ? 'বইটি সম্পর্কে' : 'About this book'}</h2>
            <div className="text-black text-lg leading-relaxed whitespace-pre-wrap font-medium">
              {book.description || (lang === 'bn' ? "বিক্রেতা এই বইটির জন্য কোনো বিস্তারিত বিবরণ প্রদান করেননি। আরও তথ্যের জন্য সরাসরি তাদের সাথে যোগাযোগ করুন।" : "The seller hasn't provided a detailed description for this book. Please contact them directly for more information.")}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-emerald-50 space-y-8 sticky top-24">
            <div>
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em] bg-[#f0fdf4] px-4 py-1.5 rounded-full border border-emerald-100">
                {t(book.subject as any)}
              </span>
              <h1 className={`text-4xl font-serif font-black text-black mt-5 mb-1.5 leading-tight ${lang === 'bn' ? 'font-bn' : ''}`}>{book.title}</h1>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50/50 rounded-full border border-emerald-100/50">
                <span className="text-xs font-bold text-zinc-400">{t('by')}</span>
                <span className="text-xs font-black text-black">
                  {seller?.username ? seller.username : (seller?.displayName || book.sellerName)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between py-8 border-y border-emerald-50">
              <span className="text-5xl font-black text-black">
                {book.condition === 'Donation' ? t('free') : `৳ ${book.price}`}
              </span>
              <span className="px-5 py-2.5 bg-[#f0fdf4] text-accent rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border-2 border-emerald-100">
                {t(book.condition as any)}
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <p className="font-black text-black text-2xl leading-none">{localizedLocation?.upazila}</p>
                  <p className="text-[11px] text-zinc-400 font-black uppercase tracking-widest mt-1">
                    {localizedLocation?.district}, {localizedLocation?.division}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-7 h-7 text-zinc-300" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-1">{lang === 'bn' ? 'বিজ্ঞাপন তৈরির তারিখ' : 'LISTING CREATED'}</p>
                  <p className="text-lg text-black font-black">
                    {new Date(book.createdAt).toLocaleDateString(lang === 'bn' ? 'bn-BD' : undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-4">
              <a 
                href={isPhoneRevealed ? `tel:${book.contactPhone}` : '#'}
                onClick={handleCallClick}
                className={`w-full text-white !text-white py-5 rounded-2xl flex items-center justify-center gap-4 font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition duration-300 transform active:scale-95 ${
                  isPhoneRevealed 
                    ? 'bg-accent hover:bg-accent-hover shadow-accent/30' 
                    : 'bg-[#16a34a] hover:bg-emerald-700 shadow-emerald-500/30 animate-pulse-soft'
                }`}
              >
                <Phone className={`w-5 h-5 !text-white ${!isPhoneRevealed ? 'animate-ring' : ''}`} />
                <span className="transition-all duration-500 !text-white">
                  {isPhoneRevealed ? (
                    <span className="animate-in fade-in slide-in-from-left-2 !text-white">{book.contactPhone}</span>
                  ) : (
                    <span className="!text-white">{book.contactPhone.substring(0, 5)}XXXXXX</span>
                  )}
                </span>
              </a>
              
              <div className="p-6 bg-[#fff7ed] rounded-2xl flex items-center gap-4 border border-orange-100 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-[#ea580c] flex-shrink-0" />
                <p className="text-[11px] text-[#9a3412] font-black uppercase tracking-tight leading-relaxed">
                  {lang === 'bn' ? <>জনসমক্ষে দেখা করুন। পেমেন্ট করার<br/>আগে বই যাচাই করুন।</> : <>MEET IN PUBLIC. INSPECT <br/> BEFORE PAYING.</>}
                </p>
              </div>
            </div>
            
            <div className="pt-8 mt-8 border-t border-emerald-50">
               <h3 className="font-black text-black mb-6 uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                 <User className="w-4 h-4 text-accent" /> {lang === 'bn' ? 'বিক্রেতার তথ্য' : 'SELLER INFORMATION'}
               </h3>
               
               <div className="flex items-center gap-4 bg-white">
                 <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center font-black text-2xl text-white shadow-md flex-shrink-0">
                   {(seller?.displayName || book.sellerName).charAt(0).toUpperCase()}
                 </div>
                 <div>
                   <p className="font-black text-black text-xl leading-none">{seller?.displayName || book.sellerName}</p>
                   <p className="text-[10px] text-accent font-black uppercase tracking-[0.2em] mt-1.5">{lang === 'bn' ? 'সদস্য' : 'MEMBER'}</p>
                 </div>
               </div>
               
               {seller?.email && (
                 <div className="mt-6 flex items-center gap-3 p-4 bg-emerald-50/30 rounded-2xl border border-emerald-50/50">
                   <Mail className="w-4 h-4 text-accent" />
                   <span className="text-xs font-black text-black truncate">{seller.email}</span>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowShareModal(false)}
          ></div>
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-10 animate-in zoom-in duration-300">
             <button 
              onClick={() => setShowShareModal(false)}
              className="absolute top-8 right-8 p-2 text-zinc-300 hover:text-black transition"
             >
               <X className="w-6 h-6" />
             </button>

             <h3 className="text-2xl font-serif font-black text-black mb-8 text-center">{lang === 'bn' ? 'বইটি শেয়ার করুন' : 'Share this Book'}</h3>
             
             <div className="space-y-4">
                <button 
                  onClick={shareWhatsApp}
                  className="w-full flex items-center justify-between p-5 bg-[#25D366]/10 text-[#25D366] rounded-2xl font-black text-xs uppercase tracking-[0.15em] border border-[#25D366]/20 hover:bg-[#25D366]/20 transition"
                >
                  <div className="flex items-center gap-4">
                    <MessageCircle className="w-5 h-5 fill-current" />
                    WhatsApp
                  </div>
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </button>

                <button 
                  onClick={shareFacebook}
                  className="w-full flex items-center justify-between p-5 bg-[#1877F2]/10 text-[#1877F2] rounded-2xl font-black text-xs uppercase tracking-[0.15em] border border-[#1877F2]/20 hover:bg-[#1877F2]/20 transition"
                >
                  <div className="flex items-center gap-4">
                    <Facebook className="w-5 h-5 fill-current" />
                    Facebook
                  </div>
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </button>

                <button 
                  onClick={copyToClipboard}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] border transition ${
                    copySuccess 
                      ? 'bg-emerald-500 text-white border-emerald-600' 
                      : 'bg-zinc-100 text-black border-zinc-200 hover:bg-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {copySuccess ? <CheckCircle2 className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                    {copySuccess ? (lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (lang === 'bn' ? 'লিংক কপি করুন' : 'Copy Link')}
                  </div>
                  {!copySuccess && <ChevronLeft className="w-4 h-4 rotate-180" />}
                </button>
             </div>

             <div className="mt-8 p-4 bg-emerald-50 rounded-2xl text-center">
                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest leading-tight">
                  {lang === 'bn' ? 'একজন শিক্ষার্থীকে তাদের পরবর্তী বইটি খুঁজে পেতে সাহায্য করুন!' : 'Help a student find their next read!'}
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailsPage;
