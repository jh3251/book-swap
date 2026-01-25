
import React, { useState, useEffect, useMemo } from 'react';
import { firebase } from '../firebase';
import { BookListing, LocationInfo } from '../types';
import { CLASSES, CONDITIONS, DIVISIONS, DISTRICTS, UPAZILAS } from '../constants';
import BookCard from '../components/BookCard';
import { Search, MapPin, SlidersHorizontal, X, BookCopy, BookOpen, PlusCircle, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
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
  const { t, lang } = useTranslation();

  // Hero Animation State
  const [heroIdx, setHeroIdx] = useState(0);
  
  // Specific hero options with split coloring and requested Bengali full stop (।)
  const heroOptions = useMemo(() => [
    { 
      parts: [
        { text: 'Donate Your ', color: 'text-accent' },
        { text: 'Books..', color: 'text-red-600' }
      ],
      isBengali: false
    },
    { 
      parts: [
        { text: 'আপনার বই দান ', color: 'text-accent' },
        { text: 'করুন।', color: 'text-red-600' }
      ],
      isBengali: true
    },
    { 
      parts: [
        { text: 'Sell Your ', color: 'text-accent' },
        { text: 'Books...', color: 'text-red-600' }
      ],
      isBengali: false
    },
    { 
      parts: [
        { text: 'আপনার বই বিক্রি ', color: 'text-accent' },
        { text: 'করুন।', color: 'text-red-600' }
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

  // Cycle hero text every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % heroOptions.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [heroOptions.length]);

  const divisionMap = useMemo(() => new Map(DIVISIONS.map(d => [d.id, { en: d.name.toLowerCase(), bn: d.nameBn }])), []);
  const districtMap = useMemo(() => new Map(DISTRICTS.map(d => [d.id, { en: d.name.toLowerCase(), bn: d.nameBn }])), []);
  const upazilaMap = useMemo(() => new Map(UPAZILAS.map(u => [u.id, { en: u.name.toLowerCase(), bn: u.nameBn }])), []);

  const filteredListings = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    
    return listings.filter(book => {
      const searchStrings = [
        book.title,
        book.author,
        book.subject,
        book.condition,
        book.location.divisionName,
        book.location.districtName,
        book.location.upazilaName,
        t(book.subject as any),
        t(book.condition as any),
        divisionMap.get(book.location.divisionId)?.bn || '',
        districtMap.get(book.location.districtId)?.bn || '',
        upazilaMap.get(book.location.upazilaId)?.bn || ''
      ];

      const matchesSearch = !term || searchStrings.some(str => 
        str && str.toLowerCase().includes(term)
      );
      
      const matchesClass = !selectedClass || book.subject === selectedClass;
      const matchesCondition = !selectedCondition || book.condition === selectedCondition;
      
      const checkLocation = (filterId: string | undefined, bookId: string | undefined, bookName: string | undefined, map: Map<string, {en: string, bn: string}>) => {
        if (!filterId) return true;
        if (bookId === filterId) return true;
        const filterData = map.get(filterId);
        if (!filterData || !bookName) return false;
        const normalizedBookName = bookName.toLowerCase().trim();
        return normalizedBookName === filterData.en || normalizedBookName === filterData.bn;
      };

      const matchesDivision = checkLocation(location.divisionId, book.location.divisionId, book.location.divisionName, divisionMap);
      const matchesDistrict = checkLocation(location.districtId, book.location.districtId, book.location.districtName, districtMap);
      const matchesUpazila = checkLocation(location.upazilaId, book.location.upazilaId, book.location.upazilaName, upazilaMap);
      
      return matchesSearch && matchesClass && matchesCondition && matchesDivision && matchesDistrict && matchesUpazila;
    });
  }, [listings, searchTerm, location, selectedClass, selectedCondition, t, divisionMap, districtMap, upazilaMap]);

  const clearFilters = () => {
    setLocation({ divisionId: '', districtId: '', upazilaId: '' });
    setSearchTerm('');
    setSelectedClass('');
    setSelectedCondition('');
  };

  const handleFind = () => {
    const element = document.getElementById('results-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredDistricts = useMemo(() => DISTRICTS.filter(d => d.divisionId === location.divisionId), [location.divisionId]);
  const filteredUpazilas = useMemo(() => UPAZILAS.filter(u => u.districtId === location.districtId), [location.districtId]);

  const currentHero = heroOptions[heroIdx];

  return (
    <div className="space-y-12 md:space-y-24 pb-20 overflow-hidden">
      {/* Modern Hero Section */}
      <section className="px-4 pt-4 md:pt-8 relative">
        {/* Floating Organic Background Blobs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-100/40 rounded-full blur-[100px] animate-float-slow -z-10"></div>
        <div className="absolute bottom-1/4 right-10 w-[30rem] h-[30rem] bg-orange-100/30 rounded-full blur-[120px] animate-float-medium -z-10"></div>

        <div className="bg-white/40 backdrop-blur-sm rounded-[3rem] md:rounded-[4.5rem] pt-6 pb-6 md:pt-10 md:pb-10 px-4 text-center shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-white transition-all duration-500 relative">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="h-[6rem] sm:h-[9rem] md:h-[12rem] flex items-center justify-center text-mask">
              <h1 
                key={heroIdx}
                className={`text-4xl sm:text-6xl md:text-[6.5rem] lg:text-[8rem] font-serif font-black leading-[1] tracking-tight animate-reveal-up ${currentHero.isBengali ? 'font-bn' : ''}`}
              >
                {currentHero.parts.map((part, i) => (
                  <span key={i} className={part.color}>{part.text}</span>
                ))}
              </h1>
            </div>

            <div className="max-w-2xl mx-auto pt-4">
              <div className="bg-white p-2 rounded-2xl shadow-xl shadow-emerald-900/5 border border-zinc-100 flex items-center group transition-all duration-300 focus-within:ring-4 focus-within:ring-accent/10 focus-within:scale-[1.02]">
                <div className="flex-grow flex items-center pl-4">
                  <Search className="w-5 h-5 text-zinc-300 group-focus-within:text-accent transition-colors" />
                  <input 
                    type="text"
                    placeholder={lang === 'bn' ? 'আপনি কি খুঁজছেন?' : 'Looking for something?'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent outline-none font-medium text-zinc-900 placeholder:text-zinc-300 text-sm md:text-base"
                  />
                </div>
                <div className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-zinc-900 text-white shadow-sm mr-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  {lang === 'bn' ? 'ফিল্টার' : 'Filters'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 text-left border border-zinc-100 shadow-xl shadow-emerald-900/5 transition-transform duration-500">
              <div className="flex justify-between items-center mb-8">
                <h3 className="flex items-center gap-2 text-[11px] font-black text-black uppercase tracking-[0.2em]">
                  <MapPin className="w-4 h-4 text-accent animate-bounce" /> {lang === 'bn' ? 'স্থান ও শ্রেণী' : 'Location & Category'}
                </h3>
                <button onClick={clearFilters} className="text-[10px] font-black text-zinc-300 hover:text-red-500 transition-colors flex items-center gap-1.5 uppercase tracking-widest">
                  <X className="w-3.5 h-3.5" /> {t('reset')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-y-8 gap-x-6">
                {[
                  { label: t('division'), val: location.divisionId, options: DIVISIONS, change: (v: string) => {
                    const d = DIVISIONS.find(div => div.id === v);
                    setLocation({ ...location, divisionId: v, divisionName: d?.name || '', districtId: '', districtName: '', upazilaId: '', upazilaName: '' });
                  }, def: t('selectDivision') },
                  { label: t('district'), val: location.districtId, options: DISTRICTS.filter(d => d.divisionId === location.divisionId), disabled: !location.divisionId, change: (v: string) => {
                    const d = DISTRICTS.find(dist => dist.id === v);
                    setLocation({ ...location, districtId: v, districtName: d?.name || '', upazilaId: '', upazilaName: '' });
                  }, def: t('selectDistrict') },
                  { label: t('upazilaThana'), val: location.upazilaId, options: UPAZILAS.filter(u => u.districtId === location.districtId), disabled: !location.districtId, change: (v: string) => {
                    const u = UPAZILAS.find(up => up.id === v);
                    setLocation({ ...location, upazilaId: v, upazilaName: u?.name || '' });
                  }, def: t('selectUpazila') }
                ].map((field, idx) => (
                  <div key={idx} className="space-y-2 group/field">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1 group-focus-within/field:text-accent transition-colors">{field.label}</label>
                    <select 
                      value={field.val || ''} 
                      disabled={field.disabled}
                      onChange={(e) => field.change(e.target.value)}
                      className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none text-xs font-bold text-black appearance-none cursor-pointer hover:bg-zinc-100 transition-all focus:border-accent disabled:opacity-30"
                    >
                      <option value="">{field.def}</option>
                      {field.options.map(opt => <option key={opt.id} value={opt.id}>{lang === 'bn' ? opt.nameBn : opt.name}</option>)}
                    </select>
                  </div>
                ))}

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">{t('classLevel')}</label>
                  <select 
                    value={selectedClass} 
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 focus:border-accent rounded-2xl outline-none text-xs font-bold text-black appearance-none cursor-pointer hover:bg-zinc-100 transition-all"
                  >
                    <option value="">{t('allClasses')}</option>
                    {CLASSES.map(c => <option key={c} value={c}>{t(c as any)}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">{lang === 'bn' ? 'অবস্থা' : 'Condition'}</label>
                  <select 
                    value={selectedCondition} 
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 focus:border-accent rounded-2xl outline-none text-xs font-bold text-black appearance-none cursor-pointer hover:bg-zinc-100 transition-all"
                  >
                    <option value="">{t('allConditions')}</option>
                    {CONDITIONS.map(c => <option key={c} value={c}>{t(c as any)}</option>)}
                  </select>
                </div>

                <div className="flex items-end">
                  <button 
                    onClick={handleFind}
                    className="w-full px-6 py-4 bg-zinc-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all transform active:scale-95 shadow-xl shadow-black/10 glimmer-btn"
                  >
                    {t('find')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <div id="results-section" className="scroll-mt-24 max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-4xl font-serif font-black text-zinc-900 leading-tight">
            {lang === 'bn' ? 'উপলব্ধ বইসমূহ' : 'Available Books'}
          </h2>
          {filteredListings.length > 0 && (
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-100 px-4 py-2 rounded-full border border-zinc-200">
              {filteredListings.length} {filteredListings.length === 1 ? 'RESULT' : 'RESULTS'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-zinc-50 rounded-3xl aspect-[4/5] animate-pulse border border-zinc-100 shadow-sm"></div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredListings.map((book) => (
              <div key={book.id} className="hover-lift">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-zinc-200 px-8 transition-all duration-500">
            <BookCopy className="w-20 h-20 text-zinc-100 mx-auto mb-8 animate-pulse" />
            <h3 className="text-2xl md:text-3xl font-serif font-black text-black mb-4">{t('noBooksFound')}</h3>
            <p className="text-zinc-400 text-[11px] font-black uppercase tracking-[0.2em] mb-12">{t('tryDifferent')}</p>
            <button onClick={clearFilters} className="bg-zinc-900 text-white px-12 py-5 rounded-2xl font-black hover:bg-black transition shadow-2xl shadow-black/10 text-[10px] uppercase tracking-[0.25em] glimmer-btn">
              {t('showEverything')}
            </button>
          </div>
        )}
      </div>

      {/* Featured Banner with Glimmer */}
      <section className="max-w-7xl mx-auto px-4">
        <a 
          href="https://toolsybro.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group block relative overflow-hidden bg-zinc-900 rounded-[3rem] p-10 md:p-16 shadow-2xl transition-all duration-700 hover:scale-[1.01]"
        >
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/3 group-hover:bg-accent/30 transition-all duration-1000"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div className="space-y-6 flex-grow max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white font-black text-[10px] uppercase tracking-[0.3em] border border-white/5">
                <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                Featured Student Tool
              </div>
              <h3 className="text-4xl md:text-6xl font-serif font-black text-white leading-tight">
                Study Smarter with <span className="text-accent italic">Toolsybro.</span>
              </h3>
              <p className="text-zinc-400 font-medium text-lg md:text-xl leading-relaxed">
                Free online utilities for students. Convert PDFs, edit images, and power up your academic workflow in seconds.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-white text-zinc-900 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-4 group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-xl glimmer-btn">
                Explore toolsybro.com
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </div>
        </a>
      </section>

      {/* Steps Section */}
      <section className="pt-20 border-t border-zinc-50 max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-7xl font-serif font-black text-zinc-900 tracking-tighter">{t('empoweringStudents')}</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-12 border border-emerald-100 animate-pulse-soft">
               <BookOpen className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-4xl font-serif font-black text-black mb-12">{t('buyABook')}</h3>
            <div className="space-y-12">
              {[1, 2, 3].map(step => (
                <div key={step} className="flex items-start gap-6 group">
                  <div className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 group-hover:bg-accent transition-colors">{step}</div>
                  <p className="text-zinc-600 font-semibold leading-relaxed text-lg md:text-xl">
                    {t(`buyStep${step}` as any)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-zinc-900 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3 group-hover:bg-accent/30 transition-all duration-1000"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-12 shadow-lg shadow-accent/20 animate-ring">
                 <PlusCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-4xl font-serif font-black text-white mb-12">{t('sellABookTitle')}</h3>
              <div className="space-y-12 mb-16">
                {[1, 2, 3].map(step => (
                  <div key={step} className="flex items-start gap-6 group/item">
                    <div className="w-10 h-10 bg-white text-zinc-900 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform">{step}</div>
                    <p className="text-zinc-400 font-semibold leading-relaxed text-lg md:text-xl">
                      {t(`sellStep${step}` as any)}
                    </p>
                  </div>
                ))}
              </div>
              <Link to="/sell" className="inline-flex items-center gap-5 bg-white text-zinc-900 px-12 py-6 rounded-2xl font-black text-xs transition-all shadow-2xl hover:bg-zinc-50 uppercase tracking-[0.25em] transform active:scale-95 glimmer-btn">
                {t('startSelling')}
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
