
import React, { useState, useEffect, useMemo } from 'react';
import { firebase } from '../firebase';
import { BookListing, LocationInfo } from '../types';
import { CLASSES, CONDITIONS, DIVISIONS, DISTRICTS, UPAZILAS } from '../constants';
import BookCard from '../components/BookCard';
import { Search, MapPin, X, PlusCircle, ArrowRight, ExternalLink, Sparkles, CheckCircle2, BookOpen, BookHeart, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../App';

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
  
  // Pagination logic: 8 for desktop, 5 for mobile
  const getPageSize = () => window.innerWidth < 768 ? 5 : 8;
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(getPageSize());
  
  const { t, lang } = useTranslation();

  // Hero Animation State
  const [heroIdx, setHeroIdx] = useState(0);
  
  const heroOptions = useMemo(() => [
    { 
      parts: [
        { text: 'আপনার বই,', color: 'text-accent' },
        { text: 'কারও আশা', color: 'text-red-600' }
      ],
      isBengali: true
    },
    { 
      parts: [
        { text: 'বই হোক', color: 'text-accent' },
        { text: 'কারও ভরসা', color: 'text-red-600' }
      ],
      isBengali: true
    },
    { 
      parts: [
        { text: 'BoiSathi.com-', color: 'text-accent' },
        { text: 'বইসাথী', color: 'text-red-600' }
      ],
      isBengali: true
    },
    { 
      parts: [
        { text: 'পুরোনো বই,', color: 'text-accent' },
        { text: 'নতুন আশা', color: 'text-red-600' }
      ],
      isBengali: true
    }
  ], []);

  useEffect(() => {
    const unsubscribe = firebase.db.subscribeToListings((data) => {
      setListings(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handle window resize to adjust page size
  useEffect(() => {
    const handleResize = () => {
      const newPageSize = getPageSize();
      if (newPageSize !== pageSize) {
        setPageSize(newPageSize);
        setCurrentPage(0); // Reset to first page on layout change to avoid empty views
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pageSize]);

  // Cycle hero text
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % heroOptions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroOptions.length]);

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

  const handleNext = () => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (hasPrevious) {
      setCurrentPage(prev => prev - 1);
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setLocation({ divisionId: '', districtId: '', upazilaId: '' });
    setSearchTerm('');
    setSelectedClass('');
    setSelectedCondition('');
    setCurrentPage(0);
  };

  const currentHero = heroOptions[heroIdx];

  return (
    <div className="space-y-12 md:space-y-20 pb-32">
      {/* Hero Section */}
      <section className="relative px-4 pt-4 md:pt-8 overflow-hidden rounded-[4rem]">
        <div className="absolute inset-0 alpona-bg opacity-30 -z-10"></div>
        <div className="absolute top-20 left-10 w-24 h-24 bg-red-500/10 rounded-full blur-2xl animate-pulse -z-10"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000 -z-10"></div>
        
        <div className="absolute top-1/4 right-[10%] opacity-20 animate-float-3d -z-10 hidden lg:block">
           <BookOpen className="w-24 h-24 text-accent" />
        </div>
        <div className="absolute bottom-1/4 left-[10%] opacity-15 animate-float-3d delay-1000 -z-10 hidden lg:block">
           <BookHeart className="w-20 h-20 text-red-500" />
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] md:h-[600px] bg-emerald-50/20 rounded-[4rem] -z-20 blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto text-center space-y-4 md:space-y-8 stagger-load overflow-visible">
          <div className="min-h-[6rem] sm:min-h-[8rem] md:min-h-[10rem] lg:min-h-[12rem] flex items-center justify-center overflow-visible perspective-1000">
            <h1 
              key={heroIdx}
              className={`text-2xl sm:text-4xl md:text-5xl lg:text-[4.5rem] xl:text-[5.5rem] font-serif font-black leading-tight tracking-tight animate-reveal-up px-2 py-4 md:py-8 text-3d whitespace-nowrap flex items-center justify-center gap-x-[0.3em] ${currentHero.isBengali ? 'font-bn' : ''}`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {currentHero.parts.map((part, i) => (
                <span key={i} className={`${part.color} inline-block transform hover:scale-105 transition-transform cursor-default`}>
                  {part.text}
                </span>
              ))}
            </h1>
          </div>
          
          <div className="max-w-3xl mx-auto relative pt-2">
            <div className="bg-white p-2 md:p-3 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col md:flex-row items-center gap-2 transform hover:scale-[1.01] transition-transform">
              <div className="flex-grow flex items-center px-4 w-full">
                <Search className="w-5 h-5 text-zinc-300" />
                <input 
                  type="text"
                  placeholder={lang === 'bn' ? 'বই বা লেখকের নাম লিখুন...' : 'Search for titles, authors or subjects...'}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(0); // Reset page on search
                  }}
                  className="w-full px-4 py-3 bg-transparent outline-none font-bold text-slate-900 placeholder:text-slate-200 text-sm md:text-base"
                />
              </div>
              <button onClick={() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] md:text-[11px] uppercase flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95 tracking-widest">
                <ArrowRight className="w-4 h-4" />
                {t('browse')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bento Grid - Compact Styling */}
      <section className="container mx-auto max-w-7xl px-4">
        <div className="bg-[#f0fdf9]/60 rounded-[2.5rem] p-8 md:p-12 border border-emerald-50 relative overflow-hidden group shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <h3 className="flex items-center gap-2.5 text-[11px] font-black text-slate-400 uppercase">
                <MapPin className="w-4 h-4 text-accent" /> {lang === 'bn' ? 'স্থান ও শ্রেণী নির্বাচন' : 'REFINE SEARCH'}
              </h3>
              <button onClick={clearFilters} className="text-[9px] font-black text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2 uppercase bg-white/80 px-4 py-2 rounded-xl border border-emerald-50 shadow-sm">
                <X className="w-3.5 h-3.5" /> {t('reset')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-5">
               <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">{t('division')}</label>
                  <div className="relative group/sel">
                    <select 
                      value={location.divisionId}
                      onChange={(e) => {
                        setLocation({...location, divisionId: e.target.value, districtId: '', upazilaId: ''});
                        setCurrentPage(0);
                      }}
                      className="w-full px-5 py-3.5 bg-white border border-emerald-50/50 rounded-xl outline-none text-[11px] font-bold text-slate-900 appearance-none cursor-pointer hover:border-accent/30 transition-all shadow-sm"
                    >
                      <option value="">{t('selectDivision')}</option>
                      {DIVISIONS.map(d => <option key={d.id} value={d.id}>{lang === 'bn' ? d.nameBn : d.name}</option>)}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-200 rotate-90 pointer-events-none" />
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">{t('district')}</label>
                  <div className="relative group/sel">
                    <select 
                      disabled={!location.divisionId}
                      value={location.districtId}
                      onChange={(e) => {
                        setLocation({...location, districtId: e.target.value, upazilaId: ''});
                        setCurrentPage(0);
                      }}
                      className="w-full px-5 py-3.5 bg-white border border-emerald-50/50 rounded-xl outline-none text-[11px] font-bold text-slate-900 appearance-none cursor-pointer hover:border-accent/30 transition-all shadow-sm disabled:opacity-30"
                    >
                      <option value="">{t('selectDistrict')}</option>
                      {DISTRICTS.filter(d => d.divisionId === location.divisionId).map(d => <option key={d.id} value={d.id}>{lang === 'bn' ? d.nameBn : d.name}</option>)}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-200 rotate-90 pointer-events-none" />
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">{t('upazilaThana')}</label>
                  <div className="relative group/sel">
                    <select 
                      disabled={!location.districtId}
                      value={location.upazilaId}
                      onChange={(e) => {
                        setLocation({...location, upazilaId: e.target.value});
                        setCurrentPage(0);
                      }}
                      className="w-full px-5 py-3.5 bg-white border border-emerald-50/50 rounded-xl outline-none text-[11px] font-bold text-slate-900 appearance-none cursor-pointer hover:border-accent/30 transition-all shadow-sm disabled:opacity-30"
                    >
                      <option value="">{t('selectUpazila')}</option>
                      {UPAZILAS.filter(u => u.districtId === location.districtId).map(u => <option key={u.id} value={u.id}>{lang === 'bn' ? u.nameBn : u.name}</option>)}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-200 rotate-90 pointer-events-none" />
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">{t('classLevel')}</label>
                  <div className="relative group/sel">
                    <select 
                      value={selectedClass}
                      onChange={(e) => {
                        setSelectedClass(e.target.value);
                        setCurrentPage(0);
                      }}
                      className="w-full px-5 py-3.5 bg-white border border-emerald-50/50 rounded-xl outline-none text-[11px] font-bold text-slate-900 appearance-none cursor-pointer hover:border-accent/30 transition-all shadow-sm"
                    >
                      <option value="">{t('allClasses')}</option>
                      {CLASSES.map(c => <option key={c} value={c}>{t(c as any)}</option>)}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-200 rotate-90 pointer-events-none" />
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">{lang === 'bn' ? 'অবস্থা' : 'CONDITION'}</label>
                  <div className="relative group/sel">
                    <select 
                      value={selectedCondition}
                      onChange={(e) => {
                        setSelectedCondition(e.target.value);
                        setCurrentPage(0);
                      }}
                      className="w-full px-5 py-3.5 bg-white border border-emerald-50/50 rounded-xl outline-none text-[11px] font-bold text-slate-900 appearance-none cursor-pointer hover:border-accent/30 transition-all shadow-sm"
                    >
                      <option value="">{t('allConditions')}</option>
                      {CONDITIONS.map(c => <option key={c} value={c}>{t(c as any)}</option>)}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-200 rotate-90 pointer-events-none" />
                  </div>
               </div>

               <div className="flex items-end">
                  <button onClick={() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full px-8 py-3.5 bg-accent text-white rounded-xl font-black text-[11px] uppercase hover:bg-accent-hover transition-all shadow-xl shadow-accent/10 active:scale-95">
                    {t('find')}
                  </button>
               </div>
            </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results-section" className="container mx-auto max-w-7xl px-4 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight">
              {t('availableBooks')}
            </h2>
            <div className="flex items-center gap-3">
              <span className="w-1 h-1 rounded-full bg-accent animate-ping"></span>
              <p className="text-slate-400 font-bold uppercase text-[9px]">{filteredListings.length} {lang === 'bn' ? 'টি বই পাওয়া গেছে' : 'results found for you'}</p>
            </div>
          </div>
          
          <Link to="/sell" className="group flex items-center gap-2.5 bg-emerald-50 text-accent px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase hover:bg-accent hover:text-white transition-all duration-500 shadow-sm">
            <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
            Post your Ad
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-50 rounded-[2rem] aspect-[4/5] animate-pulse border border-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent animate-glimmer"></div>
              </div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {visibleListings.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-8 pt-8">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {hasPrevious && (
                    <button 
                      onClick={handlePrevious}
                      className="group relative flex items-center gap-3 px-8 py-4 bg-white text-zinc-900 border-2 border-zinc-100 rounded-2xl font-black text-[10px] uppercase hover:bg-zinc-50 transition-all shadow-lg active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      {lang === 'bn' ? 'আগে' : 'Prev'}
                    </button>
                  )}
                  
                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(i);
                          document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`w-10 h-10 rounded-xl text-[11px] font-black uppercase transition-all flex items-center justify-center border ${
                          currentPage === i 
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl shadow-zinc-900/20' 
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
                      className="group relative flex items-center gap-3 px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black text-[10px] uppercase hover:bg-black transition-all shadow-xl active:scale-95"
                    >
                      {lang === 'bn' ? 'পরে' : 'Next'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 alpona-bg w-full h-full opacity-[0.02]"></div>
            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 border border-slate-100">
              <Search className="w-8 h-8 text-slate-200" />
            </div>
            <h3 className="text-2xl font-serif font-black text-slate-900 mb-3">{t('noBooksFound')}</h3>
            <p className="text-slate-400 font-medium mb-10 max-w-sm mx-auto leading-relaxed text-sm">{t('tryDifferent')}</p>
            <button onClick={clearFilters} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase hover:bg-black transition shadow-xl active:scale-95">
              {t('showEverything')}
            </button>
          </div>
        )}
      </section>

      {/* Featured Toolsybro Banner (Compact Version) */}
      <section className="container mx-auto max-w-7xl px-4">
        <div className="bg-[#0f172a] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden relative group p-6 md:p-8 shadow-xl">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/20 blur-[100px] -z-10 group-hover:scale-125 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 alpona-bg w-full h-1/2 opacity-[0.02] -z-10"></div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 relative z-10">
            <div className="space-y-3 md:space-y-4 max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 rounded-full text-accent font-black text-[8px] md:text-[9px] uppercase border border-white/5 backdrop-blur-sm">
                <Sparkles className="w-3 h-3" />
                Featured Partner
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black text-white leading-tight">
                Supercharge your <span className="text-accent italic">Workflow.</span>
              </h2>
              <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed opacity-80">
                Toolsybro offers 50+ professional online utilities for students. Convert PDFs, edit images, and organize your studies with one click.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> 100% Free
                </div>
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> Secure & Fast
                </div>
              </div>
            </div>
            
            <a 
              href="https://toolsybro.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group/btn relative bg-white text-slate-900 px-8 py-3.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase hover:bg-accent hover:text-white transition-all duration-500 shadow-xl active:scale-95 flex-shrink-0"
            >
              <span className="relative z-10 flex items-center gap-3">
                Visit toolsybro.com
                <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Modern Steps Section (Compact) */}
      <section className="container mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <div className="bg-slate-50 rounded-[2rem] p-8 md:p-12 border border-slate-100 flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 alpona-bg w-40 h-40 opacity-5 -z-10 group-hover:rotate-12 transition-transform duration-700"></div>
          <div className="space-y-6 mb-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-slate-100">
                <BookOpen className="w-6 h-6 text-slate-900" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900 leading-none">{t('buyABook')}</h2>
            <div className="space-y-4">
              {[1, 2, 3].map(step => (
                <div key={step} className="flex gap-4 group/step">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-sm text-slate-200 border border-slate-100 group-hover/step:text-accent group-hover/step:border-accent transition-all duration-500 flex-shrink-0">
                    {step}
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-sm md:text-base text-slate-800 font-bold leading-relaxed pt-2">
                        {t(`buyStep${step}` as any)}
                     </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-accent rounded-[2rem] p-8 md:p-12 text-white flex flex-col justify-between shadow-xl shadow-accent/5 group overflow-hidden relative">
          <div className="absolute bottom-0 left-0 alpona-bg w-full h-full opacity-[0.08] -z-10"></div>
          <div className="space-y-6 mb-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center shadow-lg">
                <PlusCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-white leading-none">{t('sellABookTitle')}</h2>
            <div className="space-y-4">
              {[1, 2, 3].map(step => (
                <div key={step} className="flex gap-4 group/step">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-sm text-white/40 border border-white/10 group-hover/step:text-white group-hover/step:border-white transition-all duration-500 flex-shrink-0">
                    {step}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm md:text-base text-white/90 font-bold leading-relaxed pt-2">
                      {t(`sellStep${step}` as any)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link to="/sell" className="inline-flex items-center bg-white/10 border border-white/20 text-white px-8 py-4 rounded-2xl font-black text-[9px] md:text-[10px] uppercase hover:bg-white hover:text-accent transition-all duration-500 shadow-xl active:scale-95 w-fit group/sell">
            <span className="flex items-center gap-3">
              {t('startSelling')}
              <div className="w-8 h-px bg-white group-hover/sell:bg-accent transition-colors"></div>
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
