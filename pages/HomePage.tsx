
import React, { useState, useEffect, useMemo } from 'react';
import { firebase } from '../firebase';
import { BookListing, LocationInfo } from '../types';
import { CLASSES, CONDITIONS, DIVISIONS, DISTRICTS, UPAZILAS } from '../constants';
import BookCard from '../components/BookCard';
import { Search, MapPin, SlidersHorizontal, X, LayoutGrid, BookCopy, BookOpen, PlusCircle, ArrowRight, Zap, ExternalLink, Sparkles } from 'lucide-react';
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

  useEffect(() => {
    const unsubscribe = firebase.db.subscribeToListings((data) => {
      setListings(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Optimized lookup maps for localized search matching
  const divisionMap = useMemo(() => new Map(DIVISIONS.map(d => [d.id, { en: d.name.toLowerCase(), bn: d.nameBn }])), []);
  const districtMap = useMemo(() => new Map(DISTRICTS.map(d => [d.id, { en: d.name.toLowerCase(), bn: d.nameBn }])), []);
  const upazilaMap = useMemo(() => new Map(UPAZILAS.map(u => [u.id, { en: u.name.toLowerCase(), bn: u.nameBn }])), []);

  const filteredListings = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    
    return listings.filter(book => {
      // 1. Text Search Logic (Broad)
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
      
      // 2. Dropdown Attribute Filters
      const matchesClass = !selectedClass || book.subject === selectedClass;
      const matchesCondition = !selectedCondition || book.condition === selectedCondition;
      
      // 3. Resilient Location Filtering
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

  const filteredDistricts = useMemo(() => 
    DISTRICTS.filter(d => d.divisionId === location.divisionId),
    [location.divisionId]
  );

  const filteredUpazilas = useMemo(() => 
    UPAZILAS.filter(u => u.districtId === location.districtId),
    [location.districtId]
  );

  return (
    <div className="space-y-12 md:space-y-24 pb-20">
      {/* Hero Section with Rounded Corners */}
      <section className="px-4 pt-4 md:pt-8">
        <div className="bg-white rounded-[3rem] md:rounded-[4.5rem] pt-16 pb-16 md:pt-24 md:pb-24 px-4 text-center shadow-sm border border-zinc-100/80">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="space-y-0 overflow-hidden">
              <h1 className="text-5xl sm:text-7xl md:text-[7.5rem] font-serif font-bold text-zinc-900 leading-[1.1] tracking-tight">
                <span className="inline-block reveal-1">Find</span>{" "}
                <span className="inline-block reveal-2">Your</span>{" "}
                <span className="italic text-accent inline-block reveal-3 hover-float">Books..</span>
              </h1>
            </div>
            
            <p className="text-zinc-400 font-semibold text-[10px] md:text-xs uppercase tracking-[0.4em] pt-4 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-500">
              {lang === 'bn' ? 'ছাত্রদের জন্য সবচেয়ে নিরাপদ মার্কেটপ্লেস।' : 'THE SAFEST MARKETPLACE FOR STUDENTS.'}
            </p>

            <div className="max-w-2xl mx-auto pt-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
              <div className="bg-white p-2 rounded-2xl shadow-xl shadow-emerald-900/5 border border-zinc-100 flex items-center group">
                <div className="flex-grow flex items-center pl-4">
                  <Search className="w-5 h-5 text-zinc-300" />
                  <input 
                    type="text"
                    placeholder={lang === 'bn' ? 'আপনি কি খুঁজছেন?' : 'Looking for something?'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent outline-none font-medium text-zinc-900 placeholder:text-zinc-300 text-sm md:text-base"
                  />
                </div>
                {/* Static Filters Button to match design */}
                <div className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-zinc-900 text-white shadow-sm mr-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  {lang === 'bn' ? 'ফিল্টার' : 'Filters'}
                </div>
              </div>
            </div>
          </div>

          {/* Location & Category Filter Panel - Persistently Visible */}
          <div className="mt-8 max-w-5xl mx-auto opacity-100 translate-y-0 h-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000">
            <div className="bg-white rounded-3xl p-6 md:p-10 text-left border border-zinc-100 shadow-xl shadow-emerald-900/5">
              <div className="flex justify-between items-center mb-8">
                <h3 className="flex items-center gap-2 text-[11px] font-black text-black uppercase tracking-[0.2em]">
                  <MapPin className="w-4 h-4 text-accent" /> {lang === 'bn' ? 'স্থান ও শ্রেণী' : 'Location & Category'}
                </h3>
                <button onClick={clearFilters} className="text-[10px] font-black text-zinc-300 hover:text-red-500 transition flex items-center gap-1.5 uppercase tracking-widest">
                  <X className="w-3.5 h-3.5" /> {t('reset')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">{t('division')}</label>
                  <select 
                    value={location.divisionId || ''} 
                    onChange={(e) => {
                      const d = DIVISIONS.find(div => div.id === e.target.value);
                      setLocation({ ...location, divisionId: e.target.value, divisionName: d?.name || '', districtId: '', districtName: '', upazilaId: '', upazilaName: '' });
                    }}
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none text-xs font-bold text-black appearance-none cursor-pointer hover:bg-zinc-100 transition-colors"
                  >
                    <option value="">{t('selectDivision')}</option>
                    {DIVISIONS.map(d => <option key={d.id} value={d.id}>{lang === 'bn' ? d.nameBn : d.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">{t('district')}</label>
                  <select 
                    disabled={!location.divisionId}
                    value={location.districtId || ''} 
                    onChange={(e) => {
                      const d = DISTRICTS.find(dist => dist.id === e.target.value);
                      setLocation({ ...location, districtId: e.target.value, districtName: d?.name || '', upazilaId: '', upazilaName: '' });
                    }}
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none text-xs font-bold text-black appearance-none cursor-pointer disabled:opacity-30 hover:bg-zinc-100 transition-colors"
                  >
                    <option value="">{t('selectDistrict')}</option>
                    {filteredDistricts.map(d => <option key={d.id} value={d.id}>{lang === 'bn' ? d.nameBn : d.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">{t('upazilaThana')}</label>
                  <select 
                    disabled={!location.districtId}
                    value={location.upazilaId || ''} 
                    onChange={(e) => {
                      const u = UPAZILAS.find(up => up.id === e.target.value);
                      setLocation({ ...location, upazilaId: e.target.value, upazilaName: u?.name || '' });
                    }}
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none text-xs font-bold text-black appearance-none cursor-pointer disabled:opacity-30 hover:bg-zinc-100 transition-colors"
                  >
                    <option value="">{t('selectUpazila')}</option>
                    {filteredUpazilas.map(u => <option key={u.id} value={u.id}>{lang === 'bn' ? u.nameBn : u.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">{t('classLevel')}</label>
                  <select 
                    value={selectedClass} 
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-5 py-4 bg-zinc-50 border border-emerald-50 focus:border-accent rounded-2xl outline-none text-xs font-bold text-black appearance-none cursor-pointer hover:bg-zinc-100 transition-colors"
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
                    className="w-full px-5 py-4 bg-zinc-50 border border-emerald-50 focus:border-accent rounded-2xl outline-none text-xs font-bold text-black appearance-none cursor-pointer hover:bg-zinc-100 transition-colors"
                  >
                    <option value="">{t('allConditions')}</option>
                    {CONDITIONS.map(c => <option key={c} value={c}>{t(c as any)}</option>)}
                  </select>
                </div>

                <div className="flex items-end">
                  <button 
                    onClick={handleFind}
                    className="w-full px-6 py-4 bg-zinc-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition transform active:scale-95 shadow-lg shadow-black/10"
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
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-zinc-900 leading-tight">
            {lang === 'bn' ? 'উপলব্ধ বইসমূহ' : 'Available Books'}
          </h2>
          {filteredListings.length > 0 && (
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-100 px-3 py-1 rounded-full">
              {filteredListings.length} {filteredListings.length === 1 ? 'RESULT' : 'RESULTS'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl aspect-[4/5] animate-pulse border border-emerald-50 shadow-sm"></div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-zinc-200 px-8 animate-in fade-in duration-700">
            <BookCopy className="w-16 h-16 text-zinc-200 mx-auto mb-6" />
            <h3 className="text-xl md:text-2xl font-serif font-black text-black mb-3">{t('noBooksFound')}</h3>
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">{t('tryDifferent')}</p>
            <button onClick={clearFilters} className="bg-zinc-900 text-white px-10 py-5 rounded-2xl font-black hover:bg-zinc-800 transition text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-black/10">
              {t('showEverything')}
            </button>
          </div>
        )}
      </div>

      {/* Catchy Banner for toolsybro.com */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <a 
          href="https://toolsybro.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group block relative overflow-hidden bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-zinc-900/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 group-hover:bg-accent/20 transition-colors duration-700"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 text-center md:text-left">
            <div className="space-y-6 flex-grow max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white font-black text-[10px] uppercase tracking-[0.25em] border border-white/5">
                <Sparkles className="w-3 h-3 text-accent animate-pulse" />
                Featured Student Tool
              </div>
              <h3 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
                Study Smarter with <span className="text-accent italic">Toolsybro.</span>
              </h3>
              <p className="text-zinc-400 font-medium text-lg md:text-xl leading-relaxed">
                Free online utilities for students. Convert PDFs, edit images, and power up your academic workflow in seconds.
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <div className="bg-white text-zinc-900 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-4 group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-xl shadow-black/20">
                Explore toolsybro.com
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </div>
        </a>
      </section>

      {/* Info Section */}
      <section className="pt-20 border-t border-zinc-100 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-zinc-900 leading-tight tracking-tight">{t('empoweringStudents')}</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-white rounded-3xl p-10 md:p-14 border border-zinc-100 shadow-sm">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-10 border border-emerald-100">
               <BookOpen className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-3xl font-serif font-bold text-zinc-900 mb-10">{t('buyABook')}</h3>
            <div className="space-y-10">
              <div className="flex items-start gap-5">
                <div className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">1</div>
                <p className="text-zinc-600 font-semibold leading-relaxed text-base md:text-lg">
                  {t('buyStep1')}
                </p>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">2</div>
                <p className="text-zinc-600 font-semibold leading-relaxed text-base md:text-lg">
                  {t('buyStep2')}
                </p>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">3</div>
                <p className="text-zinc-600 font-semibold leading-relaxed text-base md:text-lg">
                  {t('buyStep3')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-10 md:p-14 shadow-2xl shadow-zinc-900/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/20 transition-colors duration-1000"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-accent/20">
                 <PlusCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-white mb-10">{t('sellABookTitle')}</h3>
              <div className="space-y-10 mb-12">
                <div className="flex items-start gap-5">
                  <div className="w-8 h-8 bg-white text-zinc-900 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">1</div>
                  <p className="text-zinc-400 font-semibold leading-relaxed text-base md:text-lg">
                    {t('sellStep1')}
                  </p>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-8 h-8 bg-white text-zinc-900 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">2</div>
                  <p className="text-zinc-400 font-semibold leading-relaxed text-base md:text-lg">
                    {t('sellStep2')}
                  </p>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-8 h-8 bg-white text-zinc-900 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">3</div>
                  <p className="text-zinc-400 font-semibold leading-relaxed text-base md:text-lg">
                    {t('sellStep3')}
                  </p>
                </div>
              </div>
              <Link to="/sell" className="inline-flex items-center gap-4 bg-white text-zinc-900 px-10 py-5 rounded-2xl font-black text-xs transition shadow-2xl hover:bg-zinc-100 uppercase tracking-widest transform active:scale-95">
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
