
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';
import { BookOpen, User, LogOut, Menu, X, PlusCircle, LayoutGrid, ChevronRight, Info } from 'lucide-react';
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
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      scrolled ? 'py-3' : 'py-5'
    }`}>
      <div className={`container mx-auto max-w-7xl px-4`}>
        <div className={`flex justify-between items-center h-14 md:h-16 px-6 transition-all duration-300 rounded-2xl ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-sm border border-emerald-100/50' 
            : 'bg-transparent'
        }`}>
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="bg-accent p-1.5 rounded-lg shadow-sm shadow-accent/10">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-serif text-zinc-900 tracking-tight">BookSwap</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={toggleLang}
              className="flex items-center gap-2.5 bg-zinc-100/50 px-4 py-1.5 rounded-full text-[11px] font-bold text-zinc-600 hover:bg-zinc-100 transition border border-zinc-200/50 shadow-sm"
            >
              {lang === 'en' ? (
                <>
                  <span className="text-base leading-none">🇬🇧</span>
                  <span className="tracking-widest uppercase text-[9px]">English</span>
                </>
              ) : (
                <>
                  <span className="text-base leading-none">🇧🇩</span>
                  <span className="tracking-wider font-bn">বাংলা</span>
                </>
              )}
            </button>

            <Link to="/" className="text-xs font-semibold text-zinc-600 hover:text-accent transition">
              {t('browse')}
            </Link>

            <Link to="/about" className="text-xs font-semibold text-zinc-600 hover:text-accent transition">
              {t('about')}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-6">
                <Link to="/sell" className="bg-accent text-white px-5 py-2 rounded-xl hover:bg-accent-hover transition flex items-center gap-2 text-xs font-semibold shadow-sm">
                  <PlusCircle className="w-4 h-4" />
                  {t('sellABook')}
                </Link>
                <Link to="/dashboard" className="text-zinc-600 hover:text-accent font-semibold text-xs flex items-center gap-2 transition">
                  <User className="w-4 h-4" />
                  {t('dashboard')}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-zinc-400 hover:text-red-600 font-semibold text-xs transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="bg-zinc-900 text-white px-7 py-2 rounded-xl hover:bg-zinc-800 transition text-xs font-semibold shadow-sm">
                {t('signIn')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`p-2 transition-colors rounded-xl ${isMenuOpen ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-900'}`}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-[90] transition-transform duration-500 md:hidden ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="pt-24 px-6 space-y-4">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-5 bg-zinc-50 rounded-xl text-zinc-900 font-semibold text-sm">
            <div className="flex items-center gap-4">
              <LayoutGrid className="w-5 h-5 text-accent" />
              {t('browse')}
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-300" />
          </Link>

          <Link to="/about" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-5 bg-zinc-50 rounded-xl text-zinc-900 font-semibold text-sm">
            <div className="flex items-center gap-4">
              <Info className="w-5 h-5 text-accent" />
              {t('about')}
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-300" />
          </Link>
          
          {user ? (
            <>
              <Link to="/sell" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-5 bg-accent text-white rounded-xl font-semibold text-sm shadow-sm">
                {t('sellABook')}
              </Link>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-5 bg-zinc-50 rounded-xl font-semibold text-sm">
                {t('dashboard')}
              </Link>
              <button onClick={handleLogout} className="w-full p-5 text-red-600 font-semibold text-sm bg-red-50 rounded-xl text-left">
                {t('logout')}
              </button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="block p-5 bg-zinc-900 text-white rounded-xl font-semibold text-center">
              {t('signIn')}
            </Link>
          )}

          <div className="pt-6">
            <button 
              onClick={toggleLang}
              className="w-full flex items-center justify-center gap-4 p-5 bg-zinc-100 rounded-xl font-bold text-sm"
            >
              {lang === 'en' ? (
                <>
                  <span className="text-xl">🇧🇩</span>
                  <span>Switch to বাংলা</span>
                </>
              ) : (
                <>
                  <span className="text-xl">🇬🇧</span>
                  <span>Switch to English</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
