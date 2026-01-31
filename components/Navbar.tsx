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

  const LanguageToggle = () => (
    <div className="flex items-center bg-zinc-100/80 px-1 py-1 rounded-full border border-zinc-200/50 shadow-sm">
      <button 
        onClick={() => setLang('en')}
        className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black transition-all duration-300 ${
          lang === 'en' ? 'bg-accent text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
        }`}
      >
        EN
      </button>
      <button 
        onClick={() => setLang('bn')}
        className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black transition-all duration-300 ${
          lang === 'bn' ? 'bg-accent text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
        }`}
      >
        BD
      </button>
    </div>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? 'py-3 md:py-4' : 'py-4 md:py-6'
      }`}>
        <div className="container mx-auto max-w-7xl px-3 md:px-4">
          <div className="bg-white/90 backdrop-blur-xl shadow-xl shadow-black/5 border border-emerald-50 rounded-full px-3 md:px-6 h-14 md:h-16 flex items-center justify-between transition-all duration-500">
            
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
              <div className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center">
                <img 
                  src="https://i.ibb.co/kgjLXphC/book-Converted.png" 
                  alt="BoiSathi Logo" 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm md:text-lg font-bold font-serif text-zinc-900 tracking-tight">BoiSathi</span>
                <span className="text-[8px] md:text-[10px] font-bn font-black text-accent uppercase tracking-widest">বইসাথী</span>
              </div>
            </Link>

            {/* Center/Right Section */}
            <div className="flex items-center gap-2 md:gap-8">
              <div>
                <LanguageToggle />
              </div>

              <div className="hidden lg:flex items-center space-x-6">
                <Link to="/" className="text-[11px] font-black text-zinc-600 hover:text-accent uppercase tracking-wider transition">
                  {t('home')}
                </Link>
                <Link to="/about" className="text-[11px] font-black text-zinc-600 hover:text-accent uppercase tracking-wider transition">
                  {t('aboutUs')}
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <Link to="/sell" className="hidden sm:flex bg-accent text-white px-3 md:px-5 py-2 md:py-2.5 rounded-full hover:bg-accent-hover transition items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-black uppercase shadow-lg shadow-accent/20">
                  <PlusCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span>{t('sellABook')}</span>
                </Link>

                {user ? (
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Link to="/dashboard" className="w-9 h-9 md:w-10 md:h-10 bg-zinc-100 text-zinc-600 rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition shadow-sm">
                      <LayoutGrid className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </Link>
                  </div>
                ) : (
                  <Link to="/auth" className="bg-zinc-900 text-white px-4 md:px-7 py-2 md:py-2.5 rounded-full hover:bg-zinc-800 transition text-[9px] md:text-[10px] font-black uppercase shadow-lg shadow-black/10">
                    {t('signIn')}
                  </Link>
                )}
                
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className={`p-2 transition-colors rounded-full ${isMenuOpen ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-900'}`}
                >
                  {isMenuOpen ? <X className="w-4 h-4 md:w-5 md:h-5" /> : <Menu className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[105] animate-in fade-in duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-[110] shadow-2xl transition-transform duration-500 ease-in-out transform ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full pt-20 px-4 space-y-3">
          <Link to="/sell" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-4 bg-accent text-white rounded-full font-black text-[10px] uppercase shadow-md group transition-all active:scale-95">
            <div className="flex items-center gap-3">
              <PlusCircle className="w-4 h-4" />
              {t('sellABook')}
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-full text-zinc-900 font-black text-[10px] uppercase shadow-sm group active:scale-95">
            <div className="flex items-center gap-3">
              <Home className="w-4 h-4 text-accent" />
              {t('home')}
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-300 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link to="/about" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-full text-zinc-900 font-black text-[10px] uppercase shadow-sm group active:scale-95">
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-accent" />
              {t('aboutUs')}
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-300 group-hover:translate-x-1 transition-transform" />
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-full text-zinc-900 font-black text-[10px] uppercase shadow-sm group active:scale-95">
                <div className="flex items-center gap-3">
                  <LayoutGrid className="w-4 h-4 text-accent" />
                  {t('dashboard')}
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-300 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button onClick={handleLogout} className="w-full p-4 text-red-600 font-black text-[10px] uppercase bg-red-50 rounded-full text-left flex items-center gap-3 shadow-sm active:scale-95 transition-all">
                <LogOut className="w-4 h-4" />
                {t('logout')}
              </button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="block p-4 bg-zinc-900 text-white rounded-full font-black text-[10px] uppercase text-center shadow-lg active:scale-95 transition-all">
              {t('signIn')}
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;