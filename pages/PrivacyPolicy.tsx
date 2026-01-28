
import React from 'react';
import { useTranslation } from '../App';
import { ShieldCheck, Eye, Lock, Globe, Cookie } from 'lucide-react';
import SEO from '../components/SEO';

const PrivacyPolicy: React.FC = () => {
  const { lang, t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:py-20 space-y-12">
      <SEO 
        title={lang === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'} 
        description="Learn how BoiSathi.com handles and protects your data."
      />
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif font-black text-black">
          {lang === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
        </h1>
        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
          Last Updated: March 2025
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
              : 'BoiSathi.com collects your name, email, and phone number when you create a profile. This information is used solely to facilitate the buying and selling of books within the student community.'}
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-black">
            <Cookie className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-serif font-black">{lang === 'bn' ? 'কুকি এবং বিজ্ঞাপন' : 'Cookies and Advertising'}</h2>
          </div>
          <p>
            {lang === 'bn'
              ? 'গুগলসহ তৃতীয় পক্ষের বিক্রেতারা আমাদের সাইটে আপনার পূর্ববর্তী ভিজিটের ওপর ভিত্তি করে বিজ্ঞাপন দেখানোর জন্য কুকি ব্যবহার করে। গুগল কর্তৃক এডভার্টাইজিং কুকি ব্যবহারের ফলে গুগল এবং এর অংশীদাররা ব্যবহারকারীদের এই সাইট এবং/অথবা ইন্টারনেটের অন্যান্য সাইট ভিজিটের ওপর ভিত্তি করে বিজ্ঞাপন দেখাতে পারে।'
              : 'Google and other third-party vendors use cookies to serve ads based on a user\'s prior visits to your website or other websites. Google\'s use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.'}
          </p>
          <p>
            {lang === 'bn'
              ? 'ব্যবহারকারীরা Ads Settings ভিজিট করে পার্সোনালাইজড বিজ্ঞাপনের ব্যবহার বন্ধ করতে পারেন।'
              : 'Users may opt out of personalized advertising by visiting Ads Settings. Alternatively, you can opt out of a third-party vendor\'s use of cookies for personalized advertising by visiting www.aboutads.info.'}
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
              : 'We take the security of your data seriously. Your passwords and personal data are protected by industry-standard Firebase security protocols and cloud infrastructure.'}
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
    </div>
  );
};

export default PrivacyPolicy;
