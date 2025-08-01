import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/hooks/useTheme';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <Image src="/icon.svg" alt="GoPalz Logo" width={40} height={40} className="me-2" />
          <span className="brand-text">GoPalz</span>
        </Link>

        <button 
          className={`navbar-toggler ${isMobileMenuOpen ? '' : 'collapsed'}`}
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="#how-it-works" className="nav-link">How It Works</Link>
            </li>
            <li className="nav-item">
              <Link href="#adventures" className="nav-link">Adventures</Link>
            </li>
            <li className="nav-item">
              <Link href="#trust" className="nav-link">Trust & Safety</Link>
            </li>
            <li className="nav-item ms-lg-3">
              <button 
                className="btn btn-theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </button>
            </li>
            <li className="nav-item ms-lg-3">
              <Link href="/signup" className="btn btn-primary">Get Started</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
