
import React from 'react';
import { BookOpen, Github, Twitter, Mail, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../App';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-black text-zinc-400 py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-accent p-2 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
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
            <h4 className="text-white font-serif font-black uppercase tracking-[0.2em] text-[11px] mb-10">Quick Navigation</h4>
            <ul className="space-y-4 text-[13px] font-bold">
              <li><Link to="/" className="hover:text-white transition">Search Books</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><a href="#" className="hover:text-white transition">Student Safety</a></li>
              <li><a href="#" className="hover:text-white transition">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-serif font-black uppercase tracking-[0.2em] text-[11px] mb-10">Student Support</h4>
            <ul className="space-y-4 text-[13px] font-bold">
              <li><a href="#" className="hover:text-white transition">Report a Seller</a></li>
              <li><a href="#" className="hover:text-white transition">Terms & Privacy</a></li>
              <li><a href="#" className="hover:text-white transition">Technical Help</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-900 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">
          <p>© 2026 BOOKSWAP BANGLADESH. ALL RIGHTS RESERVED.</p>
          <p className="flex items-center gap-1.5">
            CRAFTED FOR <span className="text-accent">KNOWLEDGE EXCHANGE</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
