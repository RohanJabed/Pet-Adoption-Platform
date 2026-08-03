import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { FiSun, FiMoon, FiMenu, FiX, FiHeart, FiUser, FiLogOut, FiLayout } from 'react-icons/fi';
import { FaPaw } from 'react-icons/fa6';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, theme, toggleTheme, wishlist } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
      setShowDropdown(false);
      setIsOpen(false);
    } catch {
      toast.error('Logout failed');
    }
  };

  const isActive = (path) =>
    router.pathname === path || router.pathname.startsWith(path + '/');

  const navLinkClass = (path) =>
    `font-semibold text-sm px-3 py-2 rounded-lg flex items-center gap-2 transition-colors relative ${
      isActive(path) ? 'text-violet-600' : 'text-gray-500 hover:text-violet-600'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-white/40 dark:border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 text-2xl font-extrabold" onClick={() => setIsOpen(false)}>
          <FaPaw className="text-violet-600 text-3xl animate-bounce" />
          <span className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">Pawsitive</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className={navLinkClass('/')}>Home</Link>
          <Link href="/all-pets" className={navLinkClass('/all-pets')}>All Pets</Link>
          {user && (
            <>
              <Link href="/dashboard/my-requests" className={navLinkClass('/dashboard/my-requests')}>My Requests</Link>
              <Link href="/dashboard/add-pet" className={navLinkClass('/dashboard/add-pet')}>Add Pet</Link>
            </>
          )}

          <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 hover:text-violet-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle theme">
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>

          {user && (
            <Link href="/dashboard/wishlist" className="relative text-gray-500 hover:text-violet-600 text-xl p-2">
              <FiHeart />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="relative">
              <button
                className="rounded-full p-0.5 border-2 border-transparent focus:border-violet-500 transition-all"
                onClick={() => setShowDropdown(!showDropdown)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-violet-100 text-violet-600 font-bold flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                )}
              </button>

              {showDropdown && (
                <div className="absolute top-12 right-0 w-56 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/40 dark:border-white/5 rounded-xl shadow-xl p-2 animate-fade-in z-50">
                  <div className="px-3 py-2">
                    <p className="font-bold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <hr className="border-gray-200 dark:border-gray-700 my-1" />
                  <Link href="/dashboard/my-listings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-900/20 transition-colors">
                    <FiLayout /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors">
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-sm">
              <FiUser /> Login
            </Link>
          )}
        </div>

        {/* Mobile Icons */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={toggleTheme} className="p-2 text-gray-500 hover:text-violet-600 transition-colors">
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-800 dark:text-white">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-6 py-5 flex flex-col gap-5 z-40">
          <Link href="/" onClick={() => setIsOpen(false)} className="font-semibold text-gray-700 dark:text-gray-200">Home</Link>
          <Link href="/all-pets" onClick={() => setIsOpen(false)} className="font-semibold text-gray-700 dark:text-gray-200">All Pets</Link>
          {user && (
            <>
              <Link href="/dashboard/my-requests" onClick={() => setIsOpen(false)} className="font-semibold text-gray-700 dark:text-gray-200">My Requests</Link>
              <Link href="/dashboard/add-pet" onClick={() => setIsOpen(false)} className="font-semibold text-gray-700 dark:text-gray-200">Add Pet</Link>
              <Link href="/dashboard/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
                <FiHeart /> Wishlist ({wishlist.length})
              </Link>
              <Link href="/dashboard/my-listings" onClick={() => setIsOpen(false)} className="font-semibold text-gray-700 dark:text-gray-200">Dashboard</Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-semibold text-left">
                <FiLogOut /> Logout
              </button>
            </>
          )}
          {!user && (
            <Link href="/login" onClick={() => setIsOpen(false)} className="bg-violet-600 text-white font-semibold px-4 py-2 rounded-xl text-center">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
