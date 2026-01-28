
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookListing, UserProfile } from '../types';
import { MapPin, Phone, LayoutGrid, PlusCircle, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { firebase } from '../firebase';
import { useTranslation } from '../App';
import { DISTRICTS, UPAZILAS } from '../constants';

interface BookCardProps {
  book: BookListing;
  showActions?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, showActions, onDelete, onEdit }) => {
  const [seller, setSeller] = useState<UserProfile | null>(null);
  const { t, lang } = useTranslation();

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const data = await firebase.db.getUserById(book.sellerId);
        if (data) setSeller(data);
      } catch (e) {}
    };
    fetchSeller();
  }, [book.sellerId]);

  const localizedLocation = useMemo(() => {
    const upazila = UPAZILAS.find(u => u.id === book.location.upazilaId);
    const district = DISTRICTS.find(d => d.id === book.location.districtId);
    
    const uName = lang === 'bn' ? (upazila?.nameBn || book.location.upazilaName) : book.location.upazilaName;
    const dName = lang === 'bn' ? (district?.nameBn || book.location.districtName) : book.location.districtName;
    
    return `${uName}, ${dName}`;
  }, [book.location, lang]);

  const timeAgo = useMemo(() => {
    const seconds = Math.floor((Date.now() - book.createdAt) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + (lang === 'bn' ? ' বছর আগে' : 'y ago');
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + (lang === 'bn' ? ' মাস আগে' : 'mo ago');
    interval = seconds / 864000;
    if (interval > 1) return Math.floor(interval) + (lang === 'bn' ? ' দিন আগে' : 'd ago');
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + (lang === 'bn' ? ' ঘণ্টা আগে' : 'h ago');
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + (lang === 'bn' ? ' মিনিট আগে' : 'm ago');
    return lang === 'bn' ? 'এইমাত্র' : 'just now';
  }, [book.createdAt, lang]);

  return (
    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-2.5 md:p-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-zinc-100 flex gap-3 md:gap-5 group hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-emerald-200/50 transition-all duration-500 relative overflow-hidden h-full">
      {/* Visual Image Section - Reduced size for more compact height */}
      <Link 
        to={`/books/${book.id}`} 
        className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 flex-shrink-0 overflow-hidden rounded-[1rem] md:rounded-[1.5rem] bg-zinc-50 relative border border-zinc-50/50 shadow-inner"
      >
        <img 
          src={book.imageUrl || `https://picsum.photos/seed/${book.id}/400/400`} 
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {book.condition === 'Donation' && (
          <div className="absolute top-1.5 left-1.5 bg-orange-500/90 backdrop-blur-md text-white px-2 py-0.5 rounded-full font-black text-[6px] md:text-[8px] uppercase shadow-lg tracking-wider z-10 animate-pulse-soft">
            {t('free')}
          </div>
        )}
      </Link>
      
      {/* Information Content Section */}
      <div className="flex-grow flex flex-col justify-between py-0.5 md:py-1 min-w-0">
        <div className="space-y-1.5 md:space-y-2.5">
          <Link to={`/books/${book.id}`} className="block group/title">
            <h3 className={`text-sm sm:text-base md:text-xl font-black text-zinc-900 line-clamp-1 leading-tight group-hover/title:text-accent transition-colors ${lang === 'bn' ? 'font-bn md:text-2xl' : ''}`}>
              {book.title}
            </h3>
            {book.author && (
              <p className="text-[8px] md:text-[10px] text-zinc-400 font-bold uppercase tracking-[0.05em] mt-0.5 truncate flex items-center gap-1.5">
                <span className="w-3 h-[1px] bg-zinc-200"></span>
                {book.author}
              </p>
            )}
          </Link>

          {/* Modern Meta Tags / Chips - More compact spacing */}
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            <div className="inline-flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 bg-zinc-50/80 border border-zinc-100 rounded-lg md:rounded-xl text-zinc-600 group-hover:bg-blue-50/30 group-hover:border-blue-100/50 transition-colors max-w-full">
              <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3 text-zinc-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
              <span className="text-[7px] md:text-[9px] font-black uppercase truncate tracking-tight">{localizedLocation}</span>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 bg-zinc-50/80 border border-zinc-100 rounded-lg md:rounded-xl text-zinc-600 group-hover:bg-emerald-50/30 group-hover:border-emerald-100/50 transition-colors">
              <BookOpen className="w-2.5 h-2.5 md:w-3 md:h-3 text-zinc-400 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
              <span className="text-[7px] md:text-[9px] font-black uppercase tracking-tight">{t(book.subject as any)}</span>
            </div>
          </div>
        </div>

        {/* Pricing and Integrated Actions - Tightened vertical spacing */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 md:gap-4 pt-2 md:pt-3 border-t border-zinc-50">
          <div className="flex flex-col gap-0.5">
             {book.condition === 'Donation' ? (
              <span className="text-orange-600 font-black text-xs md:text-lg uppercase tracking-tighter">{t('free')}</span>
            ) : (
              <div className="flex items-baseline gap-0.5">
                <span className="text-zinc-400 font-bold text-[10px] md:text-xs">৳</span>
                <span className="text-emerald-600 font-black text-sm md:text-xl leading-none">{book.price}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-[7px] md:text-[9px] text-zinc-300 font-bold">
              <Clock className="w-2 h-2 md:w-2.5 md:h-2.5" />
              <span>{timeAgo}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showActions ? (
              <div className="flex gap-1.5">
                <button 
                  onClick={() => onEdit?.(book.id)} 
                  className="bg-zinc-100 text-zinc-600 px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl hover:bg-zinc-900 hover:text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <LayoutGrid className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Edit</span>
                </button>
                <button 
                  onClick={() => onDelete?.(book.id)} 
                  className="bg-red-50 text-red-500 p-1.5 md:p-2.5 rounded-xl md:rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
                >
                  <PlusCircle className="w-3.5 h-3.5 md:w-4 md:h-4 rotate-45" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to={`/books/${book.id}`} 
                  className="group/btn relative bg-zinc-900 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-black text-[8px] md:text-[10px] uppercase whitespace-nowrap hover:bg-black transition-all shadow-lg active:scale-95 flex items-center gap-1.5 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  {t('details')}
                  <ChevronRight className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href={`tel:${book.contactPhone}`} 
                  className="w-8 h-8 md:w-11 md:h-11 bg-accent text-white rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-accent-hover transition-all shadow-xl shadow-accent/10 active:scale-95 group/phone"
                >
                  <Phone className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 group-hover/phone:rotate-12 transition-transform" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
