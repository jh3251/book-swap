
// Add missing React import
import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../App';

const Footer: React.FC = () => {
  const { t, lang } = useTranslation();

  return (
    <footer className="relative mt-20">
      <div className="container mx-auto px-4 max-w-5xl mb-16">
        <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-2xl shadow-emerald-900/5 border border-emerald-50 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <p className="text-zinc-800 font-bold text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
             {lang === 'bn' 
               ? 'আপনার পড়াশোনার সঙ্গীকে খুঁজে নিন অথবা পুরোনো বইগুলো দিয়ে অন্যের সঙ্গী হোন।' 
               : 'Find your study companion or help others by sharing your pre-loved books today.'}
           </p>
           <div className="flex flex-col sm:flex-row gap-3 justify-center">
             <Link to="/" className="bg-accent text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase hover:bg-accent-hover transition shadow-xl shadow-accent/20">
               {t('browse')}
             </Link>
             <Link to="/sell" className="bg-zinc-900 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase hover:bg-zinc-800 transition shadow-xl shadow-black/10">
               {t('sellABook')}
             </Link>
           </div>
        </div>
      </div>

      <div className="bg-black text-zinc-400 py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="logo-blob">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img 
                      src="https://i.ibb.co/kgjLXphC/book-Converted.png" 
                      alt="BoiSathi Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <span className="text-xl font-black font-serif text-white tracking-tight">
                  {lang === 'bn' ? 'বইসাথী (BoiSathi)' : 'BoiSathi.com'}
                </span>
              </div>
              <p className="max-w-md text-[12px] leading-relaxed font-medium text-white">
                {t('footerDesc')}
              </p>
              <div className="flex space-x-4 mt-8">
                <a 
                  href="https://www.facebook.com/profile.php?id=61587380480244" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center hover:opacity-80 hover:scale-110 transition-all duration-300 shadow-lg shadow-accent/20"
                >
                  <Facebook className="w-4 h-4 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center hover:opacity-80 hover:scale-110 transition-all duration-300 shadow-lg shadow-accent/20"
                >
                  <Instagram className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-serif font-black uppercase text-[10px] mb-8">
                {t('quickNavigation')}
              </h4>
              <div className="flex flex-col gap-2.5">
                <Link to="/about" className="w-full bg-accent text-white px-6 py-3.5 rounded-2xl font-black text-[9px] uppercase hover:bg-accent-hover transition text-center shadow-lg shadow-accent/20">
                  {t('about')}
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-serif font-black uppercase text-[10px] mb-8">
                {t('studentSupport')}
              </h4>
              <div className="flex flex-col gap-2.5">
                <Link to="/" className="w-full bg-accent text-white px-6 py-3.5 rounded-2xl font-black text-[9px] uppercase hover:bg-accent-hover transition text-center shadow-lg shadow-accent/20">
                  {t('browse')}
                </Link>
                <Link to="/sell" className="w-full bg-[#1c1c1c] text-white px-6 py-3.5 rounded-2xl font-black text-[9px] uppercase border border-zinc-800 hover:bg-zinc-800 transition text-center shadow-lg shadow-black/10">
                  {t('sellABook')}
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] font-black uppercase text-white">
            <p>{t('copyright')}</p>
            <p className="flex items-center gap-1.5">
              {t('craftedFor')} <span className="text-accent">{t('knowledgeExchange')}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
