import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin, FiTwitter, FiFacebook, FiInstagram, FiGithub } from 'react-icons/fi';
import { FaPaw } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-20 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold mb-5">
              <FaPaw className="text-violet-600" />
              <span className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">Pawsitive</span>
            </Link>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Connecting loving homes with pets in need of adoption. Find your new furry, feathered, or scaled best friend today.
            </p>
            <div className="flex gap-3">
              {[
                { href: 'https://facebook.com', icon: <FiFacebook />, label: 'Facebook' },
                { href: 'https://twitter.com', icon: <FiTwitter />, label: 'Twitter' },
                { href: 'https://instagram.com', icon: <FiInstagram />, label: 'Instagram' },
                { href: 'https://github.com', icon: <FiGithub />, label: 'GitHub' },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-violet-600 hover:text-white hover:border-violet-600 hover:-translate-y-1 transition-all">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-gray-800 dark:text-white">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/all-pets', label: 'All Available Pets' },
                { href: '/login', label: 'Join Us / Register' },
                { href: '/dashboard/my-listings', label: 'Shelter Dashboard' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-gray-500 text-sm hover:text-violet-600 hover:pl-1 transition-all">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-gray-800 dark:text-white">Resources</h4>
            <ul className="space-y-3">
              {[
                { href: '#why-adopt', label: 'Why Adopt?' },
                { href: '#tips', label: 'Pet Care Tips' },
                { href: '#stories', label: 'Success Stories' },
                { href: 'https://aspca.org', label: 'ASPCA Guidelines', external: true },
              ].map(({ href, label, external }) => (
                <li key={label}>
                  <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="text-gray-500 text-sm hover:text-violet-600 hover:pl-1 transition-all">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-gray-800 dark:text-white">Contact Us</h4>
            <ul className="space-y-4">
              {[
                { icon: <FiMail className="text-violet-600 mt-0.5 shrink-0" />, text: 'adopt@pawsitive.org' },
                { icon: <FiPhone className="text-violet-600 mt-0.5 shrink-0" />, text: '+1 (555) 234-5678' },
                { icon: <FiMapPin className="text-violet-600 mt-0.5 shrink-0" />, text: '123 Adoption Ave, San Francisco, CA' },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-gray-500 text-sm">{icon}<span>{text}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Pawsitive Pet Adoption Platform. Made with love for animals.</p>
          <div className="flex items-center gap-2">
            <a href="#" className="hover:text-violet-600 transition-colors">Privacy Policy</a>
            <span>&middot;</span>
            <a href="#" className="hover:text-violet-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
