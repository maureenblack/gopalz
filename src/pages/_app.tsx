import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.scss';
import '@/styles/auth.scss';
import '@/styles/navbar.css';
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
      <Head>
        <title>GoPalz - Adventure Buddy Finder</title>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/Gopalzicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
        <meta name="theme-color" content="#4CAF50" />
        <meta name="description" content="Find adventure buddies for your next outdoor trip" />
      </Head>
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
