import { createContext, useState, useEffect, useContext } from 'react';
import { apiFetch } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    const root = document.documentElement;
    root.setAttribute('data-theme', saved);
    if (saved === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = await apiFetch('/api/auth/me');
        setUser(userData);
        if (userData) {
          const wishlistData = await apiFetch('/api/wishlist');
          setWishlist(wishlistData || []);
        }
      } catch {
        setUser(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const data = await apiFetch('/api/wishlist');
      setWishlist(data || []);
    } catch (err) {
      console.error('Error fetching wishlist:', err.message);
    }
  };

  const addToWishlist = async (petId) => {
    if (!user) return false;
    try {
      await apiFetch('/api/wishlist', { method: 'POST', body: { petId } });
      await fetchWishlist();
      return true;
    } catch (err) {
      throw err;
    }
  };

  const removeFromWishlist = async (petId) => {
    if (!user) return false;
    try {
      await apiFetch(`/api/wishlist/${petId}`, { method: 'DELETE' });
      setWishlist((prev) => prev.filter((p) => p._id !== petId));
      return true;
    } catch (err) {
      throw err;
    }
  };

  const isInWishlist = (petId) => wishlist.some((p) => p._id === petId);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const userData = await apiFetch('/api/auth/login', { method: 'POST', body: { email, password } });
      if (userData.token) localStorage.setItem('token', userData.token);
      setUser(userData);
      const wishlistData = await apiFetch('/api/wishlist');
      setWishlist(wishlistData || []);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, photoURL, password, confirmPassword) => {
    setLoading(true);
    try {
      const userData = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: { name, email, photoURL, password, confirmPassword },
      });
      if (userData.token) localStorage.setItem('token', userData.token);
      setUser(userData);
      setWishlist([]);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (googleProfile) => {
    setLoading(true);
    try {
      const userData = await apiFetch('/api/auth/google-login', { method: 'POST', body: googleProfile });
      if (userData.token) localStorage.setItem('token', userData.token);
      setUser(userData);
      const wishlistData = await apiFetch('/api/wishlist');
      setWishlist(wishlistData || []);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err.message);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setWishlist([]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user, loading, wishlist, theme, toggleTheme,
        login, register, loginWithGoogle, logout,
        addToWishlist, removeFromWishlist, isInWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
