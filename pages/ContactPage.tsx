
import React from 'react';
import { useTranslation } from '../App';
import { Mail, MessageCircle, MapPin, Globe, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

const ContactPage: React.FC = () => {
  const { lang, t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:py-20 space-y-12">
      <SEO 
        title={t('contactUs')} 
        description="Contact the BoiSathi team for support, feedback, or inquiries."
      />
      
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 text-accent font-black text-[10px] uppercase">
          <Sparkles className="w-3.5 h-3.5" /> {t('contactInfo')}
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-black text-black leading-tight">
          {t('contactUs')}
        </h1>
        <p className="text-lg text-zinc-500 font-medium max-w-2xl mx-auto">
          {t('contactDesc')}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-emerald-50 shadow-sm flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center">
            <Mail className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-black text-black mb-2">{t('emailAddress')}</h3>
            <p className="text-zinc-500 font-bold">boisathi.com@gmail.com</p>
          </div>
          <a href="mailto:boisathi.com@gmail.com" className="bg-accent text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-accent/20 hover:bg-accent-hover transition">
            Send Email
          </a>
        </div>

        <div className="bg-zinc-900 p-8 md:p-10 rounded-[2.5rem] shadow-xl flex flex-col items-center text-center space-y-6 text-white">
          <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-black mb-2">Social Media</h3>
            <p className="text-zinc-400 font-bold">Follow us for updates</p>
          </div>
          <div className="flex gap-4">
             <a href="https://facebook.com/boisathi" target="_blank" className="text-white hover:text-accent transition font-black text-[10px] uppercase">Facebook</a>
             <span className="text-zinc-700">|</span>
             <a href="https://instagram.com/boisathi_com" target="_blank" className="text-white hover:text-accent transition font-black text-[10px] uppercase">Instagram</a>
          </div>
        </div>
      </div>

      <div className="bg-[#f0fdf4] p-10 rounded-[3rem] border border-emerald-100 flex flex-col items-center text-center space-y-4">
        <MapPin className="w-10 h-10 text-accent" />
        <h2 className="text-2xl font-serif font-black text-black">{lang === 'bn' ? 'আমাদের অবস্থান' : 'Our Location'}</h2>
        <p className="text-zinc-600 font-medium">{lang === 'bn' ? 'ঢাকা, বাংলাদেশ (অনলাইন ভিত্তিক কার্যক্রম)' : 'Dhaka, Bangladesh (Online Operations)'}</p>
      </div>
    </div>
  );
};

export default ContactPage;
