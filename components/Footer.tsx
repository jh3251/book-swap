
// Add missing React import
import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../App';

const PlayStoreIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      fill="#00A1F1" 
      d="M3.209 1.135A1.892 1.892 0 0 0 3 2.508v18.984c0 .546.21 1.055.572 1.433l.061.055 10.662-10.661L3.633 1.66z"
    />
    <path 
      fill="#F2B200" 
      d="M17.842 14.86l-3.548-3.542-10.662 10.661c.338.352.83.561 1.368.561.493 0 .943-.171 1.303-.456l.044-.035 11.445-6.524a1.88 1.88 0 0 0 .002-3.32z"
    />
    <path 
      fill="#EA4335" 
      d="M3.633 1.66l10.661 10.662 3.548-3.543a1.88 1.88 0 0 0-1.258-3.131 1.88 1.88 0 0 0-1.393.364l-.044.035-11.445 6.523-.069-.91z"
    />
    <path 
      fill="#34A853" 
      d="M14.294 12.322L3.633 1.661a1.88 1.88 0 0 0-.633-.526 1.89 1.89 0 0 0-.209-.085L14.294 12.32z"
      opacity=".2"
    />
    <path 
      fill="#34A853" 
      d="M21.341 10.662l-3.5 1.996-3.547-3.543L17.842 5.57l3.501 1.996a1.88 1.88 0 0 1-.002 3.096z"
    />
  </svg>
);

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

              {/* Android App Coming Soon Block */}
              <div className="mt-10 p-4 md:p-5 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center gap-4 max-w-xs group hover:bg-white/10 transition-all duration-500">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center border border-white/5 shadow-xl group-hover:scale-110 transition-transform">
                  <PlayStoreIcon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.15em] leading-none mb-1.5">{t('appLabel')}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm font-black text-white whitespace-nowrap">{lang === 'bn' ? 'অ্যান্ড্রয়েড অ্যাপ' : 'Android App'}</span>
                    <span className="text-[7px] font-black bg-accent text-white px-2 py-0.5 rounded-full uppercase animate-pulse-soft">
                      {lang === 'bn' ? 'শিঘ্রই' : 'Soon'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-serif font-black uppercase text-[10px] mb-8">
                {t('quickNavigation')}
              </h4>
              <div className="flex flex-col gap-2.5">
                <Link to="/about" className="w-full bg-accent/20 text-white px-6 py-3.5 rounded-2xl font-black text-[9px] uppercase hover:bg-accent transition text-center border border-accent/30">
                  {t('about')}
                </Link>
                <Link to="/privacy" className="w-full bg-[#1c1c1c] text-white px-6 py-3.5 rounded-2xl font-black text-[9px] uppercase hover:bg-zinc-800 transition text-center border border-zinc-800">
                  {lang === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
                </Link>
                <Link to="/terms" className="w-full bg-[#1c1c1c] text-white px-6 py-3.5 rounded-2xl font-black text-[9px] uppercase hover:bg-zinc-800 transition text-center border border-zinc-800">
                  {lang === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Use'}
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
