import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: 'Bamenda' // Default city
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <>
      <Head>
        <title>Sign Up - GoPalz</title>
        <meta name="description" content="Join GoPalz and find your next adventure buddy" />
      </Head>

      <div className="min-vh-100 d-flex align-items-center py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow-lg border-0">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <Link href="/">
                      <Image src="/Gopalzlogo.svg" alt="GoPalz Logo" width={150} height={50} priority />
                    </Link>
                    <h2 className="mt-4 mb-3">Join the Adventure</h2>
                    <p className="text-muted">Connect with trusted adventure buddies in your city</p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        id="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="city" className="form-label">City</label>
                      <select
                        className="form-select form-select-lg"
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        required
                      >
                        <option value="Bamenda">Bamenda</option>
                        <option value="Douala">Douala</option>
                        <option value="Limbe">Limbe</option>
                      </select>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">
                      Create Account
                    </button>

                    <p className="text-center mb-0">
                      Already have an account?{' '}
                      <Link href="/signin" className="text-decoration-none">
                        Sign In
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
