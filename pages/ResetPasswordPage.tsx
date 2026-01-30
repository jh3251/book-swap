
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { firebase } from '../firebase';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../App';
import SEO from '../components/SEO';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang, t } = useTranslation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    const validateCode = async () => {
      // Check if oobCode is present
      if (!oobCode) {
        setError(lang === 'bn' ? 'অকার্যকর লিংক।' : 'Invalid reset link.');
        setIsValidating(false);
        return;
      }
      try {
        const email = await firebase.auth.verifyResetCode(oobCode);
        setUserEmail(email);
      } catch (err: any) {
        setError(lang === 'bn' ? 'আপনার পাসওয়ার্ড রিসেট লিংকটি মেয়াদোত্তীর্ণ বা অকার্যকর হয়ে গেছে।' : 'Your password reset link is expired or invalid.');
      } finally {
        setIsValidating(false);
      }
    };
    validateCode();
  }, [oobCode, lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) return;
    
    setError('');
    if (password.length < 6) {
      setError(lang === 'bn' ? 'পাসওয়ার্ডটি কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError(lang === 'bn' ? 'পাসওয়ার্ড দুটি মেলেনি।' : 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await firebase.auth.confirmReset(oobCode, password);
      setSuccess(true);
      setTimeout(() => navigate('/auth'), 3000);
    } catch (err: any) {
      setError(lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন সম্ভব হয়নি। আবার চেষ্টা করুন।' : 'Could not change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6 animate-in fade-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse"></div>
          <Loader2 className="w-12 h-12 animate-spin text-accent relative z-10" />
        </div>
        <p className="font-black text-xs text-zinc-400 uppercase tracking-[0.3em]">Verifying Link...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4 animate-in slide-in-from-bottom-4 duration-500">
      <SEO title="Reset Password" description="Create a new password for your BoiSathi account." />
      
      <div className="bg-white p-8 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-emerald-900/10 border border-emerald-50">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Lock className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-4xl font-serif font-black text-black mb-3 tracking-tight">
            {lang === 'bn' ? 'নতুন পাসওয়ার্ড' : 'Update Password'}
          </h1>
          {userEmail && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-50 rounded-full border border-zinc-100">
               <span className="text-[10px] font-black text-zinc-300 uppercase">Account:</span>
               <span className="text-xs text-black font-black">{userEmail}</span>
            </div>
          )}
        </div>

        {error ? (
          <div className="space-y-8">
            <div className="p-6 bg-red-50 text-red-600 rounded-3xl flex items-start gap-4 border border-red-100">
              <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <p className="font-bold text-sm leading-relaxed">{error}</p>
            </div>
            <button 
              onClick={() => navigate('/auth')} 
              className="w-full flex items-center justify-center gap-3 bg-zinc-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-wider shadow-xl shadow-black/10 active:scale-95 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> {lang === 'bn' ? 'লগইন পেজে ফিরে যান' : 'Back to Login'}
            </button>
          </div>
        ) : success ? (
          <div className="text-center space-y-8 animate-in zoom-in duration-300">
            <div className="p-10 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex flex-col items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-black mb-2">Password Updated!</h3>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Redirecting you to login...</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-zinc-900 uppercase ml-1 tracking-widest">New Password</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-200 group-focus-within:text-accent w-5 h-5 transition-colors" />
                <input 
                  required 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-6 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl outline-none font-black text-black text-lg focus:ring-4 focus:ring-accent/10 transition-all"
                  placeholder="............"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-200 hover:text-accent p-1 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-zinc-900 uppercase ml-1 tracking-widest">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-200 group-focus-within:text-accent w-5 h-5 transition-colors" />
                <input 
                  required 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-6 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl outline-none font-black text-black text-lg focus:ring-4 focus:ring-accent/10 transition-all"
                  placeholder="............"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accent text-white py-6 rounded-2xl font-black text-xs md:text-sm uppercase shadow-2xl shadow-accent/20 hover:bg-accent-hover transition-all active:scale-[0.98] flex items-center justify-center gap-4 mt-4"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
              Update Password
            </button>
            
            <div className="pt-6 mt-6 border-t border-emerald-50 flex items-center justify-center gap-2 text-[9px] font-black text-zinc-400 uppercase">
              <ShieldCheck className="w-4 h-4 text-accent" /> Secure Student Authentication
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
