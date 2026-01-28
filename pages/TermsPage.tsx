
import React from 'react';
import { useTranslation } from '../App';
import { FileText, UserCheck, AlertTriangle, Scale } from 'lucide-react';
import AdSense from '../components/AdSense';

const TermsPage: React.FC = () => {
  const { lang } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:py-20 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif font-black text-black">
          {lang === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}
        </h1>
        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
          Effective Date: May 20, 2025
        </p>
      </section>

      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-emerald-50 space-y-10 font-medium text-zinc-700 leading-relaxed">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-black">
            <UserCheck className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-serif font-black">{lang === 'bn' ? 'অ্যাকাউন্ট তৈরি' : 'Account Creation'}</h2>
          </div>
          <p>
            {lang === 'bn' 
              ? 'এই সাইটটি ব্যবহারের জন্য আপনাকে একটি অ্যাকাউন্ট তৈরি করতে হবে। আপনি সঠিক তথ্য প্রদান করতে বাধ্য।'
              : 'You must create an account to use most features of this site. You agree to provide accurate and complete information during registration.'}
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-black">
            <Scale className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-serif font-black">{lang === 'bn' ? 'বিজ্ঞাপন নীতি' : 'Listing Policies'}</h2>
          </div>
          <p>
            {lang === 'bn'
              ? 'অশ্লীল, কপিরাইট লঙ্ঘিত বা অবৈধ কোনো বইয়ের বিজ্ঞাপন দেওয়া নিষিদ্ধ। BoiSathi.com যেকোনো সময় বিজ্ঞাপণ ডিলিট করার অধিকার রাখে।'
              : 'Listing inappropriate, copyright-infringing, or illegal books is strictly prohibited. BoiSathi.com reserves the right to remove any listing at its discretion.'}
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-black">
            <AlertTriangle className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-serif font-black">{lang === 'bn' ? 'লেনদেনের ঝুঁকি' : 'Transaction Risks'}</h2>
          </div>
          <p>
            {lang === 'bn'
              ? 'BoiSathi.com সরাসরি কোনো লেনদেনে জড়িত নয়। ক্রেতা এবং বিক্রেতার মধ্যকার যেকোনো সমস্যার জন্য আমরা দায়ী নই।'
              : 'BoiSathi.com does not facilitate payments. We are not responsible for disputes or financial losses occurring during user transactions.'}
          </p>
        </section>
      </div>

      <AdSense slot="1122334455" />
    </div>
  );
};

export default TermsPage;
