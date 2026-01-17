
import React from 'react';
import { BookOpen, Github, Twitter, Mail, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-zinc-400 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-accent p-2 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black font-serif text-white">BookSwap BD</span>
            </div>
            <p className="max-w-md text-sm leading-relaxed font-medium">
              Empowering students across Bangladesh to exchange knowledge. We are the premier community-driven marketplace for academic and leisure reading.
            </p>
            <div className="flex space-x-4 mt-8">
              <a href="#" className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center hover:bg-accent hover:text-white transition group">
                <Twitter className="w-5 h-5 group-hover:scale-110 transition" />
              </a>
              <a href="#" className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center hover:bg-accent hover:text-white transition group">
                <Instagram className="w-5 h-5 group-hover:scale-110 transition" />
              </a>
              <a href="#" className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center hover:bg-accent hover:text-white transition group">
                <Github className="w-5 h-5 group-hover:scale-110 transition" />
              </a>
              <a href="#" className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center hover:bg-accent hover:text-white transition group">
                <Mail className="w-5 h-5 group-hover:scale-110 transition" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Quick Navigation</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="#" className="hover:text-accent transition">Search Books</a></li>
              <li><a href="#" className="hover:text-accent transition">Our Mission</a></li>
              <li><a href="#" className="hover:text-accent transition">Student Safety</a></li>
              <li><a href="#" className="hover:text-accent transition">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Student Support</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="#" className="hover:text-accent transition">Report a Seller</a></li>
              <li><a href="#" className="hover:text-accent transition">Terms & Privacy</a></li>
              <li><a href="#" className="hover:text-accent transition">Technical Help</a></li>
              <li><a href="#" className="hover:text-accent transition">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-900 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest">
          <p>© {new Date().getFullYear()} BookSwap Bangladesh. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted for <span className="text-emerald-500">knowledge exchange</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
