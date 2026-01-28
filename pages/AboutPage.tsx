
import React from 'react';
import { useTranslation } from '../App';
import { BookOpen, Heart, Globe, Sparkles, BookHeart, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import AdSense from '../components/AdSense';

const AboutPage: React.FC = () => {
  const { lang } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:py-20 space-y-20 font-bn">
      <SEO 
        title={lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About BoiSathi'} 
        description={lang === 'bn' ? 'বইসাথী (BoiSathi.com) - বাংলাদেশের শিক্ষার্থীদের জন্য পুরোনো বই কেনাবেচার একটি কমিউনিটি প্ল্যাটফর্ম।' : 'Learn more about BoiSathi, a student-led initiative to make education affordable in Bangladesh.'}
      />
      
      {/* Hero Section */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-50 rounded-full border border-emerald-100 text-accent font-black text-[11px] uppercase mb-4">
          <Globe className="w-4 h-4" /> আমাদের সম্পর্কে
        </div>
        <h1 className="text-4xl md:text-7xl font-serif font-black text-black leading-tight tracking-tight">
          BoiSathi <span className="text-accent">(বইসাথী)</span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-600 font-medium leading-relaxed max-w-3xl mx-auto">
          একটি শিক্ষার্থী-কেন্দ্রিক অনলাইন প্ল্যাটফর্ম, যেখানে BoiSathi হয়ে ওঠে আপনার পুরোনো বই, নতুন আশা। এখানে পুরোনো বই কেনা, বিক্রি এবং দান করা আরও সহজ।
        </p>
      </section>

      {/* Narrative Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center border border-red-100 shadow-sm">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-black leading-tight">
            একটি বইয়ের অভাব যেন <br/> স্বপ্নকে থামিয়ে না দেয়
          </h2>
          <p className="text-lg text-zinc-600 font-medium leading-relaxed">
            অনেক শিশুর মেধা আছে, স্বপ্ন আছে—কিন্তু একটি বইয়ের অভাবে সেই স্বপ্ন থেমে যায়। BoiSathi সেই শিক্ষার্থীদের জন্য তৈরি করা হয়েছে যারা পড়াশোনার যাত্রায় একজন যোগ্য সঙ্গী খুঁজছেন।
          </p>
          <p className="text-lg text-zinc-600 font-medium leading-relaxed">
            আমরা বিশ্বাস করি, আপনার একটি পুরোনো বই কারও কাছে নতুন আলো হতে পারে। BoiSathi প্ল্যাটফর্মটি মূলত সেই আলো ছড়ানোর জন্য একটি মাধ্যম।
          </p>
        </div>
        <div className="bg-zinc-50 rounded-[3rem] p-10 border border-zinc-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-700"></div>
          <div className="space-y-6 relative z-10">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <p className="text-xl font-bold text-black leading-relaxed italic">
              "বইসাথী শুধু একটি ওয়েবসাইট নয়— এটি পুরোনো বই, নতুন আশা। এখানে লেনদেন মানেই শিক্ষার প্রসার।"
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="space-y-12">
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-serif font-black text-black mb-4">আমাদের মাধ্যমে আপনি—</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <p className="text-lg font-bold text-black leading-tight">কম দামে প্রয়োজনীয় বই খুঁজে পাবেন</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
              <ArrowRight className="w-6 h-6 text-orange-500" />
            </div>
            <p className="text-lg font-bold text-black leading-tight">নিজের পুরোনো বই বিক্রি করতে পারবেন</p>
          </div>
          <div className="bg-zinc-900 p-8 rounded-[2.5rem] shadow-2xl space-y-4 hover:-translate-y-2 transition-transform duration-500">
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center">
              <BookHeart className="w-6 h-6 text-white" />
            </div>
            <p className="text-lg font-bold text-white leading-tight">
              অথবা বই দান করে সুবিধাবঞ্চিত শিক্ষার্থীদের পড়াশোনার আসল 'সাথী' হতে পারবেন
            </p>
          </div>
        </div>
      </section>

      {/* Belief Section */}
      <section className="bg-emerald-50 rounded-[3rem] p-10 md:p-16 border border-emerald-100 text-center space-y-10 relative overflow-hidden group">
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/40 rounded-full blur-3xl"></div>
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <GraduationCap className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-black text-black leading-tight">
            আমাদের দর্শন—
          </h2>
          <div className="space-y-4">
            <p className="text-xl md:text-2xl text-accent font-bold">
              বইসাথী (BoiSathi) মানেই শিক্ষার পথ হবে সহজ।
            </p>
            <p className="text-lg text-zinc-600 font-medium">
              আপনার একটি পুরোনো বই হতে পারে আরেকজনের উজ্জ্বল ভবিষ্যৎ।
            </p>
          </div>
        </div>
      </section>

      {/* AdSense Unit */}
      <AdSense slot="1357924680" />

      {/* Footer Tagline */}
      <section className="text-center pt-10">
        <div className="inline-block px-10 py-6 bg-white border border-zinc-100 rounded-[2rem] shadow-sm">
          <p className="text-2xl md:text-3xl font-serif font-black text-black">
            BoiSathi.com — <span className="text-accent italic">পুরোনো বই, নতুন আশা।</span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
