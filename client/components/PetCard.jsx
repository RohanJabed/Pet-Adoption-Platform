import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { FiHeart, FiMapPin, FiEye } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function PetCard({ pet }) {
  const { user, addToWishlist, removeFromWishlist, isInWishlist } = useAuth();
  const router = useRouter();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const isSaved = isInWishlist(pet._id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please log in to add pets to your wishlist');
      router.push('/login');
      return;
    }
    setIsWishlistLoading(true);
    try {
      if (isSaved) {
        await removeFromWishlist(pet._id);
        toast.success(`${pet.name} removed from wishlist!`);
      } else {
        await addToWishlist(pet._id);
        toast.success(`${pet.name} added to wishlist!`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update wishlist');
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -6, boxShadow: '0 16px 36px rgba(120,110,200,0.12)' }}
    >
      <div className="relative h-56 overflow-hidden">
        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />

        <span className={`absolute top-3 left-3 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${
          pet.status === 'available'
            ? 'bg-green-100 text-green-600 border border-green-200'
            : 'bg-red-100 text-red-500 border border-red-200'
        }`}>
          {pet.status === 'available' ? 'Available' : 'Adopted'}
        </span>

        {pet.status === 'available' && (
          <button
            className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-white/40 flex items-center justify-center text-lg transition-all hover:scale-110 ${isSaved ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
          >
            {isSaved ? <FaHeart className="text-red-500" /> : <FiHeart />}
          </button>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-grow">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-violet-100 text-violet-600 border border-violet-200">{pet.species}</span>
          <span className="font-extrabold text-violet-600 text-lg">${pet.adoptionFee}</span>
        </div>
        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{pet.name}</h3>
        <p className="text-gray-500 text-sm">{pet.breed} &bull; {pet.age}</p>
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <FiMapPin className="text-violet-600" />
          <span>{pet.location}</span>
        </div>
        <Link href={`/pets/${pet._id}`} className="mt-auto flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold px-4 py-2 rounded-xl text-sm transition-all">
          <FiEye /> View Details
        </Link>
      </div>
    </motion.div>
  );
}
