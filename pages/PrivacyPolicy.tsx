
import React from 'react';
import { useTranslation } from '../App';
import { ShieldCheck, Eye, Lock, Globe } from 'lucide-react';
import AdSense from '../components/AdSense';

const PrivacyPolicy: React.FC = () => {
  const { lang } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:py-20 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif font-black text-black">
          {lang === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
        </h1>
        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
          Last Updated: May 20, 2025
        </p>
      </section>

      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-emerald-50 space-y-10 font-medium text-zinc-700 leading-relaxed">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-black">
            <Globe className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-serif font-black">{lang === 'bn' ? 'তথ্য সংগ্রহ' : 'Information Collection'}</h2>
          </div>
          <p>
            {lang === 'bn' 
              ? 'BoiSathi.com আপনার প্রোফাইল তৈরি করার সময় আপনার নাম, ইমেইল এবং ফোন নম্বর সংগ্রহ করে। এটি শুধুমাত্র আমাদের সেবা প্রদানের জন্য ব্যবহৃত হয়।'
              : 'BoiSathi.com collects your name, email, and phone number when you create a profile. This information is used solely to facilitate the buying and selling of books.'}
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-black">
            <Lock className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-serif font-black">{lang === 'bn' ? 'ডেটা সুরক্ষা' : 'Data Protection'}</h2>
          </div>
          <p>
            {lang === 'bn'
              ? 'আমরা আপনার তথ্যের নিরাপত্তা গুরুত্ব সহকারে গ্রহণ করি। আপনার পাসওয়ার্ড এবং ব্যক্তিগত ডেটা ফায়ারবেস সিকিউরিটি প্রোটোকল দ্বারা সুরক্ষিত থাকে।'
              : 'We take the security of your data seriously. Your passwords and personal data are protected by industry-standard Firebase security protocols.'}
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-black">
            <ShieldCheck className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-serif font-black">{lang === 'bn' ? 'যোগাযোগ' : 'Contact Us'}</h2>
          </div>
          <p>
            {lang === 'bn'
              ? 'গোপনীয়তা নীতি সংক্রান্ত কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন: boisathi.com@gmail.com'
              : 'If you have any questions about our Privacy Policy, please contact us at: boisathi.com@gmail.com'}
          </p>
        </section>
      </div>

      <AdSense slot="2468013579" />
    </div>
  );
};

export default PrivacyPolicy;
