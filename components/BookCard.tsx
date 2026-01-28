
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookListing, UserProfile } from '../types';
import { MapPin, User, Phone, LayoutGrid, PlusCircle, BookOpen, Clock, ChevronRight } from 'lucide-react';
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
    <div className="bg-white rounded-[2rem] p-3 md:p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-zinc-100 flex gap-4 md:gap-7 group hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-emerald-200/50 transition-all duration-500 relative overflow-hidden h-full">
      {/* Visual Image Section */}
      <Link 
        to={`/books/${book.id}`} 
        className="w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 flex-shrink-0 overflow-hidden rounded-[1.5rem] bg-zinc-50 relative border border-zinc-50/50 shadow-inner"
      >
        <img 
          src={book.imageUrl || `https://picsum.photos/seed/${book.id}/400/400`} 
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {book.condition === 'Donation' && (
          <div className="absolute top-2.5 left-2.5 bg-orange-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full font-black text-[7px] md:text-[9px] uppercase shadow-lg tracking-wider z-10 animate-pulse-soft">
            {t('free')}
          </div>
        )}
      </Link>
      
      {/* Information Content Section */}
      <div className="flex-grow flex flex-col justify-between py-1.5 md:py-2 min-w-0">
        <div className="space-y-3 md:space-y-4">
          <Link to={`/books/${book.id}`} className="block group/title">
            <h3 className={`text-sm sm:text-lg md:text-2xl font-black text-zinc-900 line-clamp-2 leading-[1.15] group-hover/title:text-accent transition-colors ${lang === 'bn' ? 'font-bn md:text-3xl' : ''}`}>
              {book.title}
            </h3>
            {book.author && (
              <p className="text-[9px] md:text-[11px] text-zinc-400 font-bold uppercase tracking-[0.1em] mt-2 truncate flex items-center gap-2">
                <span className="w-4 h-[1px] bg-zinc-200"></span>
                {book.author}
              </p>
            )}
          </Link>

          {/* Modern Meta Tags / Chips */}
          <div className="flex flex-wrap gap-2 md:gap-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-zinc-50/80 border border-zinc-100 rounded-xl text-zinc-600 group-hover:bg-blue-50/30 group-hover:border-blue-100/50 transition-colors max-w-full">
              <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-zinc-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
              <span className="text-[8px] md:text-[10px] font-black uppercase truncate tracking-tight">{localizedLocation}</span>
            </div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-zinc-50/80 border border-zinc-100 rounded-xl text-zinc-600 group-hover:bg-emerald-50/30 group-hover:border-emerald-100/50 transition-colors">
              <BookOpen className="w-3 h-3 md:w-3.5 md:h-3.5 text-zinc-400 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-tight">{t(book.subject as any)}</span>
            </div>
          </div>
        </div>

        {/* Pricing and Integrated Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-4 border-t border-zinc-50">
          <div className="flex flex-col gap-1">
             {book.condition === 'Donation' ? (
              <span className="text-orange-600 font-black text-sm md:text-2xl uppercase tracking-tighter">{t('free')}</span>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-zinc-400 font-bold text-xs md:text-sm">৳</span>
                <span className="text-emerald-600 font-black text-lg md:text-3xl leading-none">{book.price}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[8px] md:text-[10px] text-zinc-300 font-bold mt-1">
              <Clock className="w-2.5 h-2.5" />
              <span>{timeAgo}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {showActions ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => onEdit?.(book.id)} 
                  className="bg-zinc-100 text-zinc-600 px-4 py-2 md:px-6 md:py-3 rounded-2xl hover:bg-zinc-900 hover:text-white transition-all flex items-center gap-2.5 shadow-sm active:scale-95"
                >
                  <LayoutGrid className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest">Edit</span>
                </button>
                <button 
                  onClick={() => onDelete?.(book.id)} 
                  className="bg-red-50 text-red-500 p-2 md:p-3 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
                >
                  <PlusCircle className="w-4 h-4 md:w-5 md:h-5 rotate-45" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-3">
                <Link 
                  to={`/books/${book.id}`} 
                  className="group/btn relative bg-zinc-900 text-white px-5 py-2.5 md:px-8 md:py-4 rounded-2xl font-black text-[9px] md:text-[11px] uppercase whitespace-nowrap hover:bg-black transition-all shadow-lg active:scale-95 flex items-center gap-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  {t('details')}
                  <ChevronRight className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href={`tel:${book.contactPhone}`} 
                  className="w-10 h-10 md:w-14 md:h-14 bg-accent text-white rounded-2xl flex items-center justify-center hover:bg-accent-hover transition-all shadow-xl shadow-accent/10 active:scale-95 group/phone"
                >
                  <Phone className="w-4 h-4 md:w-5 md:h-5 group-hover/phone:rotate-12 transition-transform" />
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
