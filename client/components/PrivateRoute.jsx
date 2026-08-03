import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace({ pathname: '/login', query: { from: router.asPath } });
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin" />
        <p className="text-gray-500 font-semibold">Verifying session, please wait...</p>
      </div>
    );
  }

  if (!user) return null;

  return children;
}
