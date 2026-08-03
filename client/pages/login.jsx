import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { FiMail, FiLock } from 'react-icons/fi';
import { FaGoogle, FaPaw } from 'react-icons/fa6';
import toast from 'react-hot-toast';

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 transition-all';
const labelClass = 'block text-sm font-semibold text-gray-500 mb-1.5';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const from = router.query.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      router.replace(from);
    } catch (err) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Real Google OAuth — opens Google's native popup
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      try {
        // Fetch the user's real profile from Google using the access token
        const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await profileRes.json();

        await loginWithGoogle({
          name: profile.name,
          email: profile.email,
          photoURL: profile.picture,
        });

        toast.success(`Welcome, ${profile.name}!`);
        router.replace(from);
      } catch (err) {
        toast.error(err.message || 'Google login failed');
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error('Google sign-in was cancelled or failed');
    },
  });

  const isAnyLoading = isLoading || isGoogleLoading;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-white/5 rounded-2xl p-10 shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <FaPaw className="text-violet-600 text-5xl mx-auto mb-3 animate-bounce" />
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm mt-1">Find your new furry best friend today</p>
        </div>

        {/* Google Button */}
        <button
          onClick={() => handleGoogleLogin()}
          disabled={isAnyLoading}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 transition-all disabled:opacity-60 shadow-sm mb-6"
        >
          {isGoogleLoading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-[#4285F4] rounded-full animate-spin" />
          ) : (
            <GoogleColorIcon />
          )}
          {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <hr className="flex-1 border-gray-200 dark:border-gray-700" />
          <span className="text-xs text-gray-400 font-semibold">or sign in with email</span>
          <hr className="flex-1 border-gray-200 dark:border-gray-700" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className={labelClass}>
              <FiMail className="inline mr-1" /> Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. adopt@pawsitive.org"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>
              <FiLock className="inline mr-1" /> Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isAnyLoading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 shadow-md shadow-violet-200 dark:shadow-violet-900/30"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 font-semibold mt-6">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent font-bold hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

// Official Google colored SVG icon
function GoogleColorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
