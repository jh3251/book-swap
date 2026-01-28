
import React, { useState, useEffect, useMemo } from 'react';
import { firebase } from '../firebase';
import { BookListing, LocationInfo } from '../types';
import { CLASSES, CONDITIONS, DIVISIONS, DISTRICTS, UPAZILAS } from '../constants';
import BookCard from '../components/BookCard';
import { Search, MapPin, X, PlusCircle, ArrowRight, ChevronRight, ChevronLeft, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../App';
import SEO from '../components/SEO';

const HomePage: React.FC = () => {
  const [listings, setListings] = useState<BookListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [location, setLocation] = useState<Partial<LocationInfo>>({
    divisionId: '',
    districtId: '',
    upazilaId: ''
  });
  
  // Mobile and Desktop both show 10 cards per page as requested
  const getPageSize = () => 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(getPageSize());
  
  const { t, lang } = useTranslation();
  const [heroIdx, setHeroIdx] = useState(0);

  const heroOptions = useMemo(() => [
    { parts: [{ text: 'আপনার বই,', color: 'text-accent' }, { text: 'কারও আশা', color: 'text-red-600' }], isBengali: true },
    { parts: [{ text: 'বই হোক', color: 'text-accent' }, { text: 'কারও ভরসা', color: 'text-red-600' }], isBengali: true },
    { parts: [{ text: 'BoiSathi.com-', color: 'text-accent' }, { text: 'বইসাথী', color: 'text-red-600' }], isBengali: true },
    { parts: [{ text: 'পুরোনো বই,', color: 'text-accent' }, { text: 'নতুন আশা', color: 'text-red-600' }], isBengali: true }
  ], []);

  useEffect(() => {
    const unsubscribe = firebase.db.subscribeToListings((data) => {
      setListings(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % heroOptions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroOptions.length]);

  useEffect(() => {
    const handleResize = () => {
      const newPageSize = getPageSize();
      if (newPageSize !== pageSize) {
        setPageSize(newPageSize);
        setCurrentPage(0);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pageSize]);

  const filteredListings = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return listings.filter(book => {
      const searchStrings = [book.title, book.author, book.subject, book.condition, book.location.upazilaName, book.location.districtName];
      const matchesSearch = !term || searchStrings.some(str => str?.toLowerCase().includes(term));
      const matchesClass = !selectedClass || book.subject === selectedClass;
      const matchesCondition = !selectedCondition || book.condition === selectedCondition;
      const matchesDivision = !location.divisionId || book.location.divisionId === location.divisionId;
      const matchesDistrict = !location.districtId || book.location.districtId === location.districtId;
      const matchesUpazila = !location.upazilaId || book.location.upazilaId === location.upazilaId;
      return matchesSearch && matchesClass && matchesCondition && matchesDivision && matchesDistrict && matchesUpazila;
    });
  }, [listings, searchTerm, location, selectedClass, selectedCondition]);

  const visibleListings = useMemo(() => {
    const start = currentPage * pageSize;
    return filteredListings.slice(start, start + pageSize);
  }, [filteredListings, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredListings.length / pageSize);
  const hasMore = currentPage < totalPages - 1;
  const hasPrevious = currentPage > 0;

  const handleNext = () => { if (hasMore) { setCurrentPage(prev => prev + 1); document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' }); } };
  const handlePrevious = () => { if (hasPrevious) { setCurrentPage(prev => prev - 1); document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' }); } };

  const clearFilters = () => {
    setLocation({ divisionId: '', districtId: '', upazilaId: '' });
    setSearchTerm('');
    setSelectedClass('');
    setSelectedCondition('');
    setCurrentPage(0);
  };

  const currentHero = heroOptions[heroIdx];

  return (
    <div className="space-y-4 md:space-y-10 pb-10">
      <SEO 
        title={lang === 'bn' ? 'পুরোনো বই, নতুন আশা' : 'Buy & Sell Used Books in Bangladesh'} 
        description={lang === 'bn' ? 'BoiSathi.com - বাংলাদেশের শিক্ষার্থীদের জন্য পুরোনো বই কেনাবেচার নির্ভরযোগ্য প্ল্যাটফর্ম।' : 'BoiSathi is the safest student marketplace in Bangladesh for buying and selling used academic books.'}
      />
      
      {/* Restored Dynamic Hero Section */}
      <section className="relative px-4 pt-4 md:pt-10 overflow-hidden rounded-[4rem]">
        <div className="absolute inset-0 alpona-bg opacity-20 -z-10"></div>
        <div className="max-w-5xl mx-auto text-center space-y-4 md:space-y-8 stagger-load">
          <div className="min-h-[5rem] sm:min-h-[8rem] md:min-h-[12rem] flex items-center justify-center overflow-visible">
            <h1 
              key={heroIdx}
              className={`text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] font-serif font-black leading-none tracking-tight animate-reveal-up px-2 py-1 md:py-6 flex flex-col sm:flex-row items-center justify-center gap-y-1 sm:gap-y-0 sm:gap-x-[0.3em] ${currentHero.isBengali ? 'font-bn' : ''}`}
            >
              {currentHero.parts.map((part, i) => (
                <span key={i} className={`${part.color} inline-block transform hover:scale-105 transition-transform`}>
                  {part.text}
                </span>
              ))}
            </h1>
          </div>
          
          <div className="max-w-3xl mx-auto relative pt-0.5">
            <div className="bg-white p-1.5 md:p-3 rounded-[1.2rem] md:rounded-[2rem] shadow-[0_25px_50px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col md:flex-row items-center gap-1.5 transform hover:scale-[1.01] transition-transform">
              <div className="flex-grow flex items-center px-3 md:px-5 w-full">
                <Search className="w-4 h-4 md:w-5 md:h-5 text-zinc-300" />
                <input 
                  type="text"
                  placeholder={lang === 'bn' ? 'বই বা লেখকের নাম লিখুন...' : 'Search for titles, authors or subjects...'}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(0);
                  }}
                  className="w-full px-3 py-2 md:py-3 bg-transparent outline-none font-bold text-slate-900 placeholder:text-slate-200 text-sm md:text-base"
                />
              </div>
              <button onClick={() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full md:w-auto px-5 py-2.5 md:px-8 md:py-4 bg-slate-900 text-white rounded-[0.8rem] md:rounded-[1.5rem] font-black text-[9px] md:text-[11px] uppercase flex items-center justify-center gap-2 md:gap-3 hover:bg-black transition-all shadow-xl active:scale-95 tracking-widest">
                <ArrowRight className="w-3.5 h-3.5" />
                {t('browse')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bento Grid */}
      <section className="container mx-auto max-w-7xl px-4">
        <div className="bg-[#f0fdf9]/60 rounded-[1.2rem] md:rounded-[2rem] p-3 md:p-8 border border-emerald-50 relative overflow-hidden group shadow-sm">
           <div className="flex justify-between items-center mb-3 md:mb-6">
              <h3 className="flex items-center gap-2 text-[9px] md:text-[11px] font-black text-slate-400 uppercase">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-accent" /> {lang === 'bn' ? 'স্থান ও শ্রেণী' : 'FILTERS'}
              </h3>
              <button onClick={clearFilters} className="text-[7px] md:text-[9px] font-black text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 uppercase bg-white/80 px-2 py-1 rounded-md border border-emerald-50 shadow-sm">
                <X className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" /> {t('reset')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
               <div className="space-y-1 md:space-y-2">
                  <label className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase ml-0.5">{t('division')}</label>
                  <select 
                    value={location.divisionId}
                    onChange={(e) => {
                      setLocation({...location, divisionId: e.target.value, districtId: '', upazilaId: ''});
                      setCurrentPage(0);
                    }}
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 bg-white border border-emerald-50/50 rounded-md md:rounded-xl outline-none text-[10px] md:text-[11px] font-bold text-slate-900 appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="">{t('selectDivision')}</option>
                    {DIVISIONS.map(d => <option key={d.id} value={d.id}>{lang === 'bn' ? d.nameBn : d.name}</option>)}
                  </select>
               </div>

               <div className="space-y-1 md:space-y-2">
                  <label className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase ml-0.5">{t('district')}</label>
                  <select 
                    disabled={!location.divisionId}
                    value={location.districtId}
                    onChange={(e) => {
                      setLocation({...location, districtId: e.target.value, upazilaId: ''});
                      setCurrentPage(0);
                    }}
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 bg-white border border-emerald-50/50 rounded-md md:rounded-xl outline-none text-[10px] md:text-[11px] font-bold text-slate-900 appearance-none cursor-pointer shadow-sm disabled:opacity-30"
                  >
                    <option value="">{t('selectDistrict')}</option>
                    {DISTRICTS.filter(d => d.divisionId === location.divisionId).map(d => <option key={d.id} value={d.id}>{lang === 'bn' ? d.nameBn : d.name}</option>)}
                  </select>
               </div>

               <div className="space-y-1 md:space-y-2">
                  <label className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase ml-0.5">{t('upazilaThana')}</label>
                  <select 
                    disabled={!location.districtId}
                    value={location.upazilaId}
                    onChange={(e) => {
                      setLocation({...location, upazilaId: e.target.value});
                      setCurrentPage(0);
                    }}
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 bg-white border border-emerald-50/50 rounded-md md:rounded-xl outline-none text-[10px] md:text-[11px] font-bold text-slate-900 appearance-none cursor-pointer shadow-sm disabled:opacity-30"
                  >
                    <option value="">{t('selectUpazila')}</option>
                    {UPAZILAS.filter(u => u.districtId === location.districtId).map(u => <option key={u.id} value={u.id}>{lang === 'bn' ? u.nameBn : u.name}</option>)}
                  </select>
               </div>

               <div className="space-y-1 md:space-y-2">
                  <label className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase ml-0.5">{t('classLevel')}</label>
                  <select 
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setCurrentPage(0);
                    }}
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 bg-white border border-emerald-50/50 rounded-md md:rounded-xl outline-none text-[10px] md:text-[11px] font-bold text-slate-900 appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="">{t('allClasses')}</option>
                    {CLASSES.map(c => <option key={c} value={c}>{t(c as any)}</option>)}
                  </select>
               </div>

               <div className="space-y-1 md:space-y-2">
                  <label className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase ml-0.5">{lang === 'bn' ? 'অবস্থা' : 'CONDITION'}</label>
                  <select 
                    value={selectedCondition}
                    onChange={(e) => {
                      setSelectedCondition(e.target.value);
                      setCurrentPage(0);
                    }}
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 bg-white border border-emerald-50/50 rounded-md md:rounded-xl outline-none text-[10px] md:text-[11px] font-bold text-slate-900 appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="">{t('allConditions')}</option>
                    {CONDITIONS.map(c => <option key={c} value={c}>{t(c as any)}</option>)}
                  </select>
               </div>

               <div className="flex items-end mt-1 md:mt-0">
                  <button onClick={() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full px-5 py-2 md:px-8 md:py-3 bg-accent text-white rounded-md md:rounded-xl font-black text-[9px] md:text-[11px] uppercase hover:bg-accent-hover shadow-xl active:scale-95 transition-all">
                    {t('find')}
                  </button>
               </div>
            </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results-section" className="container mx-auto max-w-7xl px-4 space-y-1 md:space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1.5 md:gap-4">
          <div className="space-y-0 md:space-y-1">
            <h2 className="text-xl md:text-3xl font-serif font-black text-slate-900 tracking-tight">
              {t('availableBooks')}
            </h2>
            <div className="flex items-center gap-1.5 md:gap-3">
              <span className="w-0.5 h-0.5 rounded-full bg-accent"></span>
              <p className="text-slate-400 font-bold uppercase text-[7px] md:text-[9px]">{filteredListings.length} {lang === 'bn' ? 'টি বই পাওয়া গেছে' : 'results'}</p>
            </div>
          </div>
          
          <Link to="/sell" className="group flex items-center justify-center gap-1.5 bg-emerald-50 text-accent px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-2xl font-black text-[8px] md:text-[10px] uppercase shadow-sm">
            <PlusCircle className="w-3 h-3 md:w-4 md:h-4" />
            Post Ad
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-50 h-28 md:h-40 animate-pulse border border-slate-100"></div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-t border-l border-zinc-100">
              {visibleListings.map(book => (
                <div key={book.id} className="border-r border-b border-zinc-100">
                   <BookCard book={book} />
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 md:gap-6 pt-4 md:pt-6">
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                  {hasPrevious && (
                    <button 
                      onClick={handlePrevious}
                      className="flex items-center gap-1.5 px-4 py-2 md:px-6 md:py-3 bg-white text-zinc-900 border border-zinc-100 rounded-lg md:rounded-xl font-black text-[8px] md:text-[10px] uppercase shadow-md active:scale-95"
                    >
                      <ChevronLeft className="w-3 h-3" /> {lang === 'bn' ? 'আগে' : 'Prev'}
                    </button>
                  )}
                  
                  <div className="flex items-center gap-1.5">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(i);
                          document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-[9px] md:text-[10px] font-black transition-all flex items-center justify-center border ${
                          currentPage === i 
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                            : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  {hasMore && (
                    <button 
                      onClick={handleNext}
                      className="flex items-center gap-1.5 px-4 py-2 md:px-6 md:py-3 bg-zinc-900 text-white rounded-lg md:rounded-xl font-black text-[8px] md:text-[10px] uppercase shadow-md active:scale-95"
                    >
                      {lang === 'bn' ? 'পরে' : 'Next'} <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-[2rem] border-2 border-dashed border-emerald-100 shadow-sm px-6">
            <h3 className="text-xl font-black text-black mb-2">{t('noBooksFound')}</h3>
            <button onClick={clearFilters} className="bg-accent text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] active:scale-95">{t('showEverything')}</button>
          </div>
        )}
      </section>

      {/* Featured Toolsybro Banner */}
      <section className="container mx-auto max-w-7xl px-4 pt-6">
        <div className="bg-[#0f172a] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden relative group p-5 md:p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5 relative z-10 text-center lg:text-left">
            <div className="space-y-3 max-w-xl">
              <h2 className="text-xl md:text-2xl font-serif font-black text-white leading-tight">
                Supercharge your <span className="text-accent italic">Workflow.</span>
              </h2>
              <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
                Toolsybro offers 50+ professional online utilities for students. Convert PDFs, edit images, and organize your studies with one click.
              </p>
            </div>
            <a 
              href="https://toolsybro.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-white text-slate-900 px-6 py-3 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase hover:bg-accent hover:text-white transition-all shadow-xl active:scale-95 flex-shrink-0"
            >
              Visit toolsybro.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
