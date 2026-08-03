import { useState } from 'react';
import { apiFetch } from '../utils/api';
import PetCard from '../components/PetCard';
import { FiSearch, FiFilter, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import { FaPaw } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';

const SPECIES_OPTIONS = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Reptile', 'Other'];
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export async function getServerSideProps({ query }) {
  const { search = '', species = '', sort = 'newest' } = query;
  try {
    const params = new URLSearchParams({ status: 'available' });
    if (search) params.append('search', search);
    if (species) params.append('species', species);
    if (sort) params.append('sort', sort);
    const res = await fetch(`${API_URL}/api/pets?${params}`);
    const pets = await res.json();
    return { props: { initialPets: pets, initialSearch: search, initialSpecies: species ? species.split(',') : [], initialSort: sort } };
  } catch {
    return { props: { initialPets: [], initialSearch: search, initialSpecies: [], initialSort: sort } };
  }
}

export default function AllPets({ initialPets, initialSearch, initialSpecies, initialSort }) {
  const [pets, setPets] = useState(initialPets);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [selectedSpecies, setSelectedSpecies] = useState(initialSpecies);
  const [sort, setSort] = useState(initialSort);

  const fetchPets = async (newSearch, newSpecies, newSort) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: 'available' });
      if (newSearch?.trim()) params.append('search', newSearch.trim());
      if (newSpecies?.length) params.append('species', newSpecies.join(','));
      if (newSort) params.append('sort', newSort);
      const data = await apiFetch(`/api/pets?${params}`);
      setPets(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(() => fetchPets(val, selectedSpecies, sort), 300);
  };

  const handleSpeciesToggle = (species) => {
    const updated = selectedSpecies.includes(species)
      ? selectedSpecies.filter((s) => s !== species)
      : [...selectedSpecies, species];
    setSelectedSpecies(updated);
    fetchPets(search, updated, sort);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    fetchPets(search, selectedSpecies, e.target.value);
  };

  const handleReset = () => {
    setSearch('');
    setSelectedSpecies([]);
    setSort('newest');
    fetchPets('', [], 'newest');
  };

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 transition-all";

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center max-w-xl mx-auto mb-14">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-3">All Available Pets</h1>
        <p className="text-gray-500">Browse through all our cute friends and find your perfect matching partner</p>
      </div>

      {/* Controls */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-white/5 rounded-2xl p-6 mb-10 flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4">
          <div className="relative flex items-center">
            <FiSearch className="absolute left-3 text-gray-400 pointer-events-none" />
            <input type="text" placeholder="Search pets by name..." className={inputClass} value={search} onChange={handleSearchChange} />
          </div>
          <div className="relative flex items-center">
            <FiTrendingUp className="absolute left-3 text-gray-400 pointer-events-none" />
            <select className={inputClass} value={sort} onChange={handleSortChange}>
              <option value="newest">Newest Added</option>
              <option value="feeAsc">Fee: Low to High</option>
              <option value="feeDesc">Fee: High to Low</option>
              <option value="nameAsc">Name: A to Z</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 font-bold text-sm text-gray-500"><FiFilter /> Species:</span>
          <div className="flex gap-2 flex-wrap">
            {SPECIES_OPTIONS.map((s) => (
              <button key={s} onClick={() => handleSpeciesToggle(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  selectedSpecies.includes(s)
                    ? 'bg-violet-100 text-violet-600 border-violet-400'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-violet-400 hover:text-violet-600'
                }`}>
                {s}
              </button>
            ))}
          </div>
          {(search || selectedSpecies.length > 0 || sort !== 'newest') && (
            <button onClick={handleReset} className="flex items-center gap-1 text-sm text-gray-400 hover:text-violet-600 font-semibold transition-colors">
              <FiRefreshCw /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-6">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-semibold">Finding your future companion...</p>
        </div>
      ) : pets.length > 0 ? (
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" layout>
          <AnimatePresence>
            {pets.map((pet) => <PetCard key={pet._id} pet={pet} />)}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-24 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-white/5 rounded-2xl text-center">
          <FaPaw className="text-6xl text-gray-200 dark:text-gray-700" />
          <h3 className="font-bold text-xl text-gray-800 dark:text-white">No Pets Found</h3>
          <p className="text-gray-500 text-sm max-w-sm">We couldn&apos;t find any available pets matching your current filters. Try resetting or tweaking them!</p>
          <button onClick={handleReset} className="bg-violet-600 text-white font-semibold px-5 py-2 rounded-xl text-sm hover:bg-violet-700 transition-colors">Reset All Filters</button>
        </div>
      )}
    </div>
  );
}
