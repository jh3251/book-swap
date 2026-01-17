
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';
import { BookOpen, User, LogOut, Menu, X, PlusCircle, LayoutGrid, Languages, ChevronRight } from 'lucide-react';
import { useTranslation } from '../App';

interface NavbarProps {
  user: UserProfile | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'bn' : 'en');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      scrolled 
        ? 'py-4 px-4' 
        : 'py-6 px-4'
    }`}>
      <div className={`container mx-auto transition-all duration-500 rounded-[2rem] px-6 md:px-10 h-16 md:h-20 flex justify-between items-center ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-2xl shadow-2xl shadow-emerald-900/10 border border-white/50' 
          : 'bg-transparent'
      }`}>
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-accent p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-accent/20">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl md:text-2xl font-black font-serif text-black tracking-tight">BookSwap</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {/* Language Switcher */}
          <button 
            onClick={toggleLang}
            className="flex items-center gap-3 bg-emerald-50/50 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition border border-emerald-100/50"
          >
            <Languages className="w-4 h-4 text-accent" />
            {lang === 'en' ? 'EN | বাংলা' : 'বাংলা | EN'}
          </button>

          <Link to="/" className="text-[11px] font-black uppercase tracking-[0.2em] text-black hover:text-accent transition relative group/link">
            {t('browse')}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover/link:w-full transition-all duration-300"></span>
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-8">
              <Link to="/sell" className="bg-accent text-white px-8 py-3.5 rounded-2xl hover:bg-accent-hover transition-all transform active:scale-95 flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-accent/30">
                <PlusCircle className="w-4 h-4" />
                {t('sellABook')}
              </Link>
              <Link to="/dashboard" className="text-black hover:text-accent font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition">
                <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-accent" />
                </div>
                {t('dashboard')}
              </Link>
              <button 
                onClick={handleLogout}
                className="text-zinc-400 hover:text-red-600 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                {t('logout')}
              </button>
            </div>
          ) : (
            <Link to="/auth" className="bg-black text-white px-10 py-4 rounded-2xl hover:bg-zinc-800 transition-all font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-black/10">
              {t('signIn')}
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button 
            onClick={toggleLang}
            className="p-3 text-accent bg-emerald-50 rounded-2xl border border-emerald-100"
          >
            <Languages className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className={`p-3 transition-colors rounded-2xl ${isMenuOpen ? 'bg-black text-white' : 'bg-emerald-50 text-black border border-emerald-100'}`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-[90] transition-all duration-500 md:hidden ${
        isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
      }`}>
        <div className="pt-32 px-6 space-y-4 h-full flex flex-col">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-8 py-6 bg-emerald-50 rounded-3xl text-black font-black uppercase tracking-[0.2em] text-sm">
            <div className="flex items-center gap-5">
              <LayoutGrid className="w-6 h-6 text-accent" />
              {t('browse')}
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-300" />
          </Link>
          
          {user ? (
            <div className="space-y-4">
              <Link to="/sell" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-8 py-8 bg-accent text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-accent/40">
                <div className="flex items-center gap-5">
                  <PlusCircle className="w-7 h-7" />
                  {t('sellABook')}
                </div>
                <ChevronRight className="w-6 h-6 text-white/50" />
              </Link>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-8 py-6 bg-zinc-50 rounded-3xl text-black font-black uppercase tracking-[0.2em] text-sm border border-zinc-100">
                <div className="flex items-center gap-5">
                  <User className="w-6 h-6 text-accent" />
                  {t('dashboard')}
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-300" />
              </Link>
              <button onClick={handleLogout} className="flex items-center justify-between px-8 py-6 w-full text-red-600 font-black uppercase tracking-[0.2em] text-sm bg-red-50 rounded-3xl border border-red-100 mt-12">
                <div className="flex items-center gap-5">
                  <LogOut className="w-6 h-6" />
                  {t('logout')}
                </div>
              </button>
            </div>
          ) : (
            <div className="mt-10">
              <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="block px-8 py-8 text-white font-black uppercase tracking-[0.3em] text-sm bg-black rounded-[2.5rem] text-center shadow-4xl shadow-black/30">
                {t('signIn')}
              </Link>
            </div>
          )}

          <div className="mt-auto pb-12 text-center text-[10px] font-black text-zinc-300 uppercase tracking-widest">
            BookSwap Bangladesh • {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
