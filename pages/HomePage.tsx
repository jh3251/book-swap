
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
  const [showFilters, setShowFilters] = useState(false); 
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
    <div className="space-y-12 md:space-y-16 pb-20 md:pb-32 max-w-7xl mx-auto px-4">
      {/* Modern Hero Section */}
      <section className="relative text-center py-10 md:py-16 px-4 overflow-hidden">
         {/* Abstract background scribbles as seen in screenshot */}
         <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-100/20 rounded-full blur-[80px] -z-10 animate-float"></div>
         <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-[0.03]">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M-10,30 Q10,10 30,30 T70,30" fill="none" stroke="black" strokeWidth="0.5" />
             <path d="M-5,70 Q20,90 40,70 T90,70" fill="none" stroke="black" strokeWidth="0.5" />
           </svg>
         </div>
         
         <div className="relative z-10 space-y-4 md:space-y-6">
            <h1 className={`text-7xl md:text-[9.5rem] font-serif font-black text-black leading-[0.9] tracking-tighter ${lang === 'bn' ? 'font-bn' : ''}`}>
              {t('findYour')} <br/> 
              <span className="text-accent">
                {t('books')}.
              </span>
            </h1>
            
            <p className="text-zinc-400 font-black max-w-2xl mx-auto text-[9px] md:text-[11px] uppercase tracking-[0.4em] leading-relaxed">
              {t('safestMarketplace')}
            </p>

            <div className="max-w-2xl mx-auto pt-6">
               <div className="bg-white p-2 rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-emerald-50 flex flex-col md:flex-row items-center gap-2">
                 <div className="flex-grow flex items-center pl-5 w-full group">
                   <Search className="w-5 h-5 text-zinc-300 group-focus-within:text-accent transition-colors" />
                   <input 
                     type="text"
                     placeholder={t('lookingFor')}
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full px-4 py-3.5 bg-transparent outline-none font-bold text-black placeholder:text-zinc-300 text-sm md:text-base"
                   />
                 </div>
                 <button 
                   onClick={() => setShowFilters(!showFilters)}
                   className={`flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3.5 rounded-[1.5rem] font-black text-[9px] uppercase tracking-[0.2em] transition-all transform active:scale-95 ${
                     showFilters ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100'
                   }`}
                 >
                   <SlidersHorizontal className="w-4 h-4" />
                   {t('filters')}
                 </button>
               </div>
            </div>
         </div>

         <div className={`mt-8 transition-all duration-500 ease-in-out ${showFilters ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none absolute h-0 overflow-hidden'}`}>
            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 text-left shadow-2xl shadow-emerald-900/5 border border-emerald-50 max-w-4xl mx-auto">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="flex items-center gap-3 text-xl md:text-2xl font-serif font-black text-black">
                    <MapPin className="w-6 h-6 text-accent" /> {t('location')}
                  </h3>
                  <button onClick={clearFilters} className="text-[9px] font-black text-zinc-300 hover:text-red-500 transition uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <X className="w-3.5 h-3.5" /> {t('reset')}
                  </button>
               </div>
               <LocationSelector value={location} onChange={(loc) => setLocation(loc)} />
               <div className="mt-10 flex justify-center">
                  <button onClick={handleSearchClick} className="group flex items-center justify-center gap-4 bg-accent text-white px-12 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-accent/20 hover:bg-accent-hover transition-all transform active:scale-95">
                    <Search className="w-5 h-5" />
                    {t('find')}
                  </button>
               </div>
            </div>
         </div>
      </section>

      <div id="results-section" className="scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white shadow-xl rounded-2xl border border-emerald-50 flex items-center justify-center">
               <LayoutGrid className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-black text-black leading-tight">{t('availableBooks')}</h2>
              <div className="h-1 w-12 bg-accent mt-1 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] aspect-[4/5] animate-pulse border border-emerald-50 shadow-sm"></div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-emerald-50 shadow-inner px-8">
            <BookCopy className="w-16 h-16 text-emerald-100 mx-auto mb-6 animate-float" />
            <h3 className="text-2xl font-serif font-black text-black mb-4">{t('noBooksFound')}</h3>
            <button onClick={clearFilters} className="mt-8 bg-black text-white px-10 py-4 rounded-2xl font-black hover:bg-zinc-800 transition-all shadow-xl uppercase tracking-[0.2em] text-[10px]">
              {t('showEverything')}
            </button>
          </div>
        )}
      </div>

      {/* How it Works Section Updated for Screenshot Accuracy */}
      <section className="pt-16 md:pt-24 border-t border-emerald-50">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-emerald-50 text-accent rounded-full text-[9px] font-black uppercase tracking-[0.3em] mb-4 border border-accent/10">
            {t('empoweringStudents')}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-black text-black leading-tight">{t('howItWorks')}</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Buyer Card */}
          <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-emerald-50 shadow-2xl shadow-emerald-900/5">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 border border-emerald-100">
               <BookOpen className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-3xl font-serif font-black text-black mb-8">{t('buyABook')}</h3>
            <div className="space-y-6">
              {[1, 2, 3].map(step => (
                <div key={step} className="flex items-start gap-4">
                  <div className="w-7 h-7 bg-black text-white rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0 mt-1">{step}</div>
                  <p className="text-zinc-500 font-medium leading-relaxed text-base">
                    {lang === 'bn' 
                      ? (step === 1 ? "আপনার স্থানীয় এলাকায় বইয়ের জন্য ফিড ব্রাউজ করুন।" : step === 2 ? "বইয়ের প্রাপ্যতা যাচাই করতে সরাসরি বিক্রেতাকে কল করুন।" : "বইটি পরিদর্শন এবং মূল্য পরিশোধ করতে জনসমক্ষে দেখা করুন।")
                      : (step === 1 ? "Browse the feed for books in your local area." : step === 2 ? "Call the seller directly to check availability." : "Meet in public to inspect and pay for the book.")
                    }
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Seller Card (Fixed with White Text and Green Blob) */}
          <div className="bg-black rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-black/20 relative overflow-hidden group">
            {/* Background Blob matching screenshot */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-900/40 rounded-full blur-[80px] -z-0"></div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-accent/20">
                 <PlusCircle className="w-7 h-7 text-white" />
              </div>
              {/* Heading specifically fixed to be white */}
              <h3 className="text-3xl font-serif font-black text-white mb-8">{t('sellABookTitle')}</h3>
              
              <div className="space-y-6 mb-10">
                {[1, 2, 3].map(step => (
                  <div key={step} className="flex items-start gap-4">
                    <div className="w-7 h-7 bg-white text-black rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0 mt-1">{step}</div>
                    <p className="text-zinc-300 font-medium leading-relaxed text-base">
                      {lang === 'bn' 
                        ? (step === 1 ? "সাইন আপ করুন এবং আপনার যাচাইকৃত স্টুডেন্ট প্রোফাইল তৈরি করুন।" : step === 2 ? "বইয়ের বিশদ বিবরণ এবং পরিষ্কার কভার ফটো আপলোড করুন।" : "কল পান এবং স্থানীয় শিক্ষার্থীদের কাছে বিক্রি করুন।")
                        : (step === 1 ? "Sign up and create your verified student profile." : step === 2 ? "Upload book details and clear cover photos." : "Receive calls and sell to local students.")
                      }
                    </p>
                  </div>
                ))}
              </div>
              <Link to="/sell" className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-[1.25rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-50 transition-all transform active:scale-95 shadow-xl">
                {t('startSelling')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
