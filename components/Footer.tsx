
import React from 'react';
import { Github, Twitter, Mail, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../App';

const Footer: React.FC = () => {
  const { t, lang } = useTranslation();

  return (
    <footer className="relative mt-20">
      {/* Global CTA Card */}
      <div className="container mx-auto px-4 max-w-5xl mb-16">
        <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl shadow-emerald-900/5 border border-emerald-50 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <p className="text-zinc-800 font-bold text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
             {lang === 'bn' 
               ? 'আজই আপনার পুরনো বইগুলো অন্যকে দিন অথবা আপনার প্রয়োজনীয় বইটি খুঁজে নিন।' 
               : 'Donate your old books or find the book you need today.'}
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link to="/" className="bg-accent text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-accent-hover transition shadow-xl shadow-accent/20">
               {t('browse')}
             </Link>
             <Link to="/sell" className="bg-zinc-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition shadow-xl shadow-black/10">
               {t('sellABook')}
             </Link>
           </div>
        </div>
      </div>

      <div className="bg-black text-zinc-400 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-8">
                <div className="logo-blob">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img 
                      src="https://i.ibb.co/kgjLXphC/book-Converted.png" 
                      alt="BookSwap Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <span className="text-2xl font-black font-serif text-white tracking-tight">BookSwap BD</span>
              </div>
              <p className="max-w-md text-[13px] leading-relaxed font-medium text-zinc-500">
                Empowering students across Bangladesh to exchange knowledge. We are the premier community-driven marketplace for academic and leisure reading.
              </p>
              <div className="flex space-x-4 mt-10">
                <a href="#" className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center hover:bg-accent hover:text-white transition group">
                  <Twitter className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:scale-110 transition" />
                </a>
                <a href="#" className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center hover:bg-accent hover:text-white transition group">
                  <Instagram className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:scale-110 transition" />
                </a>
                <a href="#" className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center hover:bg-accent hover:text-white transition group">
                  <Github className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:scale-110 transition" />
                </a>
                <a href="#" className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center hover:bg-accent hover:text-white transition group">
                  <Mail className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:scale-110 transition" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-serif font-black uppercase tracking-[0.2em] text-[11px] mb-10">QUICK NAVIGATION</h4>
              <ul className="space-y-4 text-[13px] font-bold">
                <li><Link to="/about" className="hover:text-white transition text-zinc-500">About Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-serif font-black uppercase tracking-[0.2em] text-[11px] mb-10">STUDENT SUPPORT</h4>
              <div className="flex flex-col gap-3">
                <Link to="/" className="w-full bg-accent text-white px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent-hover transition text-center shadow-lg shadow-accent/20">
                  {t('browse')}
                </Link>
                <Link to="/sell" className="w-full bg-[#1c1c1c] text-white px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-zinc-800 hover:bg-zinc-800 transition text-center shadow-lg shadow-black/10">
                  {t('sellABook')}
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-zinc-900 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">
            <p>© 2026 BOOKSWAP BANGLADESH. ALL RIGHTS RESERVED.</p>
            <p className="flex items-center gap-1.5">
              CRAFTED FOR <span className="text-accent">KNOWLEDGE EXCHANGE</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
