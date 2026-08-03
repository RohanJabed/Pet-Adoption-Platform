import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import AdoptionModal from '../../components/AdoptionModal';
import { FiHeart, FiMapPin, FiCheck, FiInfo, FiArrowLeft, FiDollarSign } from 'react-icons/fi';
import { FaHeart, FaPaw } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export async function getServerSideProps({ params }) {
  try {
    const res = await fetch(`${API_URL}/api/pets/${params.id}`);
    if (!res.ok) return { notFound: true };
    const pet = await res.json();
    return { props: { pet } };
  } catch {
    return { notFound: true };
  }
}

export default function PetDetails({ pet: initialPet }) {
  const router = useRouter();
  const { user, addToWishlist, removeFromWishlist, isInWishlist } = useAuth();
  const [pet, setPet] = useState(initialPet);
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const isSaved = isInWishlist(pet._id);
  const isOwner = user && user.email === pet.ownerEmail;
  const isAdopted = pet.status === 'adopted';

  const refreshPet = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pets/${pet._id}`);
      const updated = await res.json();
      setPet(updated);
    } catch {}
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please log in to add pets to your wishlist');
      router.push({ pathname: '/login', query: { from: router.asPath } });
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
    } catch {
      toast.error('Failed to update wishlist');
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleAdoptClick = () => {
    if (!user) {
      toast.error('Please log in to submit an adoption request');
      router.push({ pathname: '/login', query: { from: router.asPath } });
      return;
    }
    setShowAdoptModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <Link href="/all-pets" className="inline-flex items-center gap-2 font-bold text-gray-500 hover:text-violet-600 mb-8 transition-colors">
        <FiArrowLeft /> Back to All Pets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.5fr] gap-16 items-start">
        {/* Left */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
            <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
            <span className={`absolute top-5 left-5 text-sm font-bold uppercase tracking-wide px-4 py-1.5 rounded-full ${isAdopted ? 'bg-red-100 text-red-500 border border-red-200' : 'bg-green-100 text-green-600 border border-green-200'}`}>
              {isAdopted ? 'Adopted' : 'Available'}
            </span>
          </div>

          <div className="mt-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-5">Health & Care Record</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <FiCheck className="text-green-500 text-xl mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-gray-800 dark:text-white">Vaccination Status</h4>
                  <p className="text-sm text-gray-500">{pet.vaccinationStatus}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiInfo className="text-violet-600 text-xl mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-gray-800 dark:text-white">Health Status</h4>
                  <p className="text-sm text-gray-500">{pet.healthStatus}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-between items-start mb-6 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-violet-100 text-violet-600 border border-violet-200">{pet.species}</span>
              <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white mt-2">{pet.name}</h1>
              <p className="text-xl text-gray-500 font-medium">{pet.breed}</p>
            </div>
            {!isAdopted && (
              <button onClick={handleWishlistToggle} disabled={isWishlistLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-semibold text-sm transition-all ${isSaved ? 'bg-red-50 border-red-300 text-red-500 dark:bg-red-900/20' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 hover:bg-violet-50 hover:border-violet-400 hover:text-violet-600'}`}>
                {isSaved ? <FaHeart className="text-red-500" /> : <FiHeart />}
                {isSaved ? 'Saved' : 'Wishlist'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {[{ label: 'Age', value: pet.age }, { label: 'Gender', value: pet.gender }, { label: 'Location', value: pet.location }].map(({ label, value }) => (
              <div key={label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
                <span className="block text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">{label}</span>
                <span className="font-bold text-gray-800 dark:text-white text-sm flex items-center justify-center gap-1">
                  {label === 'Location' && <FiMapPin className="text-violet-600" />}{value}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-white/5 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 text-gray-500 font-bold text-sm mb-1"><FiDollarSign /> Adoption Fee</div>
            <h2 className="text-4xl font-extrabold text-violet-600">${pet.adoptionFee}</h2>
            <p className="text-xs text-gray-400 mt-1">This fee helps cover medical care, vaccinations, and shelter upkeep.</p>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-3">About {pet.name}</h3>
            <p className="text-gray-500 leading-relaxed">{pet.description}</p>
          </div>

          <div className="flex items-center gap-3 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-white/5 rounded-xl px-5 py-4 mb-6">
            <FaPaw className="text-violet-600 text-2xl" />
            <div>
              <h4 className="font-bold text-sm text-gray-800 dark:text-white">Listed by Shelter/Owner</h4>
              <p className="text-sm text-gray-500">Email: <span className="font-bold text-violet-600">{pet.ownerEmail}</span></p>
            </div>
          </div>

          {isAdopted ? (
            <button disabled className="w-full bg-violet-600 text-white font-bold py-4 rounded-2xl opacity-60 cursor-not-allowed">Adopted (Happy Tails!)</button>
          ) : isOwner ? (
            <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-5 text-center flex flex-col gap-3">
              <p className="text-violet-600 font-semibold text-sm">You listed this pet. You can manage requests in your dashboard.</p>
              <Link href="/dashboard/my-listings" className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-3 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center block">
                Go to My Listings Dashboard
              </Link>
            </div>
          ) : (
            <button onClick={handleAdoptClick} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-2xl text-lg transition-all hover:-translate-y-0.5 shadow-lg shadow-violet-200 dark:shadow-violet-900/30">
              Adopt {pet.name} Now
            </button>
          )}
        </motion.div>
      </div>

      {showAdoptModal && (
        <AdoptionModal pet={pet} onClose={() => setShowAdoptModal(false)} onSuccess={refreshPet} />
      )}
    </div>
  );
}
