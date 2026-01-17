
import React, { useState, useEffect, useMemo } from 'react';
import { firebase } from '../firebase';
import { BookListing, LocationInfo } from '../types';
import { CLASSES, CONDITIONS } from '../constants';
import BookCard from '../components/BookCard';
import LocationSelector from '../components/LocationSelector';
import { Search, MapPin, SlidersHorizontal, X, LayoutGrid, BookCopy, ShieldCheck, BookOpen, PlusCircle, ArrowRight, GraduationCap, ClipboardCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../App';

const HomePage: React.FC = () => {
  const [listings, setListings] = useState<BookListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [location, setLocation] = useState<Partial<LocationInfo>>({});
  const [showFilters, setShowFilters] = useState(true); 
  const { t, lang } = useTranslation();

  useEffect(() => {
    const unsubscribe = firebase.db.subscribeToListings((data) => {
      setListings(data);
      setLoading(false);
    });

    const handleAuthChange = () => {
      firebase.db.getListings().then(setListings);
    };
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      unsubscribe();
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const filteredListings = useMemo(() => {
    return listings.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClass = !selectedClass || book.subject === selectedClass;
      const matchesCondition = !selectedCondition || book.condition === selectedCondition;
      const matchesDivision = !location.divisionId || book.location.divisionId === location.divisionId;
      const matchesDistrict = !location.districtId || book.location.districtId === location.districtId;
      const matchesUpazila = !location.upazilaId || book.location.upazilaId === location.upazilaId;
      
      return matchesSearch && matchesClass && matchesCondition && matchesDivision && matchesDistrict && matchesUpazila;
    });
  }, [listings, searchTerm, location, selectedClass, selectedCondition]);

  const clearFilters = () => {
    setLocation({});
    setSearchTerm('');
    setSelectedClass('');
    setSelectedCondition('');
  };

  const handleSearchClick = () => {
    const resultsElement = document.getElementById('results-section');
    resultsElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-20 md:pb-32 max-w-7xl mx-auto px-4">
      {/* Modern Hero Section */}
      <section className="relative text-center py-16 md:py-28 px-4 overflow-hidden">
         {/* Decorative Background Elements */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full bg-emerald-50/40 rounded-full blur-[100px] -z-10"></div>
         <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -z-10 animate-pulse"></div>
         
         <div className="relative z-10 space-y-8">
            <h1 className={`text-6xl md:text-9xl font-serif font-black text-black leading-[1] tracking-tighter ${lang === 'bn' ? 'font-bn' : ''}`}>
              {t('findYour')} <br/> 
              <span className="text-accent relative inline-block">
                {t('books')}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                </svg>
              </span>
            </h1>
            
            <p className="text-zinc-400 font-black max-w-2xl mx-auto text-xs md:text-sm uppercase tracking-[0.3em] leading-relaxed">
              {t('safestMarketplace')}
            </p>

            {/* Floating Search Bar */}
            <div className="max-w-3xl mx-auto pt-10">
               <div className="bg-white/80 backdrop-blur-xl p-3 rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-white/40 flex flex-col md:flex-row items-center gap-3">
                 <div className="flex-grow flex items-center pl-6 w-full group">
                   <Search className="w-6 h-6 text-zinc-300 group-focus-within:text-accent transition-colors" />
                   <input 
                     type="text"
                     placeholder={t('lookingFor')}
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full px-6 py-5 bg-transparent outline-none font-bold text-black placeholder:text-zinc-300 text-lg"
                   />
                 </div>
                 <button 
                   onClick={() => setShowFilters(!showFilters)}
                   className={`flex items-center justify-center gap-3 w-full md:w-auto px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-95 ${
                     showFilters ? 'bg-accent text-white shadow-xl shadow-accent/20' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                   }`}
                 >
                   <SlidersHorizontal className="w-5 h-5" />
                   {t('filters')}
                 </button>
               </div>
            </div>
         </div>

         {/* Bento-Style Advanced Filters */}
         <div className={`mt-12 md:mt-16 transition-all duration-700 ease-in-out ${showFilters ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-95 pointer-events-none absolute'}`}>
            <div className="bg-white rounded-[3rem] p-8 md:p-14 text-left shadow-3xl shadow-emerald-900/5 border border-emerald-50 max-w-5xl mx-auto relative group">
               {/* Decorative Gradient Overlay */}
               <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -z-10 group-hover:bg-accent/10 transition-colors"></div>
               
               <div className="flex justify-between items-center mb-12">
                  <h3 className="flex items-center gap-4 text-2xl md:text-3xl font-serif font-black text-black">
                    <MapPin className="w-8 h-8 text-accent" /> {t('location')}
                  </h3>
                  <button 
                   onClick={clearFilters}
                   className="text-[10px] font-black text-zinc-400 hover:text-red-500 transition uppercase tracking-[0.2em] flex items-center gap-2 border-b-2 border-transparent hover:border-red-100 pb-1"
                  >
                    <X className="w-4 h-4" /> {t('reset')}
                  </button>
               </div>

               {/* Location Tile Grid */}
               <LocationSelector value={location} onChange={(loc) => setLocation(loc)} />

               {/* Class & Condition Bento Section */}
               <div className="mt-16 pt-12 border-t border-emerald-50">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   {/* Class Level Bento Card */}
                   <div className="space-y-10">
                     <h3 className="flex items-center gap-4 text-2xl md:text-3xl font-serif font-black text-black">
                       <GraduationCap className="w-8 h-8 text-accent" /> {t('classLevel')}
                     </h3>
                     <div className="bg-emerald-50/30 p-8 rounded-[2rem] border border-emerald-50">
                        <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4 ml-1">{t('academicLevel')}</label>
                        <div className="relative">
                          <select 
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full px-8 py-6 bg-white border border-emerald-100 rounded-2xl focus:ring-4 focus:ring-accent/10 outline-none font-black text-black text-lg transition-all appearance-none cursor-pointer"
                          >
                            <option value="">{t('allClasses')}</option>
                            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-accent rotate-90" />
                        </div>
                     </div>
                   </div>

                   {/* Condition Bento Card */}
                   <div className="space-y-10">
                     <h3 className="flex items-center gap-4 text-2xl md:text-3xl font-serif font-black text-black">
                       <ClipboardCheck className="w-8 h-8 text-accent" /> {t('condition')}
                     </h3>
                     <div className="bg-emerald-50/30 p-8 rounded-[2rem] border border-emerald-50">
                        <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4 ml-1">{t('condition')}</label>
                        <div className="relative">
                          <select 
                            value={selectedCondition}
                            onChange={(e) => setSelectedCondition(e.target.value)}
                            className="w-full px-8 py-6 bg-white border border-emerald-100 rounded-2xl focus:ring-4 focus:ring-accent/10 outline-none font-black text-black text-lg transition-all appearance-none cursor-pointer"
                          >
                            <option value="">{t('allConditions')}</option>
                            {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-accent rotate-90" />
                        </div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Floating Find Button */}
               <div className="mt-16 flex justify-center">
                  <button 
                    onClick={handleSearchClick}
                    className="group relative flex items-center justify-center gap-6 bg-accent text-white px-16 py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] shadow-3xl shadow-accent/40 hover:bg-accent-hover transition-all transform hover:-translate-y-2 active:scale-95"
                  >
                    <Search className="w-6 h-6 group-hover:scale-125 transition-transform" />
                    {t('find')}
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* Modern Results Section */}
      <div id="results-section" className="scroll-mt-32">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white shadow-2xl rounded-3xl border border-emerald-50 flex items-center justify-center">
               <LayoutGrid className="w-8 h-8 text-black" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-black text-black leading-tight">{t('availableBooks')}</h2>
              <div className="h-1.5 w-24 bg-accent mt-3 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-[3rem] aspect-[4/5] animate-pulse border border-emerald-50 shadow-sm"></div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredListings.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[4rem] border-4 border-dashed border-emerald-50 shadow-inner px-10">
            <BookCopy className="w-24 h-24 text-emerald-100 mx-auto mb-10 animate-float" />
            <h3 className="text-4xl font-serif font-black text-black mb-6">{t('noBooksFound')}</h3>
            <p className="text-zinc-400 font-black max-w-md mx-auto text-xs uppercase tracking-widest leading-loose">{t('tryDifferent')}</p>
            <button onClick={clearFilters} className="mt-14 bg-black text-white px-16 py-6 rounded-[2.5rem] font-black hover:bg-zinc-800 transition-all shadow-3xl uppercase tracking-[0.3em] text-xs">
              {t('showEverything')}
            </button>
          </div>
        )}
      </div>

      {/* Premium How it Works Section */}
      <section className="pt-24 md:pt-32 border-t border-emerald-100/50">
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 bg-emerald-50 text-accent rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-accent/10">
            {t('empoweringStudents')}
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-black text-black leading-tight">{t('howItWorks')}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Buyer Card */}
          <div className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-emerald-50 shadow-3xl shadow-emerald-900/5 group hover:border-accent/20 transition-all duration-500">
            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
              <BookOpen className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-3xl font-serif font-black text-black mb-8">{t('buyABook')}</h3>
            <div className="space-y-8">
              {[1, 2, 3].map(step => (
                <div key={step} className="flex items-start gap-6 group/step">
                  <div className="w-8 h-8 bg-black text-white rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 mt-1 transition-transform group-hover/step:rotate-12">{step}</div>
                  <p className="text-zinc-600 font-medium leading-relaxed text-lg">
                    {lang === 'bn' 
                      ? (step === 1 ? "আপনার স্থানীয় এলাকায় বইয়ের জন্য ফিড ব্রাউজ করুন।" : step === 2 ? "বইয়ের প্রাপ্যতা যাচাই করতে সরাসরি বিক্রেতাকে কল করুন।" : "বইটি পরিদর্শন এবং মূল্য পরিশোধ করতে জনসমক্ষে দেখা করুন।")
                      : (step === 1 ? "Browse the feed for books in your local area." : step === 2 ? "Call the seller directly to check availability." : "Meet in public to inspect and pay for the book.")
                    }
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Seller Card */}
          <div className="bg-black rounded-[3.5rem] p-10 md:p-16 shadow-4xl shadow-black/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-[120px] -z-0"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-accent/40 group-hover:scale-110 transition-transform duration-500">
                <PlusCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-serif font-black text-white mb-8">{t('sellABookTitle')}</h3>
              <div className="space-y-8 mb-12">
                {[1, 2, 3].map(step => (
                  <div key={step} className="flex items-start gap-6 group/step">
                    <div className="w-8 h-8 bg-white text-black rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 mt-1 transition-transform group-hover/step:rotate-12">{step}</div>
                    <p className="text-zinc-300 font-medium leading-relaxed text-lg">
                      {lang === 'bn' 
                        ? (step === 1 ? "সাইন আপ করুন এবং আপনার যাচাইকৃত স্টুডেন্ট প্রোফাইল তৈরি করুন।" : step === 2 ? "বইয়ের বিশদ বিবরণ এবং পরিষ্কার কভার ফটো আপলোড করুন।" : "কল পান এবং স্থানীয় শিক্ষার্থীদের কাছে বিক্রি করুন।")
                        : (step === 1 ? "Sign up and create your verified student profile." : step === 2 ? "Upload book details and clear cover photos." : "Receive calls and sell to local students.")
                      }
                    </p>
                  </div>
                ))}
              </div>
              <Link to="/sell" className="inline-flex items-center gap-4 bg-white text-black px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-50 transition-all transform hover:-translate-y-2 shadow-2xl">
                {t('startSelling')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
