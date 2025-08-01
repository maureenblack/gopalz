import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Check for saved theme preference
      const savedTheme = localStorage.getItem('theme');
      setDarkMode(savedTheme === 'dark');
      
      // Apply theme
      document.documentElement.setAttribute('data-bs-theme', savedTheme || 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode ? 'dark' : 'light';
    setDarkMode(!darkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-bs-theme', newTheme);
  };

  return (
    <>
      <Head>
        <title>GoPalz - Find Your Next Adventure Buddy</title>
        <link rel="icon" href="/Gopalzicon.png" sizes="32x32" />
        <link rel="icon" href="/Gopalzicon.png" sizes="192x192" />
        <meta name="description" content="Connect with trusted adventure buddies for your next outdoor experience" />
      </Head>

      {/* Navigation */}
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#">
            <Image src="/Gopalzlogo.svg" alt="GoPalz Logo" width={180} height={60} priority className="py-2" />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileMenu">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <a className="nav-link" href="#how-it-works">How It Works</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#adventures">Adventures</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#trust">Trust System</a>
              </li>
              <li className="nav-item me-2">
                <button 
                  className="btn btn-link nav-link" 
                  onClick={toggleTheme}
                  aria-label="Toggle dark mode"
                >
                  <span className="fs-5">{darkMode ? '☀️' : '🌙'}</span>
                </button>
              </li>
              <li className="nav-item">
                <Link href="/signup" className="btn btn-join">Join Now</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="offcanvas offcanvas-end" id="mobileMenu">
        <div className="offcanvas-header">
          <Image src="/Gopalzlogo.svg" alt="GoPalz Logo" width={150} height={50} priority className="py-2" />
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#how-it-works" data-bs-dismiss="offcanvas">How It Works</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#adventures" data-bs-dismiss="offcanvas">Adventures</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#trust" data-bs-dismiss="offcanvas">Trust System</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero min-vh-100 d-flex align-items-center position-relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="hero-bg position-absolute w-100 h-100" 
             style={{
               backgroundImage: 'url(https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3)',
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               zIndex: -2
             }}>
        </div>
        {/* Dark overlay */}
        <div className="position-absolute w-100 h-100" 
             style={{
               backgroundColor: 'rgba(0, 0, 0, 0.6)',
               zIndex: -1
             }}>
        </div>
        <div className="container text-center text-white">
          <h1 className="display-2 fw-bold mb-4 animate__animated animate__fadeIn">
            Adventure Awaits in
            <div className="mt-2 text-gradient">
              Bamenda · Douala · Limbe
            </div>
          </h1>
          <p className="lead mb-4 animate__animated animate__fadeIn animate__delay-1s fs-4">
            Connect with trusted adventure buddies and explore Cameroon's most vibrant cities together
          </p>
          <div className="d-flex justify-content-center gap-3 animate__animated animate__fadeIn animate__delay-2s">
            <Link href="/signup" className="btn btn-primary btn-lg shadow-lg px-5 py-3">
              Start Your Journey
            </Link>
            <a href="#how-it-works" className="btn btn-outline-light btn-lg px-5 py-3">
              Learn More
            </a>
          </div>
          <div className="mt-5 pt-3 animate__animated animate__fadeIn animate__delay-3s">
            <p className="mb-2">Trusted by adventurers in</p>
            <div className="d-flex justify-content-center gap-4">
              <span className="badge bg-light text-dark fs-6 px-4 py-2">Bamenda</span>
              <span className="badge bg-light text-dark fs-6 px-4 py-2">Douala</span>
              <span className="badge bg-light text-dark fs-6 px-4 py-2">Limbe</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">How It Works</h2>
          <div className="row g-4">
            {[
              {
                title: 'Create Profile',
                icon: '👤',
                description: 'Set up your verified adventure profile'
              },
              {
                title: 'Find Matches',
                icon: '🤝',
                description: 'Connect with like-minded adventurers nearby'
              },
              {
                title: 'Plan Adventures',
                icon: '🏔️',
                description: 'Organize and join exciting outdoor activities'
              }
            ].map((step, index) => (
              <div key={index} className="col-md-4">
                <div className="card h-100 border-0 text-center hover-card">
                  <div className="card-body">
                    <div className="display-4 mb-3">{step.icon}</div>
                    <h3 className="h4">{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Adventures */}
      <section id="adventures" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Featured Adventures</h2>
          <div className="row g-4">
            {[
              {
                title: 'Mountain Hiking',
                location: 'Swiss Alps',
                date: 'Aug 15, 2025',
                spots: 3,
                image: 'https://source.unsplash.com/800x600/?mountains'
              },
              {
                title: 'Rock Climbing',
                location: 'Joshua Tree',
                date: 'Sep 1, 2025',
                spots: 2,
                image: 'https://source.unsplash.com/800x600/?climbing'
              },
              {
                title: 'Kayaking',
                location: 'Lake Tahoe',
                date: 'Aug 20, 2025',
                spots: 4,
                image: 'https://source.unsplash.com/800x600/?kayak'
              }
            ].map((adventure, index) => (
              <div key={index} className="col-md-4">
                <div className="card h-100 adventure-card">
                  <img 
                    src={adventure.image} 
                    className="card-img-top" 
                    alt={adventure.title}
                  />
                  <div className="card-body">
                    <h3 className="h5">{adventure.title}</h3>
                    <p className="mb-2">
                      <i className="bi bi-geo-alt"></i> {adventure.location}
                    </p>
                    <p className="mb-2">
                      <i className="bi bi-calendar"></i> {adventure.date}
                    </p>
                    <p className="mb-0">
                      <i className="bi bi-people"></i> {adventure.spots} spots left
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="trust" className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 className="mb-4">Trust & Safety First</h2>
              <p className="lead mb-4">
                Our blockchain-powered verification system ensures every adventurer is who they say they are.
              </p>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <i className="bi bi-check-circle text-primary me-2"></i>
                  Verified profiles using Atala PRISM
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-primary me-2"></i>
                  Immutable adventure history
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle text-primary me-2"></i>
                  Earn trust badges as NFTs
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <Image 
                src="/window.svg" 
                alt="Trust System" 
                width={500} 
                height={400} 
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 bg-dark text-light">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <Image src="/file.svg" alt="GoPalz Logo" width={120} height={40} className="mb-4" />
              <p>Join our community of adventure seekers</p>
              <div className="d-flex gap-3 mb-4">
                <a href="#" className="text-light">
                  <i className="bi bi-twitter-x fs-5"></i>
                </a>
                <a href="#" className="text-light">
                  <i className="bi bi-instagram fs-5"></i>
                </a>
                <a href="#" className="text-light">
                  <i className="bi bi-facebook fs-5"></i>
                </a>
              </div>
            </div>
            <div className="col-md-6">
              <h5>Stay Updated</h5>
              <div className="input-group mb-3">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Enter your email" 
                  aria-label="Email address"
                />
                <button className="btn btn-primary" type="button">Subscribe</button>
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="row">
            <div className="col-12 text-center">
              <p className="mb-0">© 2025 GoPalz. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
