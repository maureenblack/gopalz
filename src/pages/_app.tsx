import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Import Bootstrap JS
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
    
    // Set initial theme based on user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const savedTheme = localStorage.getItem('theme')
    document.documentElement.setAttribute(
      'data-bs-theme',
      savedTheme || (prefersDark ? 'dark' : 'light')
    )
  }, [])

  return <Component {...pageProps} />
}
