import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { firebase } from '../firebase';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../App';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, lang } = useTranslation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [oobCode, setOobCode] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('oobCode');
    if (!code) {
      setError(lang === 'bn' ? 'অকার্যকর লিংক। অনুগ্রহ করে নতুন করে চেষ্টা করুন।' : 'Invalid or expired link. Please try again.');
    } else {
      setOobCode(code);
    }
  }, [location, lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!oobCode) return;
    if (password.length < 6) {
      setError(lang === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError(lang === 'bn' ? 'পাসওয়ার্ড দুটি মেলেনি।' : 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await firebase.auth.confirmPasswordReset(oobCode, password);
      setSuccess(true);
      setTimeout(() => navigate('/auth'), 3000);
    } catch (err: any) {
      setError(lang === 'bn' ? 'পাসওয়ার্ড রিসেট করা সম্ভব হয়নি। লিংকটি মেয়াদোত্তীর্ণ হতে পারে।' : 'Failed to reset password. The link might be expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-20 px-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-emerald-50 text-center space-y-6 animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-serif font-black text-black">
            {lang === 'bn' ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!' : 'Password Updated!'}
          </h2>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
            {lang === 'bn' ? 'লগইন পেজে পাঠানো হচ্ছে...' : 'Redirecting to login page...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-emerald-50">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 text-accent font-black text-[9px] uppercase mb-6">
            <ShieldCheck className="w-3.5 h-3.5" /> Security
          </div>
          <h1 className="text-4xl font-serif font-black text-black mb-3">
            {lang === 'bn' ? 'নতুন পাসওয়ার্ড' : 'Set Password'}
          </h1>
          <p className="text-zinc-500 font-medium text-sm">
            {lang === 'bn' ? 'আপনার অ্যাকাউন্টের জন্য একটি শক্তিশালী পাসওয়ার্ড তৈরি করুন।' : 'Create a strong password for your student profile.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[13px] font-semibold border border-red-100 flex items-center gap-3 animate-in fade-in duration-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-zinc-900 uppercase mb-3 ml-1 tracking-widest">
              {lang === 'bn' ? 'নতুন পাসওয়ার্ড' : 'NEW PASSWORD'}
            </label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-200 group-focus-within:text-accent w-5 h-5 transition-colors" />
              <input 
                required 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full pl-14 pr-14 py-5 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl focus:ring-4 focus:ring-accent/10 outline-none font-bold text-black" 
                placeholder="••••••••" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-200 hover:text-accent p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-zinc-900 uppercase mb-3 ml-1 tracking-widest">
              {lang === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'CONFIRM PASSWORD'}
            </label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-200 group-focus-within:text-accent w-5 h-5 transition-colors" />
              <input 
                required 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className="w-full pl-14 pr-4 py-5 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl focus:ring-4 focus:ring-accent/10 outline-none font-bold text-black" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button 
            disabled={loading || !oobCode}
            type="submit" 
            className="w-full bg-accent text-white py-6 rounded-full font-black text-sm uppercase hover:bg-accent-hover transition-all shadow-xl shadow-accent/30 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;