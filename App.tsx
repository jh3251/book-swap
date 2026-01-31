import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { firebase } from './firebase';
import { UserProfile } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SellPage from './pages/SellPage';
import BookDetailsPage from './pages/BookDetailsPage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsPage from './pages/TermsPage';
import ChatPage from './pages/ChatPage';
import LoadingScreen from './components/LoadingScreen';
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

/**
 * AuthBridge: 
 * Handles cleaning up the URL and ensuring we route to the reset page
 * if the parameters are caught within the React context.
 */
const AuthBridge: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    const code = params.get('oobCode');

    if (mode === 'resetPassword' && code) {
      navigate(`/reset-password?oobCode=${code}`, { replace: true });
    }
  }, [location, navigate]);

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
    return <LoadingScreen />;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <HashRouter>
        <AuthBridge />
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar user={user} onLogout={handleLogout} />
          <main className="flex-grow pt-24 md:pt-32">
            <div className="container mx-auto px-4">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/books/:id" element={<BookDetailsPage />} />
                <Route path="/chat/:id" element={user ? <ChatPage user={user} /> : <Navigate to="/auth" />} />
                <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/sell" element={user ? <SellPage user={user} /> : <Navigate to="/auth" />} />
                <Route path="/dashboard" element={user ? <DashboardPage user={user} /> : <Navigate to="/auth" />} />
                <Route path="/edit/:id" element={user ? <SellPage user={user} /> : <Navigate to="/auth" />} />
                <Route path="*" element={<Navigate to="/" />} />
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