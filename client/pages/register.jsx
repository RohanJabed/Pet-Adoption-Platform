import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiImage, FiLock } from 'react-icons/fi';
import { FaPaw } from 'react-icons/fa6';
import toast from 'react-hot-toast';

const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 transition-all";
const labelClass = "block text-sm font-semibold text-gray-500 mb-1.5";

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const validatePassword = (pwd) => {
    if (pwd.length < 6) return 'Password must be at least 6 characters long';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) { toast.error('All fields are required'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    const pwdError = validatePassword(password);
    if (pwdError) { toast.error(pwdError); return; }

    setIsLoading(true);
    try {
      await register(name, email, photoURL, password, confirmPassword);
      toast.success('Account created successfully!');
      router.replace('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-white/5 rounded-2xl p-10 shadow-xl">
        <div className="text-center mb-8">
          <FaPaw className="text-violet-600 text-5xl mx-auto mb-3 animate-bounce" />
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join our community of pet lovers</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className={labelClass}><FiUser className="inline mr-1" /> Full Name</label>
            <input type="text" placeholder="e.g. John Doe" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}><FiMail className="inline mr-1" /> Email Address</label>
            <input type="email" placeholder="e.g. john@example.com" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}><FiImage className="inline mr-1" /> Profile Picture URL (Optional)</label>
            <input type="url" placeholder="e.g. https://images.unsplash.com/..." className={inputClass} value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}><FiLock className="inline mr-1" /> Password</label>
            <input type="password" placeholder="At least 6 chars, 1 uppercase, 1 lowercase" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}><FiLock className="inline mr-1" /> Confirm Password</label>
            <input type="password" placeholder="Re-enter password" className={inputClass} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0">
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 font-semibold mt-6">
          Already have an account?{' '}
          <Link href="/login" className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent font-bold hover:underline">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
