
import React, { useState, useRef, useEffect } from 'react';
import { firebase } from '../firebase';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Zap, Eye, EyeOff, ChevronLeft, CheckCircle2, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setNeedsVerification(false);
    setError('');
    setResetSent(false);
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setError('');
    setResetSent(false);
  };

  const checkVerificationStatus = async () => {
    setLoading(true);
    try {
      const user = await firebase.auth.reloadUser();
      if (user?.emailVerified) {
        window.location.reload(); 
      } else {
        setError('Email not verified yet. Please check your inbox.');
      }
    } catch (err) {
      setError('Could not refresh status.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isForgotPassword) {
      setLoading(true);
      try {
        await firebase.auth.resetPassword(email);
        setResetSent(true);
      } catch (err: any) {
        setError('Could not send reset email. Please check the address.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!isLogin && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await firebase.auth.signIn(email, password);
      } else {
        await firebase.auth.signUp(email, password, name, undefined);
        setNeedsVerification(true);
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Incorrect email or password. Please try again.');
      } else {
        setError('Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (needsVerification) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-emerald-900/10 border border-emerald-50 text-center space-y-8 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
             <div className="absolute inset-0 bg-accent/10 rounded-full animate-ping"></div>
             <Mail className="w-10 h-10 text-accent relative z-10" />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold font-serif text-black mb-3">Check Your Gmail</h1>
            <p className="text-zinc-500 font-medium text-sm leading-relaxed px-4">
              We've sent a verification link to <span className="text-black font-black underline decoration-accent underline-offset-4">{email}</span>. Click the link to activate your student account.
            </p>
          </div>

          <div className="space-y-4">
            <a 
              href="https://mail.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-accent text-white py-4.5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-accent-hover transition shadow-xl shadow-accent/20 uppercase tracking-widest"
            >
              Open Gmail <ExternalLink className="w-4 h-4" />
            </a>
            
            <button 
              onClick={checkVerificationStatus}
              disabled={loading}
              className="w-full bg-white text-black border-2 border-emerald-100 py-4.5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-emerald-50 transition uppercase tracking-widest disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Status
            </button>
          </div>

          <div className="pt-6 border-t border-emerald-50">
             <button onClick={() => setNeedsVerification(false)} className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-black transition">
               Wrong email address? Go back
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-emerald-50 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6 bg-emerald-50/50 w-fit mx-auto px-4 py-1.5 rounded-full text-accent font-bold text-[9px] uppercase tracking-[0.2em] border border-emerald-100">
             <Zap className="w-3 h-3" /> 100% Free Service
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-black mb-4">
              {isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome Back!' : 'Join BookSwap')}
            </h1>
            <p className="text-zinc-500 font-medium text-sm">
              {isForgotPassword 
                ? 'Enter your email to receive a recovery link.' 
                : (isLogin ? 'Sign in to manage your free listings.' : 'Create your account to start trading.')}
            </p>
          </div>

          {resetSent ? (
            <div className="space-y-8 py-4 animate-in zoom-in duration-300">
              <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black mb-1">Check Your Inbox</h3>
                  <p className="text-xs text-zinc-500 font-medium">We've sent a password reset link to <span className="text-black font-bold">{email}</span></p>
                </div>
              </div>
              <button 
                onClick={toggleForgotPassword} 
                className="w-full flex items-center justify-center gap-2 text-accent font-black text-xs uppercase tracking-widest hover:underline underline-offset-8"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[13px] font-semibold border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
                  <div className="bg-white rounded-full p-0.5 border border-red-200">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </div>
                  {error}
                </div>
              )}

              {!isLogin && !isForgotPassword && (
                <div>
                  <label className="block text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em] mb-3 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 transform -translate-y-1/2 text-emerald-200 group-focus-within:text-accent w-5 h-5 transition-colors" />
                    <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-14 pr-4 py-5 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl focus:ring-4 focus:ring-accent/10 outline-none font-bold text-black placeholder:text-zinc-300 transition-all" placeholder="Enter your full name" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em] mb-3 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 transform -translate-y-1/2 text-emerald-200 group-focus-within:text-accent w-5 h-5 transition-colors" />
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-14 pr-4 py-5 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl focus:ring-4 focus:ring-accent/10 outline-none font-bold text-black placeholder:text-zinc-300 transition-all" placeholder="student@gmail.com" />
                </div>
              </div>

              {!isForgotPassword && (
                <div>
                  <div className="flex justify-between items-center mb-3 ml-1">
                    <label className="block text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em]">Password</label>
                    {isLogin && (
                      <button 
                        type="button" 
                        onClick={toggleForgotPassword} 
                        className="text-[10px] font-black text-accent uppercase tracking-widest hover:text-accent-hover transition"
                      >
                        FORGOT?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 text-emerald-200 group-focus-within:text-accent w-5 h-5 transition-colors" />
                    <input 
                      required 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
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
              )}

              <button 
                disabled={loading} 
                type="submit" 
                className="w-full bg-accent text-white py-5.5 md:py-6 rounded-full font-black text-sm hover:bg-accent-hover transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 mt-6 disabled:opacity-50 uppercase tracking-[0.25em] transform active:scale-[0.98]"
              >
                {loading ? 'Processing...' : (isForgotPassword ? 'Send Link' : (isLogin ? 'Sign In' : 'Join Now'))}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>

              {isForgotPassword && (
                <button 
                  type="button" 
                  onClick={toggleForgotPassword} 
                  className="w-full flex items-center justify-center gap-2 text-zinc-400 font-black text-[10px] uppercase tracking-widest hover:text-black transition"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Login
                </button>
              )}
            </form>
          )}

          {!isForgotPassword && (
            <div className="mt-10 pt-10 border-t border-emerald-50 text-center">
              <p className="text-zinc-500 text-[13px] font-bold">
                {isLogin ? "New to BookSwap?" : "Member already?"}{' '}
                <button onClick={toggleMode} className="text-accent font-black hover:text-accent-hover transition underline-offset-4 hover:underline">
                  {isLogin ? 'Sign Up Free' : 'Log In'}
                </button>
              </p>
            </div>
          )}
          
          <div className="mt-10 flex items-center justify-center gap-2 text-[9px] text-zinc-400 uppercase tracking-[0.3em] font-black">
            <ShieldCheck className="w-4 h-4 text-accent" />
            Built for Bangladesh Students
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
