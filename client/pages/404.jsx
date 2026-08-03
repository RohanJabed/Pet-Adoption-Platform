import Link from 'next/link';
import { FaPaw } from 'react-icons/fa6';
import { FiHome } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-8xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">404</span>
          <FaPaw className="text-violet-600 text-5xl animate-bounce" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Oops! This Page is Off the Leash</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
          We searched high and low, sniffed every corner, but we couldn&apos;t find the page you&apos;re looking for. It might have run off to chase a squirrel!
        </p>
        <Link href="/" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-7 py-3 rounded-2xl transition-all hover:-translate-y-0.5 shadow-lg shadow-violet-200 dark:shadow-violet-900/30">
          <FiHome /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
