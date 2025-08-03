import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
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
  const vibrantCyan = '#00FFFF';
  const gradientBg = `linear-gradient(135deg, ${electricPurple}, ${vibrantCyan})`;

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{ background: gradientBg }}>
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
          className="navbar-toggler border-white"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          style={{ color: 'white' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
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
                  <Link href="/signup" className="btn fw-bold" style={{ backgroundColor: vibrantCyan, color: '#000' }}>Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
