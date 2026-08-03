import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg, #fff)',
              color: 'var(--toast-color, #1a1a2e)',
              border: '1px solid var(--toast-border, #e5e7eb)',
              borderRadius: '14px',
              fontSize: '0.95rem',
              boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
            },
          }}
        />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
