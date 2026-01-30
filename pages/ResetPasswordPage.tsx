import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { firebase } from '../firebase';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, Loader2, ChevronLeft, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../App';

const ResetPasswordPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, t } = useTranslation();
  
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Get the action code from the URL parameters
    const params = new URLSearchParams(location.search);
    const code = params.get('oobCode');
    
    if (code) {
      setOobCode(code);
      // Verify the reset code with Firebase
      firebase.auth.verifyPasswordResetCode(code)
        .then(() => {
          setVerifying(false);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Verification error:", err);
          setError(lang === 'bn' 
            ? 'এই পাসওয়ার্ড রিসেট লিঙ্কটি সঠিক নয় অথবা এর মেয়াদ শেষ হয়ে গেছে।' 
            : 'The password reset link is invalid or has expired.');
          setVerifying(false);
          setLoading(false);
        });
    } else {
      setError(lang === 'bn' ? 'কোনো রিসেট কোড পাওয়া যায়নি।' : 'No reset code found in URL.');
      setVerifying(false);
      setLoading(false);
    }
  }, [location, lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode || submitting) return;

    if (newPassword.length < 6) {
      setError(lang === 'bn' ? 'পাসওয়ার্ডটি কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(lang === 'bn' ? 'পাসওয়ার্ড দুটি মেলেনি।' : 'Passwords do not match.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await firebase.auth.confirmPasswordReset(oobCode, newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/auth'), 3000);
    } catch (err: any) {
      console.error("Reset Error:", err);
      setError(lang === 'bn' 
        ? 'পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' 
        : 'Failed to reset password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="font-black text-zinc-400 uppercase text-[10px] tracking-widest animate-pulse">
          Verifying reset request...
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto py-24">
        <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-emerald-50 text-center space-y-8 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-black text-black mb-3">Password Updated</h1>
            <p className="text-zinc-500 font-medium text-sm leading-relaxed px-4">
              {lang === 'bn' 
                ? 'আপনার পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে। আপনাকে এখন সাইন ইন পেজে নিয়ে যাওয়া হচ্ছে।' 
                : 'Your password has been successfully updated. You are now being redirected to the sign-in page.'}
            </p>
          </div>
          <Link to="/auth" className="w-full bg-accent text-white py-6 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-accent-hover transition shadow-xl shadow-accent/20 uppercase">
            Sign In Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-emerald-50 relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-black text-black mb-4">
              {lang === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password'}
            </h1>
            <p className="text-zinc-500 font-medium text-sm">
              {lang === 'bn' 
                ? 'আপনার অ্যাকাউন্টের জন্য একটি নতুন এবং শক্তিশালী পাসওয়ার্ড সেট করুন।' 
                : 'Set a new and secure password for your account.'}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[13px] font-semibold border border-red-100 flex items-center gap-3 mb-8 animate-in fade-in duration-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {!oobCode || (error && verifying) ? (
            <div className="text-center space-y-6">
              <button 
                onClick={() => navigate('/auth')} 
                className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-black text-xs uppercase hover:bg-black transition flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-zinc-900 uppercase mb-3 ml-1">
                  {lang === 'bn' ? 'নতুন পাসওয়ার্ড' : 'NEW PASSWORD'}
                </label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 text-emerald-200 group-focus-within:text-accent w-5 h-5 transition-colors" />
                  <input 
                    required 
                    type={showPassword ? "text" : "password"} 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="w-full pl-14 pr-14 py-5 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl focus:ring-4 focus:ring-accent/10 outline-none font-bold text-black placeholder:text-zinc-300 transition-all" 
                    placeholder="............" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-200 hover:text-accent transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-900 uppercase mb-3 ml-1">
                  {confirmPassword && newPassword !== confirmPassword ? (
                    <span className="text-red-500">Mismatched</span>
                  ) : (lang === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'CONFIRM PASSWORD')}
                </label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 text-emerald-200 group-focus-within:text-accent w-5 h-5 transition-colors" />
                  <input 
                    required 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="w-full pl-14 pr-14 py-5 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl focus:ring-4 focus:ring-accent/10 outline-none font-bold text-black placeholder:text-zinc-300 transition-all" 
                    placeholder="............" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-200 hover:text-accent transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button 
                disabled={submitting} 
                type="submit" 
                className="w-full bg-accent text-white py-6 rounded-full font-black text-sm md:text-base hover:bg-accent-hover transition-all shadow-xl shadow-accent/30 flex items-center justify-center gap-3 mt-8 disabled:opacity-50 uppercase transform active:scale-[0.98]"
              >
                {submitting ? 'Updating...' : (lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Update Password')}
                {!submitting && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          )}
          
          <div className="mt-10 flex items-center justify-center gap-2 text-[9px] text-zinc-400 uppercase font-black">
            <ShieldCheck className="w-4 h-4 text-accent" />
            Security Verified by Google
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;