import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  // Mobile menu styling is in src/styles/navbar.css
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Brand colors
  const electricPurple = '#8A2BE2';
  const gold = '#FFD700';
  const darkGold = '#DAA520'; // For hover states
  const lightPurple = '#B185DB'; // For accents and hover states

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{ backgroundColor: electricPurple }}>
      <div className="container">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <Image
            src="/Gopalzlogo.svg"
            alt="GoPalz"
            width={120}
            height={40}
            priority
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          style={{ backgroundColor: 'white', borderColor: electricPurple }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div 
          className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} 
          id="navbarNav" 
          style={{ 
            backgroundColor: electricPurple,
            position: isOpen ? 'absolute' : 'static',
            top: isOpen ? '56px' : 'auto',
            left: isOpen ? '0' : 'auto',
            right: isOpen ? '0' : 'auto',
            width: isOpen ? '100%' : 'auto',
            padding: isOpen ? '1rem' : '0',
            zIndex: 1000,
            boxShadow: isOpen ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
          }}
        >
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                href="/trips" 
                className={`nav-link fw-bold text-white ${router.pathname.startsWith('/trips') ? 'active' : ''}`}
              >
                Adventures
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link 
                  href="/trips/create" 
                  className={`nav-link fw-bold text-white ${router.pathname === '/trips/create' ? 'active' : ''}`}
                >
                  Create Trip
                </Link>
              </li>
            )}
          </ul>
          
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white fw-bold"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user.displayName || user.email}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link href="/dashboard" className="dropdown-item">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile" className="dropdown-item">
                        Profile
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button onClick={handleLogout} className="dropdown-item text-danger">
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/login" className="nav-link text-white fw-bold">Sign In</Link>
                </li>
                <li className="nav-item">
                  <Link href="/signup" className="btn fw-bold" style={{ backgroundColor: gold, color: '#000' }}>Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
