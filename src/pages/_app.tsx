import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '@/styles/globals.scss';
import '@/styles/auth.scss';
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

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

  // Do not wrap auth pages with Layout
  const noLayoutPages = ["/login", "/signup"];
  const pathname = useRouter().pathname;
  const shouldUseLayout = !noLayoutPages.includes(pathname);

  return (
    <AuthProvider>
      {shouldUseLayout ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthProvider>
  )
}
