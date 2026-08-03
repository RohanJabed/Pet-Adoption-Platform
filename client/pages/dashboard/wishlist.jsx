import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import PrivateRoute from '../../components/PrivateRoute';
import DashboardLayout from '../../components/DashboardLayout';
import PetCard from '../../components/PetCard';
import { FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function MyWishlist() {
  const { wishlist, refreshWishlist } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { await refreshWishlist(); }
      catch { toast.error('Failed to load wishlist items'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) {
    return (
      <PrivateRoute>
        <DashboardLayout>
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-6">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin" />
            <p className="text-gray-500 font-semibold">Loading your wishlist...</p>
          </div>
        </DashboardLayout>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute>
      <DashboardLayout>
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-white/5 rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Wishlist</h2>
            <p className="text-sm text-gray-500 mt-1">Your saved pet listings. Access their detailed profiles to apply for adoption</p>
          </div>

          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 py-2">
              {wishlist.map((pet) => <PetCard key={pet._id} pet={pet} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <FiHeart className="text-5xl text-gray-300 dark:text-gray-700" />
              <p className="text-gray-500">Your wishlist is currently empty.</p>
              <Link href="/all-pets" className="bg-violet-600 text-white font-semibold px-5 py-2 rounded-xl text-sm hover:bg-violet-700 transition-colors">
                Browse Pets & Save Some!
              </Link>
            </div>
          )}
        </div>
      </DashboardLayout>
    </PrivateRoute>
  );
}
