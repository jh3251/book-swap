
import React from 'react';
import { useTranslation } from '../App';
import { BookOpen, Heart, Users, ShieldCheck, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  const { t, lang } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:py-24 space-y-16 md:space-y-24">
      {/* Header Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 text-accent font-black text-[10px] uppercase tracking-[0.2em] mb-4">
          <Globe className="w-3.5 h-3.5" /> {t('about')}
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-black text-black leading-tight tracking-tight">
          {t('aboutMissionTitle')}
        </h1>
        <p className={`text-xl md:text-2xl text-zinc-600 font-medium leading-relaxed max-w-3xl mx-auto ${lang === 'bn' ? 'font-bn' : ''}`}>
          {t('aboutMissionDesc')}
        </p>
      </section>

      {/* Values Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-50 shadow-xl shadow-emerald-900/5 space-y-6 group hover:border-accent/20 transition-colors">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Heart className="w-7 h-7 text-accent" />
          </div>
          <h3 className="text-2xl font-serif font-black text-black">{t('aboutCommunityTitle')}</h3>
          <p className={`text-zinc-600 font-medium leading-relaxed ${lang === 'bn' ? 'font-bn' : ''}`}>
            {t('aboutCommunityDesc')}
          </p>
        </div>

        <div className="bg-zinc-900 p-10 rounded-[2.5rem] shadow-2xl shadow-black/10 space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform relative z-10">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-serif font-black text-white relative z-10">{lang === 'bn' ? 'আমাদের দৃষ্টিভঙ্গি' : 'Our Vision'}</h3>
          <p className={`text-zinc-400 font-medium leading-relaxed relative z-10 ${lang === 'bn' ? 'font-bn' : ''}`}>
            {lang === 'bn' 
              ? 'আমরা চাই বাংলাদেশের প্রতিটি শিক্ষার্থীর জন্য শিক্ষার উপকরণ যেন সহজলভ্য হয়। অর্থাভাবে কোনো স্বপ্ন যেন অঙ্কুরেই বিনষ্ট না হয়।' 
              : 'We want education materials to be accessible to every student in Bangladesh. No dream should be destroyed because of financial hardship.'}
          </p>
        </div>
      </div>

      {/* Community Stats/Trust Section */}
      <section className="bg-emerald-50 rounded-[3rem] p-10 md:p-16 text-center space-y-10 border border-emerald-100/50">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-serif font-black text-black">
            {lang === 'bn' ? 'একসাথে আমরা আরও শক্তিশালী' : 'Together we are stronger'}
          </h2>
          <p className={`text-zinc-500 font-medium ${lang === 'bn' ? 'font-bn' : ''}`}>
            {lang === 'bn' 
              ? 'বুকসোয়াপ একটি অলাভজনক মানসিকতা নিয়ে তৈরি করা হয়েছে। এটি কেবল একটি ওয়েবসাইট নয়, এটি একটি আন্দোলন।' 
              : 'BookSwap was created with a non-profit mindset. It is not just a website; it is a movement.'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="space-y-2">
            <p className="text-4xl font-serif font-black text-accent">100%</p>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{lang === 'bn' ? 'ফ্রি সার্ভিস' : 'Free Service'}</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-serif font-black text-accent">8+</p>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{lang === 'bn' ? 'বিভাগ কাভার করা হয়েছে' : 'Divisions Covered'}</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-serif font-black text-accent">∞ </p>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{lang === 'bn' ? 'শেয়ার করা জ্ঞান' : 'Knowledge Shared'}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
