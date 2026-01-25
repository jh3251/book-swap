import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';
import { LogOut, Menu, X, PlusCircle, LayoutGrid, ChevronRight, Info, Home } from 'lucide-react';
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
            <div className="w-9 h-9 flex items-center justify-center">
              <img 
                src="https://i.ibb.co/kgjLXphC/book-Converted.png" 
                alt="BookSwap Logo" 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="text-xl font-bold font-serif text-zinc-900 tracking-tight">BookSwap</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Language Toggle Switch */}
            <div className="flex items-center bg-zinc-100/80 px-1 py-1 rounded-full border border-zinc-200/50 shadow-sm mr-2">
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all duration-300 ${
                  lang === 'en' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                EN
              </button>
              <div className="w-px h-3 bg-zinc-200 mx-0.5"></div>
              <button 
                onClick={() => setLang('bn')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all duration-300 ${
                  lang === 'bn' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                BD
              </button>
            </div>

            <Link to="/" className="text-xs font-semibold text-zinc-600 hover:text-accent transition">
              {t('home')}
            </Link>

            <Link to="/about" className="text-xs font-semibold text-zinc-600 hover:text-accent transition mr-2">
              {t('aboutUs')}
            </Link>

            {/* Sell a Book - Visible to everyone */}
            <Link to="/sell" className="bg-accent text-white px-5 py-2 rounded-xl hover:bg-accent-hover transition flex items-center gap-2 text-xs font-semibold shadow-sm">
              <PlusCircle className="w-4 h-4" />
              {t('sellABook')}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-5">
                <Link to="/dashboard" className="text-zinc-600 hover:text-accent font-semibold text-xs flex items-center gap-2 transition">
                  <LayoutGrid className="w-4 h-4" />
                  {t('dashboard')}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-zinc-400 hover:text-red-600 font-semibold text-xs transition flex items-center"
                  title={t('logout')}
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
          {/* Sell a Book - Always at top of mobile menu */}
          <Link to="/sell" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-5 bg-accent text-white rounded-xl font-semibold text-sm shadow-sm mb-2">
            <div className="flex items-center gap-4">
              <PlusCircle className="w-5 h-5" />
              {t('sellABook')}
            </div>
            <ChevronRight className="w-4 h-4 text-white/50" />
          </Link>

          <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-5 bg-zinc-50 rounded-xl text-zinc-900 font-semibold text-sm">
            <div className="flex items-center gap-4">
              <Home className="w-5 h-5 text-accent" />
              {t('home')}
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-300" />
          </Link>

          <Link to="/about" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-5 bg-zinc-50 rounded-xl text-zinc-900 font-semibold text-sm">
            <div className="flex items-center gap-4">
              <Info className="w-5 h-5 text-accent" />
              {t('aboutUs')}
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-300" />
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-5 bg-zinc-50 rounded-xl font-semibold text-sm">
                <div className="flex items-center gap-4">
                  <LayoutGrid className="w-5 h-5 text-accent" />
                  {t('dashboard')}
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-300" />
              </Link>
              <button onClick={handleLogout} className="w-full p-5 text-red-600 font-semibold text-sm bg-red-50 rounded-xl text-left flex items-center gap-4">
                <LogOut className="w-5 h-5" />
                {t('logout')}
              </button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="block p-6 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-center shadow-lg">
              {t('signIn')}
            </Link>
          )}

          <div className="pt-6">
            {/* Mobile Language Toggle */}
            <div className="flex items-center justify-center gap-4 bg-zinc-100 p-5 rounded-2xl">
              <button 
                onClick={() => { setLang('en'); setIsMenuOpen(false); }}
                className={`px-6 py-2 rounded-xl font-black text-xs transition-all ${lang === 'en' ? 'bg-white text-zinc-900 shadow-md' : 'text-zinc-400'}`}
              >
                ENGLISH (EN)
              </button>
              <button 
                onClick={() => { setLang('bn'); setIsMenuOpen(false); }}
                className={`px-6 py-2 rounded-xl font-black text-xs transition-all ${lang === 'bn' ? 'bg-white text-zinc-900 shadow-md' : 'text-zinc-400'}`}
              >
                বাংলা (BD)
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;