
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { firebase } from './firebase';
import { UserProfile } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SellPage from './pages/SellPage';
import BookDetailsPage from './pages/BookDetailsPage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import { ExternalLink, Loader2, Globe, CheckCircle2 } from 'lucide-react';
import { Language, translations } from './translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useTranslation must be used within LanguageProvider");
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [cloudReady, setCloudReady] = useState(false);
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
      setLoading(false);
    });

    firebase.db.getListings()
      .then(() => {
        setApiError(false);
        setCloudReady(true);
        setTimeout(() => setCloudReady(false), 5000);
      })
      .catch(e => {
        if (e.code === 'permission-denied' || e.code === 'unavailable') {
          setApiError(true);
        }
      });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await firebase.auth.signOut();
    window.dispatchEvent(new Event('auth-change'));
  };

  const t = (key: keyof typeof translations['en']): string => {
    return translations[lang][key] || translations['en'][key];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-accent">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-accent" />
          <p className="font-black text-black text-lg uppercase tracking-widest">BookSwap BD</p>
        </div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <HashRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar user={user} onLogout={handleLogout} />
          
          <main className="flex-grow pt-24 md:pt-32">
            {apiError && (
              <div className="container mx-auto px-4 mb-4">
                <div className="bg-black text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black shadow-xl uppercase tracking-[0.15em]">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Local Community Mode Active</span>
                  <a 
                    href="https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=book-5963d" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-emerald-400 hover:text-white transition border-b border-emerald-400/30"
                  >
                    Sync to Cloud <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
            
            {cloudReady && (
              <div className="container mx-auto px-4 mb-4">
                <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black shadow-xl uppercase tracking-[0.15em] animate-in slide-in-from-top duration-500">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cloud Sync Connected Successfully</span>
                </div>
              </div>
            )}

            <div className="container mx-auto px-4">
              <Routes>
                <Route path="/" element={<HomePage />} />
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
