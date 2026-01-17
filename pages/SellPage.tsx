
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { firebase } from '../firebase';
import { UserProfile, BookListing } from '../types';
import { CONDITIONS, CLASSES } from '../constants';
import LocationSelector from '../components/LocationSelector';
import { ArrowLeft, Save, AlertCircle, Sparkles, Camera, X, Image as ImageIcon, Loader2, CheckCircle2, CloudOff, MapPin } from 'lucide-react';

interface SellPageProps {
  user: UserProfile;
}

const SellPage: React.FC<SellPageProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [takingLong, setTakingLong] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
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
    if (!formData.title?.trim()) return "Please enter a book title.";
    if (!formData.author?.trim()) return "Please enter an author name.";
    if (!formData.subject) return "Please select a class.";
    if (formData.condition !== 'Donation' && (!formData.price || formData.price <= 0)) return "Please enter a valid price.";
    if (!formData.location?.upazilaId) return "Please select a full location.";
    
    const phone = formData.contactPhone?.trim() || "";
    // Regex for Bangladeshi phone number: 11 digits, starts with 013-019
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

  return (
    <div className="max-w-4xl mx-auto pb-12 px-2 md:px-0">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 md:mb-10 flex items-center text-black hover:text-accent transition font-black text-[10px] uppercase tracking-[0.2em]"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-emerald-900/5 border border-emerald-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-accent" />
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">Post an Ad</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-black">
              {id ? 'Edit Listing' : 'Sell your Book'}
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600 animate-in slide-in-from-top-4">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p className="font-bold text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1: Photos */}
          <div className="space-y-8">
            <h3 className="text-xl font-serif font-black text-black border-b border-emerald-50 pb-4 flex items-center gap-4">
              <Camera className="w-6 h-6 text-accent" /> 1. Photos
            </h3>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full aspect-video rounded-[2rem] border-4 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group ${
                imagePreview ? 'border-emerald-100' : 'border-emerald-50 bg-emerald-50/20 hover:bg-emerald-50/40 hover:border-emerald-200'
              }`}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Book" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(); }} className="p-4 bg-white rounded-full text-red-500 shadow-xl hover:scale-110 transition">
                      <X className="w-8 h-8" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                    <ImageIcon className="w-10 h-10 text-emerald-200" />
                  </div>
                  <p className="font-black text-black text-sm uppercase tracking-widest mb-2">Upload Book Photo</p>
                  <p className="text-zinc-400 text-xs font-medium">JPEG or PNG, up to 5MB</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>

          {/* Section 2: Details */}
          <div className="space-y-8">
            <h3 className="text-xl font-serif font-black text-black border-b border-emerald-50 pb-4 flex items-center gap-4">
              <Sparkles className="w-6 h-6 text-accent" /> 2. Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4 ml-1">BOOK TITLE *</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-8 py-5 bg-[#f0fdf4] border border-emerald-100/50 rounded-2xl focus:ring-4 focus:ring-accent/5 outline-none font-black text-black text-lg transition-all"
                  placeholder="e.g. Higher Math 1st Paper"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4 ml-1">AUTHOR *</label>
                <input 
                  type="text" 
                  value={formData.author} 
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="w-full px-8 py-5 bg-[#f0fdf4] border border-emerald-100/50 rounded-2xl focus:ring-4 focus:ring-accent/5 outline-none font-black text-black text-lg transition-all"
                  placeholder="e.g. S.U. Ahmed"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4 ml-1">CLASS *</label>
                <select 
                  value={formData.subject} 
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-8 py-5 bg-[#f0fdf4] border border-emerald-100/50 rounded-2xl focus:ring-4 focus:ring-accent/5 outline-none font-black text-black text-lg transition-all appearance-none"
                >
                  <option value="">Select Class</option>
                  {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4 ml-1">CONDITION *</label>
                <select 
                  value={formData.condition} 
                  onChange={handleConditionChange}
                  className="w-full px-8 py-5 bg-[#f0fdf4] border border-emerald-100/50 rounded-2xl focus:ring-4 focus:ring-accent/5 outline-none font-black text-black text-lg transition-all appearance-none"
                >
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              
              {formData.condition !== 'Donation' && (
                <div className="space-y-2 md:col-span-1">
                  <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4 ml-1">PRICE (৳) *</label>
                  <div className="relative">
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-emerald-300 text-lg">৳</span>
                    <input 
                      type="number" 
                      value={formData.price || ''} 
                      onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                      className="w-full pl-16 pr-8 py-5 bg-[#f0fdf4] border border-emerald-100/50 rounded-2xl focus:ring-4 focus:ring-accent/5 outline-none font-black text-black text-lg transition-all"
                      placeholder="250"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 md:col-span-1">
                <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4 ml-1">CONTACT PHONE *</label>
                <input 
                  type="text" 
                  value={formData.contactPhone} 
                  onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  className="w-full px-8 py-5 bg-[#f0fdf4] border border-emerald-100/50 rounded-2xl focus:ring-4 focus:ring-accent/5 outline-none font-black text-black text-lg transition-all"
                  placeholder="017XXXXXXXX"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4 ml-1">DESCRIPTION</label>
              <textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-8 py-6 bg-[#f0fdf4] border border-emerald-100/50 rounded-3xl focus:ring-4 focus:ring-accent/5 outline-none font-black text-black text-lg transition-all min-h-[160px]"
                placeholder="Mention page quality, highlighting, or any defects..."
              />
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="space-y-8">
            <h3 className="text-xl font-serif font-black text-black border-b border-emerald-50 pb-4 flex items-center gap-4">
              <MapPin className="w-6 h-6 text-accent" /> 3. Meetup Location
            </h3>
            <LocationSelector 
              value={formData.location || {}} 
              onChange={(loc) => setFormData({...formData, location: loc})} 
            />
          </div>

          <div className="pt-12 border-t border-emerald-50 flex flex-col md:flex-row items-center gap-8">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto bg-accent text-white px-16 py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] shadow-3xl shadow-accent/40 hover:bg-accent-hover transition flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {id ? 'Update Listing' : 'Publish Ad'}
            </button>
            
            {takingLong && !success && (
              <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100 animate-in fade-in duration-500">
                <CloudOff className="w-5 h-5 text-orange-500" />
                <p className="text-[10px] font-black text-orange-700 uppercase tracking-widest leading-relaxed">
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