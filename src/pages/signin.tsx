import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <>
      <Head>
        <title>Sign In - GoPalz</title>
        <meta name="description" content="Sign in to your GoPalz account" />
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
                    <h2 className="mt-4 mb-3">Welcome Back</h2>
                    <p className="text-muted">Sign in to continue your adventures</p>
                  </div>

                  <form onSubmit={handleSubmit}>
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

                    <div className="mb-4">
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

                    <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">
                      Sign In
                    </button>

                    <p className="text-center mb-0">
                      Don't have an account?{' '}
                      <Link href="/signup" className="text-decoration-none">
                        Sign Up
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
