
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { firebase } from './firebase';
import { UserProfile } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SellPage from './pages/SellPage';
import BookDetailsPage from './pages/BookDetailsPage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/AboutPage';
import { Loader2 } from 'lucide-react';
import { Language, translations } from './translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useTranslation must be used within LanguageProvider");
  return context;
};

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('bk_lang');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('bk_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged((currUser) => {
      setUser(currUser);
      setTimeout(() => setLoading(false), 800);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await firebase.auth.signOut();
  };

  const t = (key: string): string => {
    if (!key) return '';
    const localizedSet = translations[lang] as any;
    const englishSet = translations['en'] as any;
    return localizedSet[key] || englishSet[key] || key;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-background overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-50/60 rounded-full blur-[120px] animate-pulse-soft"></div>
        <div className="relative flex flex-col items-center gap-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-accent/10 rounded-full blur-3xl scale-150 animate-pulse"></div>
            <div className="absolute -inset-4 border border-emerald-100 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="w-24 h-24 md:w-32 md:h-32 relative z-10 animate-float-slow">
              <img 
                src="https://i.ibb.co/kgjLXphC/book-Converted.png" 
                alt="BoiSathi Logo" 
                className="w-full h-full object-contain drop-shadow-2xl" 
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-5 relative z-10">
            <div className="overflow-hidden">
              <h1 className="text-4xl md:text-5xl font-serif font-black text-black tracking-tight animate-reveal-up">
                BoiSathi<span className="text-accent italic">.com</span>
              </h1>
            </div>
            <div className="w-64 h-1 bg-zinc-100 rounded-full overflow-hidden relative">
              <div className="absolute inset-y-0 bg-accent w-2/3 rounded-full animate-glimmer"></div>
            </div>
            <div className="flex flex-col items-center">
               <p className="text-[10px] font-black text-zinc-400 uppercase animate-pulse">
                {lang === 'bn' ? 'পড়াশোনার সঙ্গী' : 'Your Study Companion'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <HashRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar user={user} onLogout={handleLogout} />
          <main className="flex-grow pt-24 md:pt-32">
            <div className="container mx-auto px-4">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/books/:id" element={<BookDetailsPage />} />
                <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
                <Route path="/sell" element={user ? <SellPage user={user} /> : <Navigate to="/auth" />} />
                <Route path="/dashboard" element={user ? <DashboardPage user={user} /> : <Navigate to="/auth" />} />
                <Route path="/edit/:id" element={user ? <SellPage user={user} /> : <Navigate to="/auth" />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </LanguageContext.Provider>
  );
};

export default App;
