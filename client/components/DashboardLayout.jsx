import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiList, FiPlusSquare, FiActivity, FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { href: '/dashboard/my-listings', icon: <FiList />, label: 'My Listings' },
  { href: '/dashboard/add-pet', icon: <FiPlusSquare />, label: 'Add Pet' },
  { href: '/dashboard/my-requests', icon: <FiActivity />, label: 'My Requests' },
  { href: '/dashboard/wishlist', icon: <FiHeart />, label: 'My Wishlist' },
];

export default function DashboardLayout({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
        {/* Sidebar */}
        <aside className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-white/5 rounded-2xl p-6">
          <div className="flex flex-col items-center text-center gap-3 mb-8">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 shadow-sm" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-violet-100 text-violet-600 text-4xl font-extrabold flex items-center justify-center">
                {user?.name?.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-bold text-gray-800 dark:text-white">{user?.name}</h3>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map(({ href, icon, label }) => (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  router.pathname === href
                    ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600'
                    : 'text-gray-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600'
                }`}>
                <span className="text-lg">{icon}</span>
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
