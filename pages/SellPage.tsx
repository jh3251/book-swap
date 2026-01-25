
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { firebase } from '../firebase';
import { UserProfile, BookListing } from '../types';
import { CONDITIONS, CLASSES } from '../constants';
import LocationSelector from '../components/LocationSelector';
import { ArrowLeft, Save, AlertCircle, Sparkles, Camera, X, Image as ImageIcon, Loader2, CheckCircle2, CloudOff, MapPin, LayoutGrid } from 'lucide-react';
import { useTranslation } from '../App';

interface SellPageProps {
  user: UserProfile;
}

const SellPage: React.FC<SellPageProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t, lang } = useTranslation();
  
  const [loading, setLoading] = useState(false);
  const [takingLong, setTakingLong] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userListingCount, setUserListingCount] = useState<number>(0);
  
  const [formData, setFormData] = useState<Partial<BookListing>>({
    title: '',
    author: '',
    subject: '',
    condition: 'Good',
    price: 0,
    contactPhone: user.phone || '',
    description: '',
    location: {
      divisionId: '',
      divisionName: '',
      districtId: '',
      districtName: '',
      upazilaId: '',
      upazilaName: ''
    }
  });

  useEffect(() => {
    // Fetch current user listings to check the limit
    const fetchUserStats = async () => {
      try {
        const listings = await firebase.db.getUserListings(user.uid);
        setUserListingCount(listings.length);
      } catch (e) {
        console.warn("Could not fetch user stats");
      }
    };
    fetchUserStats();

    if (id) {
      const fetchListing = async () => {
        const listing = await firebase.db.getListingById(id);
        if (listing && listing.sellerId === user.uid) {
          setFormData(listing);
          if (listing.imageUrl) {
            setImagePreview(listing.imageUrl);
          }
        } else {
          navigate('/dashboard');
        }
      };
      fetchListing();
    }
  }, [id, user.uid, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    // Check limit only for NEW listings
    if (!id && userListingCount >= 10) {
      return lang === 'bn' 
        ? "আপনি সর্বোচ্চ ১০টি বিজ্ঞাপন দিতে পারেন। নতুন বিজ্ঞাপন দিতে হলে আপনার পুরনো কোনো বিজ্ঞাপন ডিলিট করুন।"
        : "Listing Limit Reached: You can have a maximum of 10 active ads. Please delete an old ad to post a new one.";
    }

    if (!formData.title?.trim()) return "Please enter a book title.";
    // Author is no longer mandatory
    if (!formData.subject) return "Please select a class.";
    if (formData.condition !== 'Donation' && (!formData.price || formData.price <= 0)) return "Please enter a valid price.";
    if (!formData.location?.upazilaId) return "Please select a full location.";
    
    const phone = formData.contactPhone?.trim() || "";
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    if (!phone) return "Please enter a contact phone number.";
    if (!bdPhoneRegex.test(phone)) return "Invalid Phone. Must be 11-digit Bangladeshi number (e.g., 017XXXXXXXX).";
    
    return null;
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCondition = e.target.value as any;
    setFormData({
      ...formData,
      condition: newCondition,
      price: newCondition === 'Donation' ? 0 : formData.price
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError('');
    const longTimer = setTimeout(() => setTakingLong(true), 4000);

    try {
      if (id) {
        await firebase.db.updateListing(id, formData, imageFile || undefined);
      } else {
        await firebase.db.addListing({
          ...formData as BookListing,
          sellerId: user.uid,
          sellerName: user.displayName,
        }, imageFile || undefined);
      }
      clearTimeout(longTimer);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      clearTimeout(longTimer);
      setError('Connection interrupted. Saving locally instead.');
      setLoading(false);
      setTakingLong(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 md:py-32 space-y-6 animate-in zoom-in duration-300">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40">
          <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-white" />
        </div>
        <div className="text-center px-4">
          <h2 className="text-2xl md:text-3xl font-serif font-black text-black">Ad Published!</h2>
          <p className="text-zinc-500 font-black mt-2 uppercase tracking-widest text-[10px]">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  const isAtLimit = !id && userListingCount >= 10;

  return (
    <div className="max-w-4xl mx-auto pb-12 px-2 md:px-0">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 md:mb-8 flex items-center text-black hover:text-accent transition font-black text-[10px] uppercase tracking-[0.2em]"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl shadow-emerald-900/5 border border-emerald-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {id ? 'Edit Listing' : 'Post an Ad'}
              </span>
              {!id && (
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border flex items-center gap-1.5 ${userListingCount >= 10 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-zinc-50 text-zinc-500 border-zinc-100'}`}>
                  <LayoutGrid className="w-3.5 h-3.5" />
                  {lang === 'bn' ? `স্লট: ${userListingCount}/১০ ব্যবহৃত` : `Slots: ${userListingCount}/10 used`}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-black">
              {id ? 'Edit Listing' : 'Sell your Book'}
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 animate-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="font-bold text-sm leading-relaxed">{error}</p>
          </div>
        )}

        {isAtLimit && (
          <div className="mb-6 p-6 bg-orange-50 border border-orange-100 rounded-[2rem] flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <AlertCircle className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-base font-black text-black mb-1 uppercase tracking-wide">
                {lang === 'bn' ? 'বিজ্ঞাপনের সীমা পূর্ণ হয়েছে' : 'Listing Limit Reached'}
              </h3>
              <p className="text-zinc-600 font-medium text-xs leading-relaxed max-w-md">
                {lang === 'bn' 
                  ? 'আপনার স্টোরেজ এখন পূর্ণ। নতুন কোনো বই পোস্ট করার জন্য আপনাকে ড্যাশবোর্ড থেকে একটি পুরনো বিজ্ঞাপন ডিলিট করতে হবে।' 
                  : 'Your storage is currently full. To post a new book, you need to delete an older listing from your dashboard.'}
              </p>
              <button 
                type="button"
                onClick={() => navigate('/dashboard')}
                className="mt-4 inline-flex items-center gap-2 text-accent font-black text-[10px] uppercase tracking-widest hover:underline underline-offset-8"
              >
                Go to Dashboard <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={`space-y-8 ${isAtLimit ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
          {/* Section 1: Photos */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-black text-black border-b border-emerald-50 pb-2 flex items-center gap-3">
              <Camera className="w-5 h-5 text-accent" /> 1. Photos
            </h3>
            <div 
              onClick={() => !isAtLimit && fileInputRef.current?.click()}
              className={`w-full aspect-video rounded-[1.5rem] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group ${
                imagePreview ? 'border-emerald-100' : 'border-emerald-50 bg-emerald-50/20 hover:bg-emerald-50/40 hover:border-emerald-200'
              }`}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Book" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(); }} className="p-3 bg-white rounded-full text-red-500 shadow-xl hover:scale-110 transition">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                    <ImageIcon className="w-8 h-8 text-emerald-200" />
                  </div>
                  <p className="font-black text-black text-[10px] uppercase tracking-widest mb-1">Upload Book Photo</p>
                  <p className="text-zinc-400 text-[10px] font-medium">JPEG or PNG, up to 5MB</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>

          {/* Section 2: Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-black text-black border-b border-emerald-50 pb-2 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-accent" /> 2. Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-2 ml-1">BOOK TITLE *</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-6 py-3 bg-[#f0fdf4] border border-emerald-100/50 rounded-xl focus:ring-4 focus:ring-accent/5 outline-none font-black text-black text-base transition-all"
                  placeholder="e.g. Higher Math 1st Paper"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-2 ml-1">AUTHOR</label>
                <input 
                  type="text" 
                  value={formData.author} 
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="w-full px-6 py-3 bg-[#f0fdf4] border border-emerald-100/50 rounded-xl focus:ring-4 focus:ring-accent/5 outline-none font-black text-black text-base transition-all"
                  placeholder="e.g. S.U. Ahmed"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-2 ml-1">CLASS *</label>
                <select 
                  value={formData.subject} 
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-6 py-3 bg-[#f0fdf4] border border-emerald-100/50 rounded-xl focus:ring-4 focus:ring-accent/5 outline-none font-black text-black text-base transition-all appearance-none"
                >
                  <option value="">Select Class</option>
                  {CLASSES.map(c => <option key={c} value={c}>{t(c as any)}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-2 ml-1">CONDITION *</label>
                <select 
                  value={formData.condition} 
                  onChange={handleConditionChange}
                  className="w-full px-6 py-3 bg-[#f0fdf4] border border-emerald-100/50 rounded-xl focus:ring-4 focus:ring-accent/5 outline-none font-black text-black text-base transition-all appearance-none"
                >
                  {CONDITIONS.map(c => <option key={c} value={c}>{t(c as any)}</option>)}
                </select>
              </div>
              
              {formData.condition !== 'Donation' && (
                <div className="space-y-1.5 md:col-span-1">
                  <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-2 ml-1">PRICE (৳) *</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-emerald-300 text-base">৳</span>
                    <input 
                      type="number" 
                      value={formData.price || ''} 
                      onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                      className="w-full pl-12 pr-6 py-3 bg-[#f0fdf4] border border-emerald-100/50 rounded-xl focus:ring-4 focus:ring-accent/5 outline-none font-black text-black text-base transition-all"
                      placeholder="250"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5 md:col-span-1">
                <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-2 ml-1">CONTACT PHONE *</label>
                <input 
                  type="text" 
                  value={formData.contactPhone} 
                  onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  className="w-full px-6 py-3 bg-[#f0fdf4] border border-emerald-100/50 rounded-xl focus:ring-4 focus:ring-accent/5 outline-none font-black text-black text-base transition-all"
                  placeholder="017XXXXXXXX"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-2 ml-1">DESCRIPTION</label>
              <textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-6 py-4 bg-[#f0fdf4] border border-emerald-100/50 rounded-2xl focus:ring-4 focus:ring-accent/5 outline-none font-black text-black text-base transition-all min-h-[120px]"
                placeholder="Mention page quality, highlighting, or any defects..."
              />
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-black text-black border-b border-emerald-50 pb-2 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-accent" /> 3. Meetup Location
            </h3>
            <LocationSelector 
              value={formData.location || {}} 
              onChange={(loc) => setFormData({...formData, location: loc})} 
            />
          </div>

          <div className="pt-6 border-t border-emerald-50 flex flex-col md:flex-row items-center gap-6">
            <button 
              type="submit" 
              disabled={loading || isAtLimit}
              className="w-full md:w-auto bg-accent text-white px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-3xl shadow-accent/40 hover:bg-accent-hover transition flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {id ? 'Update Listing' : 'Publish Ad'}
            </button>
            
            {takingLong && !success && (
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100 animate-in fade-in duration-500">
                <CloudOff className="w-4 h-4 text-orange-500" />
                <p className="text-[9px] font-black text-orange-700 uppercase tracking-widest leading-relaxed">
                  Slow connection detected. Listing will be saved <br/> locally and synced when online.
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellPage;
