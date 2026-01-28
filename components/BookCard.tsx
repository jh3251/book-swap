
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookListing, UserProfile } from '../types';
import { MapPin, Phone, LayoutGrid, BookOpen, Clock, ChevronRight, X, Trash2 } from 'lucide-react';
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
    
    // Years
    let interval = seconds / 31536000;
    if (interval >= 1) return Math.floor(interval) + (lang === 'bn' ? ' বছর আগে' : 'y ago');
    
    // Months
    interval = seconds / 2592000;
    if (interval >= 1) return Math.floor(interval) + (lang === 'bn' ? ' মাস আগে' : 'mo ago');
    
    // Days - Exactly after 24 hours (86400 seconds)
    interval = seconds / 86400;
    if (interval >= 1) return Math.floor(interval) + (lang === 'bn' ? ' দিন আগে' : 'd ago');
    
    // Hours
    interval = seconds / 3600;
    if (interval >= 1) return Math.floor(interval) + (lang === 'bn' ? ' ঘণ্টা আগে' : 'h ago');
    
    // Minutes
    interval = seconds / 60;
    if (interval >= 1) return Math.floor(interval) + (lang === 'bn' ? ' মিনিট আগে' : 'm ago');
    
    return lang === 'bn' ? 'এইমাত্র' : 'just now';
  }, [book.createdAt, lang]);

  return (
    <div className="bg-white p-3 md:p-4 flex gap-3 md:gap-5 group hover:bg-zinc-50/80 transition-all duration-300 relative overflow-hidden h-full rounded-[1.5rem] md:rounded-[2rem] border border-zinc-50">
      {/* Compact Image Section */}
      <Link 
        to={`/books/${book.id}`} 
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden rounded-[1.2rem] md:rounded-[1.5rem] bg-zinc-50 relative border border-zinc-100 shadow-sm"
      >
        <img 
          src={book.imageUrl || `https://picsum.photos/seed/${book.id}/300/300`} 
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {book.condition === 'Donation' && (
          <div className="absolute top-1.5 left-1.5 bg-orange-500 text-white px-1.5 py-0.5 rounded-md font-black text-[7px] md:text-[9px] uppercase shadow-md tracking-wider z-10">
            {t('free')}
          </div>
        )}
      </Link>
      
      {/* Information Content Section */}
      <div className="flex-grow flex flex-col justify-between py-0.5 min-w-0">
        <div className="space-y-1.5">
          <Link to={`/books/${book.id}`} className="block">
            <h3 className={`text-sm sm:text-base md:text-xl font-black text-zinc-900 line-clamp-1 leading-tight transition-colors ${lang === 'bn' ? 'font-bn' : ''}`}>
              {book.title}
            </h3>
            {book.author && (
              <p className="text-[8px] md:text-[10px] text-zinc-300 font-bold uppercase tracking-[0.05em] mt-0.5 truncate flex items-center gap-1.5">
                <span className="w-3 h-[1px] bg-zinc-100"></span>
                {book.author}
              </p>
            )}
          </Link>

          <div className="flex flex-col gap-1 mt-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F3F4F6] rounded-full text-zinc-500 w-fit max-w-full">
              <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3 text-zinc-400 flex-shrink-0" />
              <span className="text-[7px] md:text-[9px] font-black uppercase truncate tracking-tight">{localizedLocation}</span>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F3F4F6] rounded-full text-zinc-500 w-fit">
              <BookOpen className="w-2.5 h-2.5 md:w-3 md:h-3 text-zinc-400 flex-shrink-0" />
              <span className="text-[7px] md:text-[9px] font-black uppercase tracking-tight">{t(book.subject as any)}</span>
            </div>
          </div>
        </div>

        {/* Action Row - Optimized for visibility and wrapping */}
        <div className="flex flex-wrap items-end justify-between gap-2 pt-2.5 border-t border-zinc-50 mt-3">
          <div className="flex flex-col flex-shrink-0">
             {book.condition === 'Donation' ? (
              <span className="text-orange-600 font-black text-[11px] md:text-xl uppercase tracking-tight leading-none">{t('free')}</span>
            ) : (
              <div className="flex items-baseline gap-0.5 leading-none">
                <span className="text-zinc-400 font-bold text-[8px] md:text-xs">৳</span>
                <span className="text-emerald-600 font-black text-[12px] md:text-2xl">{book.price}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-[8px] md:text-[10px] text-zinc-300 font-bold leading-none mt-1.5">
              <Clock className="w-3 h-3" />
              <span className="truncate">{timeAgo}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2">
            {showActions ? (
              <div className="flex items-center gap-1 md:gap-2">
                <button 
                  onClick={() => onEdit?.(book.id)} 
                  className="bg-[#F3F4F6] text-zinc-600 px-2 py-2 md:px-5 md:py-3 rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 border border-zinc-100"
                >
                  <LayoutGrid className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
                  <span className="text-[8px] md:text-[11px] font-black uppercase tracking-wider">
                    {t('edit')}
                  </span>
                </button>
                <button 
                  onClick={() => onDelete?.(book.id)} 
                  className="bg-[#FEF2F2] text-[#EF4444] px-2 py-2 md:px-5 md:py-3 rounded-xl hover:bg-red-100 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 border border-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
                  <span className="text-[8px] md:text-[11px] font-black uppercase tracking-wider">
                    {t('delete')}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 md:gap-2">
                <Link 
                  to={`/books/${book.id}`} 
                  className="bg-zinc-900 text-white px-3 py-2 md:px-6 md:py-3 rounded-xl font-black text-[8px] md:text-[11px] uppercase hover:bg-black transition-all shadow-md active:scale-95 flex items-center gap-1"
                >
                  {t('details')}
                  <ChevronRight className="w-3 h-3 md:w-4 h-4" />
                </Link>
                <a 
                  href={`tel:${book.contactPhone}`} 
                  className="w-8 h-8 md:w-11 md:h-11 bg-accent text-white rounded-xl flex items-center justify-center hover:bg-accent-hover transition-all shadow-md active:scale-95"
                >
                  <Phone className="w-4 h-4 md:w-5 md:h-5" />
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
