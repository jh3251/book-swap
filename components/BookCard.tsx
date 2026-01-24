
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookListing, UserProfile } from '../types';
import { MapPin, User, Phone, Info } from 'lucide-react';
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
      } catch (e) {
        console.warn("Could not fetch seller for card preview");
      }
    };
    fetchSeller();
  }, [book.sellerId]);

  const localizedLocation = useMemo(() => {
    if (lang !== 'bn') return `${book.location.upazilaName}, ${book.location.districtName}`;
    
    const upazila = UPAZILAS.find(u => u.id === book.location.upazilaId);
    const district = DISTRICTS.find(d => d.id === book.location.districtId);
    
    return `${upazila?.nameBn || book.location.upazilaName}, ${district?.nameBn || book.location.districtName}`;
  }, [book.location, lang]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      <Link to={`/books/${book.id}`} className="block aspect-[4/3] overflow-hidden bg-zinc-50 relative">
        <img 
          src={book.imageUrl || `https://picsum.photos/seed/${book.id}/600/450`} 
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
           <div className={`px-3 py-1.5 rounded-lg font-bold shadow-sm text-xs border border-white/20 ${book.condition === 'Donation' ? 'bg-orange-500 text-white' : 'bg-accent text-white'}`}>
             {book.condition === 'Donation' ? t('free') : `৳ ${book.price}`}
           </div>
        </div>
        {book.condition === 'Donation' && (
          <div className="absolute top-3 left-3">
             <div className="bg-orange-500 text-white px-2 py-1 rounded-md font-bold text-[10px] uppercase shadow-sm">
                {lang === 'bn' ? 'ফ্রি' : 'FREE'}
             </div>
          </div>
        )}
      </Link>
      
      <div className="p-5 md:p-6 flex-grow flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-zinc-50 px-2.5 py-1 rounded-md text-[10px] font-bold text-zinc-500 uppercase">
            {t(book.subject as any)}
          </span>
          <span className="bg-zinc-50 px-2.5 py-1 rounded-md text-[10px] font-bold text-zinc-800 uppercase">
            {t(book.condition as any)}
          </span>
        </div>
        
        <Link to={`/books/${book.id}`} className="block mb-2">
          <h3 className={`text-lg font-serif font-bold text-zinc-900 line-clamp-1 hover:text-accent transition-colors ${lang === 'bn' ? 'font-bn' : ''}`}>
            {book.title}
          </h3>
        </Link>

        <p className="text-[11px] text-zinc-400 flex items-center gap-2 font-medium mb-5 uppercase tracking-wide">
          <User className="w-3 h-3 text-accent" />
          {seller?.username || seller?.displayName || book.sellerName}
        </p>
        
        <div className="flex items-center gap-2 text-[10px] font-semibold text-zinc-500 bg-zinc-50 px-3 py-2 rounded-lg w-fit mb-6">
          <MapPin className="w-3 h-3 text-accent" />
          <span className="truncate max-w-[200px]">{localizedLocation}</span>
        </div>

        <div className="mt-auto flex gap-2">
          {showActions ? (
            <>
              <button onClick={() => onEdit?.(book.id)} className="flex-1 py-2.5 text-[10px] font-bold bg-zinc-50 text-zinc-600 rounded-xl hover:bg-emerald-50 hover:text-accent transition uppercase tracking-wider">
                Edit
              </button>
              <button onClick={() => onDelete?.(book.id)} className="flex-1 py-2.5 text-[10px] font-bold bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition uppercase tracking-wider">
                Delete
              </button>
            </>
          ) : (
            <>
              <Link to={`/books/${book.id}`} className="flex-grow bg-zinc-900 text-white py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-zinc-800 transition shadow-sm">
                {t('details')}
              </Link>
              <a href={`tel:${book.contactPhone}`} className="w-11 h-11 bg-accent text-white rounded-xl flex items-center justify-center hover:bg-accent-hover transition shadow-sm">
                <Phone className="w-4 h-4" />
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
