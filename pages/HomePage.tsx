import React, { useState, useEffect, useMemo } from 'react';
import { firebase } from '../firebase';
import { BookListing, LocationInfo } from '../types';
import { CLASSES, CONDITIONS, DIVISIONS, DISTRICTS, UPAZILAS } from '../constants';
import BookCard from '../components/BookCard';
import { Search, MapPin, X, PlusCircle, ArrowRight, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';
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
  
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [howToTab, setHowToTab] = useState<'buy' | 'sell'>('buy');
  
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

  const currentHero = heroOptions[heroIdx] || heroOptions[0];

  return (
    <div className="space-y-4 md:space-y-10 pb-10">
      <SEO 
        title={lang === 'bn' ? 'পুরোনো বই, নতুন আশা' : 'Buy & Sell Used Books in Bangladesh'} 
        description={lang === 'bn' ? 'BoiSathi.com - বাংলাদেশের শিক্ষার্থীদের জন্য পুরোনো বই কেনাবেচার নির্ভরযোগ্য প্ল্যাটফর্ম।' : 'BoiSathi is the safest student marketplace in Bangladesh for buying and selling used academic books.'}
      />
      
      {/* Hero Section */}
      <section className="relative px-4 pt-4 md:pt-10 overflow-hidden rounded-[3rem] md:rounded-[4rem] min-h-[350px] md:min-h-[450px] flex flex-col items-center justify-center bg-white border border-emerald-50">
        <div className="absolute inset-0 alpona-bg opacity-10 -z-10"></div>
        <div className="max-w-5xl mx-auto text-center space-y-6 md:space-y-10 stagger-load">
          <div className="min-h-[8rem] sm:min-h-[10rem] md:min-h-[14rem] flex items-center justify-center">
            <h1 
              key={heroIdx}
              className={`text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] font-serif font-black leading-tight tracking-tight px-2 flex flex-col sm:flex-row items-center justify-center gap-y-2 sm:gap-y-0 sm:gap-x-4 transition-all duration-700 animate-reveal-up ${currentHero.isBengali ? 'font-bn' : ''}`}
            >
              {currentHero.parts.map((part, i) => (
                <span key={i} className={`${part.color} inline-block`}>
                  {part.text}
                </span>
              ))}
            </h1>
          </div>
          
          <div className="max-w-3xl mx-auto relative px-2">
            <div className="bg-white p-2 md:p-3 rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_25px_60px_rgba(5,150,105,0.1)] border border-emerald-50 flex flex-col md:flex-row items-center gap-2 transform hover:scale-[1.01] transition-transform duration-500">
              <div className="flex-grow flex items-center px-4 md:px-6 w-full h-full">
                <Search className="w-5 h-5 md:w-6 md:h-6 text-emerald-300" />
                <input 
                  type="text"
                  placeholder={lang === 'bn' ? 'বই বা লেখকের নাম লিখুন...' : 'Search for titles, authors or subjects...'}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(0);
                  }}
                  className="w-full px-4 py-3 md:py-4 bg-transparent outline-none font-bold text-slate-900 placeholder:text-slate-300 text-sm md:text-base"
                />
              </div>
              <button onClick={() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full md:w-auto px-8 py-4 md:py-5 bg-accent text-white rounded-[1.2rem] md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase flex items-center justify-center gap-3 hover:bg-accent-hover transition-all shadow-xl active:scale-95 tracking-widest">
                <ArrowRight className="w-4 h-4" />
                {t('browse')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bento Grid */}
      <section className="container mx-auto max-w-7xl px-4">
        <div className="bg-emerald-50/40 rounded-[2rem] p-6 md:p-8 border border-emerald-100/50 shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h3 className="flex items-center gap-2 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">
                <MapPin className="w-4 h-4 text-accent" /> {lang === 'bn' ? 'স্থান ও শ্রেণী' : 'LOCATION & FILTERS'}
              </h3>
              <button onClick={clearFilters} className="text-[10px] font-black text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-2 uppercase">
                <X className="w-4 h-4" /> {t('reset')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase ml-1 tracking-wider">{t('division')}</label>
                  <select 
                    value={location.divisionId}
                    onChange={(e) => {
                      setLocation({...location, divisionId: e.target.value, districtId: '', upazilaId: ''});
                      setCurrentPage(0);
                    }}
                    className="w-full px-4 py-3 bg-white border border-emerald-100 rounded-xl outline-none text-xs font-bold text-slate-900 appearance-none cursor-pointer shadow-sm hover:border-accent transition-colors"
                  >
                    <option value="">{t('selectDivision')}</option>
                    {DIVISIONS.map(d => <option key={d.id} value={d.id}>{lang === 'bn' ? d.nameBn : d.name}</option>)}
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase ml-1 tracking-wider">{t('district')}</label>
                  <select 
                    disabled={!location.divisionId}
                    value={location.districtId}
                    onChange={(e) => {
                      setLocation({...location, districtId: e.target.value, upazilaId: ''});
                      setCurrentPage(0);
                    }}
                    className="w-full px-4 py-3 bg-white border border-emerald-100 rounded-xl outline-none text-xs font-bold text-slate-900 appearance-none cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <option value="">{t('selectDistrict')}</option>
                    {DISTRICTS.filter(d => d.divisionId === location.divisionId).map(d => <option key={d.id} value={d.id}>{lang === 'bn' ? d.nameBn : d.name}</option>)}
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase ml-1 tracking-wider">{t('upazilaThana')}</label>
                  <select 
                    disabled={!location.districtId}
                    value={location.upazilaId}
                    onChange={(e) => {
                      setLocation({...location, upazilaId: e.target.value});
                      setCurrentPage(0);
                    }}
                    className="w-full px-4 py-3 bg-white border border-emerald-100 rounded-xl outline-none text-xs font-bold text-slate-900 appearance-none cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <option value="">{t('selectUpazila')}</option>
                    {UPAZILAS.filter(u => u.districtId === location.districtId).map(u => <option key={u.id} value={u.id}>{lang === 'bn' ? u.nameBn : u.name}</option>)}
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase ml-1 tracking-wider">{t('classLevel')}</label>
                  <select 
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setCurrentPage(0);
                    }}
                    className="w-full px-4 py-3 bg-white border border-emerald-100 rounded-xl outline-none text-xs font-bold text-slate-900 appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="">{t('allClasses')}</option>
                    {CLASSES.map(c => <option key={c} value={c}>{t(c as any)}</option>)}
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase ml-1 tracking-wider">{lang === 'bn' ? 'অবস্থা' : 'CONDITION'}</label>
                  <select 
                    value={selectedCondition}
                    onChange={(e) => {
                      setSelectedCondition(e.target.value);
                      setCurrentPage(0);
                    }}
                    className="w-full px-4 py-3 bg-white border border-emerald-100 rounded-xl outline-none text-xs font-bold text-slate-900 appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="">{t('allConditions')}</option>
                    {CONDITIONS.map(c => <option key={c} value={c}>{t(c as any)}</option>)}
                  </select>
               </div>

               <div className="flex items-end">
                  <button onClick={() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full px-6 py-3.5 bg-accent text-white rounded-xl font-black text-xs uppercase hover:bg-accent-hover shadow-lg shadow-accent/20 transition-all">
                    {t('find')}
                  </button>
               </div>
            </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results-section" className="container mx-auto max-w-7xl px-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-serif font-black text-slate-900 tracking-tight">
              {t('availableBooks')}
            </h2>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">{filteredListings.length} {lang === 'bn' ? 'টি বই পাওয়া গেছে' : 'results'}</p>
            </div>
          </div>
          
          <Link to="/sell" className="group flex items-center justify-center gap-3 bg-white text-accent border border-emerald-100 px-6 py-4 rounded-2xl font-black text-xs uppercase shadow-sm hover:bg-emerald-50 transition-colors">
            <PlusCircle className="w-5 h-5" />
            Post New Ad
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-50 h-40 animate-pulse rounded-[2rem] border border-slate-100"></div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {visibleListings.map(book => (
                 <BookCard key={book.id} book={book} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-6 pt-10">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {hasPrevious && (
                    <button 
                      onClick={handlePrevious}
                      className="flex items-center gap-2 px-6 py-4 bg-white text-zinc-900 border border-zinc-200 rounded-xl font-black text-xs uppercase shadow-md active:scale-95 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" /> {lang === 'bn' ? 'আগে' : 'Prev'}
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
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-xl text-xs font-black transition-all flex items-center justify-center border ${
                          currentPage === i 
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl' 
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
                      className="flex items-center gap-2 px-6 py-4 bg-zinc-900 text-white rounded-xl font-black text-xs uppercase shadow-xl active:scale-95 transition-all"
                    >
                      {lang === 'bn' ? 'পরে' : 'Next'} <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-emerald-100 shadow-sm px-6">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-emerald-200" />
            </div>
            <h3 className="text-2xl font-serif font-black text-black mb-3">{t('noBooksFound')}</h3>
            <p className="text-zinc-400 font-medium mb-10 max-w-sm mx-auto">{t('tryDifferent')}</p>
            <button onClick={clearFilters} className="bg-accent text-white px-12 py-5 rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all">{t('showEverything')}</button>
          </div>
        )}
      </section>

      {/* How it Works Section */}
      <section className="container mx-auto max-w-7xl px-4 py-10">
        <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-emerald-50 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-50 rounded-2xl">
                <HelpCircle className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-black text-black">
                {t('howItWorks')}
              </h2>
            </div>
            
            <div className="bg-zinc-100 p-1 rounded-full flex border border-zinc-200">
               <button 
                 onClick={() => setHowToTab('buy')}
                 className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${howToTab === 'buy' ? 'bg-accent text-white shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}
               >
                 {t('buyABook')}
               </button>
               <button 
                 onClick={() => setHowToTab('sell')}
                 className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${howToTab === 'sell' ? 'bg-accent text-white shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}
               >
                 {t('sellABookTitle')}
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-700" key={howToTab}>
            {howToTab === 'buy' ? (
              <>
                <div className="space-y-4 p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                  <div className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center font-black text-sm">1</div>
                  <h4 className="font-black text-black text-sm uppercase tracking-wider">{lang === 'bn' ? 'বই খুঁজুন' : 'FIND BOOKS'}</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed font-medium">{t('buyStep1')}</p>
                </div>
                <div className="space-y-4 p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                  <div className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center font-black text-sm">2</div>
                  <h4 className="font-black text-black text-sm uppercase tracking-wider">{lang === 'bn' ? 'যোগাযোগ করুন' : 'CONTACT'}</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed font-medium">{t('buyStep2')}</p>
                </div>
                <div className="space-y-4 p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                  <div className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center font-black text-sm">3</div>
                  <h4 className="font-black text-black text-sm uppercase tracking-wider">{lang === 'bn' ? 'সংগ্রহ করুন' : 'COLLECT'}</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed font-medium">{t('buyStep3')}</p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4 p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                  <div className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center font-black text-sm">1</div>
                  <h4 className="font-black text-black text-sm uppercase tracking-wider">{lang === 'bn' ? 'অ্যাকাউন্ট' : 'SIGN UP'}</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed font-medium">{t('sellStep1')}</p>
                </div>
                <div className="space-y-4 p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                  <div className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center font-black text-sm">2</div>
                  <h4 className="font-black text-black text-sm uppercase tracking-wider">{lang === 'bn' ? 'বই দিন' : 'UPLOAD'}</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed font-medium">{t('sellStep2')}</p>
                </div>
                <div className="space-y-4 p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                  <div className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center font-black text-sm">3</div>
                  <h4 className="font-black text-black text-sm uppercase tracking-wider">{lang === 'bn' ? 'বিক্রি করুন' : 'SELL'}</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed font-medium">{t('sellStep3')}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Toolsybro Banner */}
      <section className="container mx-auto max-w-7xl px-4 py-6">
        <div className="bg-[#0f172a] rounded-[3rem] overflow-hidden relative group p-8 md:p-16 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none"></div>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10 text-center lg:text-left">
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-serif font-black text-white leading-tight">
                Supercharge your <span className="text-accent italic">Workflow.</span>
              </h2>
              <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed">
                Toolsybro offers 50+ professional online utilities for students. Convert PDFs, edit images, and organize your studies with one click.
              </p>
            </div>
            <a 
              href="https://toolsybro.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xs uppercase hover:bg-accent hover:text-white transition-all shadow-xl active:scale-95 flex-shrink-0 tracking-widest"
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