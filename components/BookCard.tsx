
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookListing, UserProfile } from '../types';
import { MapPin, User, Phone, LayoutGrid, PlusCircle, ChevronRight } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-[2rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex flex-col h-full group hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
      {/* Image Container */}
      <Link to={`/books/${book.id}`} className="block aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-zinc-50 relative mb-5">
        <img 
          src={book.imageUrl || `https://picsum.photos/seed/${book.id}/600/450`} 
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        
        {/* Floating Badges */}
        {book.condition === 'Donation' ? (
          <>
            <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-lg font-black text-[9px] uppercase shadow-lg">
              {t('free')}
            </div>
            <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-lg font-black text-[9px] uppercase shadow-lg">
              {t('free')}
            </div>
          </>
        ) : (
          <div className="absolute top-3 right-3 bg-accent text-white px-3 py-1 rounded-lg font-black text-[9px] uppercase shadow-lg">
            ৳ {book.price}
          </div>
        )}
      </Link>
      
      {/* Content Section */}
      <div className="flex-grow flex flex-col space-y-4">
        {/* Chips */}
        <div className="flex flex-wrap gap-2">
          <span className="bg-zinc-50 px-3 py-1 rounded-lg text-[9px] font-black text-zinc-500 uppercase border border-zinc-100">
            {t(book.subject as any)}
          </span>
          <span className="bg-zinc-50 px-3 py-1 rounded-lg text-[9px] font-black text-zinc-800 uppercase border border-zinc-100">
            {t(book.condition as any)}
          </span>
        </div>
        
        {/* Title & Author */}
        <Link to={`/books/${book.id}`} className="block space-y-1">
          <h3 className={`text-xl font-black text-zinc-900 line-clamp-1 leading-tight group-hover:text-accent transition-colors ${lang === 'bn' ? 'font-bn' : ''}`}>
            {book.title}
          </h3>
          {book.author && (
            <p className="text-[11px] text-zinc-400 font-bold uppercase">{book.author}</p>
          )}
        </Link>

        {/* Seller Info */}
        <div className="flex items-center gap-2 text-zinc-400">
          <User className="w-3.5 h-3.5 text-zinc-300" />
          <span className="text-[10px] font-black uppercase truncate">
            {seller?.username || seller?.displayName || book.sellerName}
          </span>
        </div>
        
        {/* Location Pill */}
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 bg-zinc-50 px-4 py-2 rounded-xl w-fit border border-zinc-100/50">
          <MapPin className="w-3.5 h-3.5 text-accent" />
          <span className="truncate max-w-[180px]">{localizedLocation}</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex gap-3">
          {showActions ? (
            <>
              <button 
                onClick={() => onEdit?.(book.id)} 
                className="flex-1 bg-zinc-100 text-zinc-600 py-4 rounded-2xl font-black text-[10px] uppercase hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                Edit
              </button>
              <button 
                onClick={() => onDelete?.(book.id)} 
                className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              >
                <PlusCircle className="w-5 h-5 rotate-45" />
              </button>
            </>
          ) : (
            <>
              <Link 
                to={`/books/${book.id}`} 
                className="flex-grow bg-[#18181b] text-white py-4 rounded-2xl font-black text-[11px] uppercase flex items-center justify-center hover:bg-black transition-all shadow-xl shadow-zinc-900/10"
              >
                {t('details')}
              </Link>
              <a 
                href={`tel:${book.contactPhone}`} 
                className="w-14 h-14 bg-accent text-white rounded-2xl flex items-center justify-center hover:bg-accent-hover transition-all shadow-xl shadow-accent/20"
              >
                <Phone className="w-5 h-5" />
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
