import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function About() {
  return (
    <>
      <Head>
        <title>About GoPalz - Your Adventure Companion</title>
        <meta name="description" content="Learn about GoPalz - connecting adventure enthusiasts in Bamenda, Douala, and Limbe" />
      </Head>

      {/* Navigation */}
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container">
          <Link href="/" className="navbar-brand">
            <Image src="/Gopalzlogo.svg" alt="GoPalz Logo" width={180} height={60} priority className="py-2" />
          </Link>
        </div>
      </nav>

      {/* About Hero */}
      <section className="min-vh-100 d-flex align-items-center position-relative overflow-hidden pt-5">
        <div className="position-absolute w-100 h-100" style={{ zIndex: -1 }}>
          <Image
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Adventure background"
            fill
            style={{ 
              objectFit: 'cover', 
              objectPosition: 'center',
              filter: 'brightness(0.5)'
            }}
            priority
          />
        </div>

        <div className="container text-white py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="display-3 fw-bold mb-4 animate__animated animate__fadeIn">
                Your Adventure Starts Here
              </h1>
              <div className="lead fs-4 mb-5 animate__animated animate__fadeIn animate__delay-1s">
                GoPalz is revolutionizing how adventure enthusiasts connect in Cameroon's most vibrant cities. We're building a community of trusted adventure buddies in Bamenda, Douala, and Limbe.
              </div>
            </div>
          </div>

          <div className="row g-4 mt-3">
            <div className="col-md-4 animate__animated animate__fadeIn animate__delay-2s">
              <div className="p-4 rounded-3 bg-white bg-opacity-10 h-100">
                <h3 className="text-secondary mb-3">Trust System</h3>
                <p>Our blockchain-powered trust verification ensures you're connecting with reliable adventure partners.</p>
              </div>
            </div>
            <div className="col-md-4 animate__animated animate__fadeIn animate__delay-2s">
              <div className="p-4 rounded-3 bg-white bg-opacity-10 h-100">
                <h3 className="text-secondary mb-3">Local Focus</h3>
                <p>We're focused on Bamenda, Douala, and Limbe to create tight-knit communities of local adventurers.</p>
              </div>
            </div>
            <div className="col-md-4 animate__animated animate__fadeIn animate__delay-2s">
              <div className="p-4 rounded-3 bg-white bg-opacity-10 h-100">
                <h3 className="text-secondary mb-3">Safe Adventures</h3>
                <p>Every adventure is verified and rated, ensuring safe and memorable experiences for everyone.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-5 pt-4 animate__animated animate__fadeIn animate__delay-3s">
            <Link href="/signup" className="btn btn-primary btn-lg px-5 py-3 me-3">
              Join the Community
            </Link>
            <Link href="/" className="btn btn-outline-light btn-lg px-5 py-3">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
