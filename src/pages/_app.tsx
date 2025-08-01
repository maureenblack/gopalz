import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import '@/styles/globals.scss';
import { AuthProvider } from '@/contexts/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  // Wrap the app with AuthProvider
  useEffect(() => {
    // Import Bootstrap JS only on client side
    if (typeof window !== 'undefined') {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }

    // Set initial theme based on user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const savedTheme = localStorage.getItem('theme')
    document.documentElement.setAttribute(
      'data-bs-theme',
      savedTheme || (prefersDark ? 'dark' : 'light')
    )
  }, [])

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
