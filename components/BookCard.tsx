
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookListing, UserProfile } from '../types';
import { MapPin, User, Phone, Info, Calendar } from 'lucide-react';
import { firebase } from '../firebase';
import { useTranslation } from '../App';

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

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-emerald-50 overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 group h-full flex flex-col text-center">
      {/* Visual Cover */}
      <Link to={`/books/${book.id}`} className="block aspect-[4/3] overflow-hidden bg-emerald-50 relative">
        <img 
          src={book.imageUrl || `https://picsum.photos/seed/${book.id}/600/450`} 
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
          loading="lazy"
        />
        {/* Tags in Top Right */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
           <div className={`px-4 py-2 rounded-full font-black shadow-lg text-[10px] border border-white/20 transform group-hover:scale-105 transition-transform ${book.condition === 'Donation' ? 'bg-orange-500 text-white' : 'bg-accent text-white'}`}>
             {book.condition === 'Donation' ? t('free') : `৳ ${book.price}`}
           </div>
           <div className="bg-white/90 backdrop-blur-md text-black px-4 py-1.5 rounded-full text-[10px] font-black shadow-md uppercase tracking-widest border border-white/10">
             {book.subject}
           </div>
        </div>
      </Link>
      
      <div className="p-6 md:p-8 flex-grow flex flex-col items-center">
        {/* Date and Condition Row */}
        <div className="flex items-center justify-center gap-2 mb-6 w-full">
          <div className="bg-zinc-50/80 px-4 py-1.5 rounded-full text-[10px] font-black text-zinc-400 uppercase tracking-widest border border-zinc-100/50">
            {new Date(book.createdAt).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="bg-zinc-50/80 px-4 py-1.5 rounded-full text-[10px] font-black text-black uppercase tracking-widest border border-zinc-100/50">
            {book.condition}
          </div>
        </div>
        
        {/* Title */}
        <Link to={`/books/${book.id}`} className="block group/title mb-2 w-full">
          <h3 className={`text-2xl font-serif font-black text-black line-clamp-1 group-hover/title:text-accent transition-colors leading-tight ${lang === 'bn' ? 'font-bn' : ''}`}>
            {book.title}
          </h3>
        </Link>

        {/* Seller - Icon on Right */}
        <p className="text-[11px] text-zinc-400 flex items-center justify-center gap-2 font-black uppercase tracking-widest mb-6">
          {seller?.username ? seller.username : (seller?.displayName || book.sellerName)}
          <User className="w-3.5 h-3.5 text-accent" />
        </p>
        
        {/* Location - Icon on Right */}
        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-tight text-black bg-emerald-50/30 px-5 py-2.5 rounded-full border border-emerald-50 w-fit mx-auto mb-8">
          <span className="truncate max-w-[150px]">{book.location.upazilaName}, {book.location.districtName}</span>
          <MapPin className="w-3.5 h-3.5 text-accent flex-shrink-0" />
        </div>

        {/* Actions */}
        <div className="mt-auto w-full">
          {showActions ? (
            <div className="flex gap-3">
              <button 
                onClick={() => onEdit?.(book.id)}
                className="flex-1 py-3.5 text-[9px] font-black bg-[#f0fdf4] text-[#065f46] rounded-2xl hover:bg-emerald-100 transition border border-emerald-100 uppercase tracking-[0.2em]"
              >
                EDIT
              </button>
              <button 
                onClick={() => onDelete?.(book.id)}
                className="flex-1 py-3.5 text-[9px] font-black bg-[#fef2f2] text-[#991b1b] rounded-2xl hover:bg-red-100 transition border border-red-100 uppercase tracking-[0.2em]"
              >
                DELETE
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link 
                to={`/books/${book.id}`}
                className="flex-grow bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-800 transition shadow-xl"
              >
                <Info className="w-4 h-4" /> {t('details')}
              </Link>
              <a 
                href={`tel:${book.contactPhone}`}
                className="w-14 h-14 bg-accent text-white rounded-2xl flex items-center justify-center hover:bg-accent-hover transition shadow-lg border border-white/10"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
