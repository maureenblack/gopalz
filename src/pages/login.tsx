import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/contexts/AuthContext';


export default function Login() {
  const { login, googleSignIn, appleSignIn } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required')
    }),
    onSubmit: async (values) => {
      try {
        setError('');
        setLoading(true);
        await login(values.email, values.password);
        router.push('/dashboard');
      } catch (err: any) {
        setError(err.message || 'Failed to sign in');
      } finally {
        setLoading(false);
      }
    }
  });

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await googleSignIn();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await appleSignIn();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Apple');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Head>
        <title>Sign In - GoPalz</title>
        <meta name="description" content="Sign in to your GoPalz account" />
      </Head>

      <nav className="navbar navbar-expand-lg auth-navbar">
        <div className="container">
          <Link href="/" className="navbar-brand">
            <Image
              src="/Gopalzlogo.svg"
              alt="GoPalz"
              width={120}
              height={40}
              priority
            />
          </Link>
          <div className="d-flex align-items-center gap-3">
            <Link href="/" className="nav-link">
              Back to Home
            </Link>
            <Link href="/signup" className="btn btn-outline-light">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <div className="auth-content">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="auth-form">
                <div className="text-center mb-4">
                  <h2 className="h3 mb-3">Welcome Back!</h2>
                  <p className="text-muted">Sign in to continue your adventure</p>
                </div>


                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`form-control ${
                        formik.touched.email && formik.errors.email ? 'is-invalid' : ''
                      }`}
                      {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="invalid-feedback">{formik.errors.email}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      className={`form-control ${
                        formik.touched.password && formik.errors.password ? 'is-invalid' : ''
                      }`}
                      {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password && (
                      <div className="invalid-feedback">{formik.errors.password}</div>
                    )}
                  </div>

                  <div className="mb-4 text-end">
                    <Link href="/reset-password" className="text-decoration-none">
                      Forgot Password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  <div className="text-center mb-3">
                    <span className="text-muted">or continue with</span>
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="btn btn-outline-dark w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
                      disabled={loading}
                    >
                      <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                          <path fill="currentColor" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                          <path fill="currentColor" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                          <path fill="currentColor" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                          <path fill="currentColor" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                        </g>
                      </svg>
                      Continue with Google
                    </button>
                    <button
                      type="button"
                      onClick={handleAppleSignIn}
                      className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2"
                      disabled={loading}
                    >
                      <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.88-3.08.41-1.07-.48-2.05-.48-3.17 0-1.45.62-2.21.44-3.08-.41-4.64-4.75-3.84-11.48 1.45-11.73.91.03 1.57.31 2.14.63.41.23.77.44 1.13.44.33 0 .66-.19 1.03-.4.63-.36 1.32-.66 2.3-.67 1.01.03 1.92.39 2.62 1.07-2.31 1.37-1.93 4.91.72 5.91-.55 1.82-1.28 3.62-2.06 5.39l-.01.01z"/>
                        <path fill="currentColor" d="M12.74 4.19c.47-1.36-.34-2.8-.95-3.56-.68-.84-1.85-1.42-2.81-1.46-.15 1.22.35 2.43.89 3.19.62.87 1.79 1.49 2.87 1.43z"/>
                      </svg>
                      Continue with Apple
                    </button>
                  </div>

                  <div className="text-center mt-4">
                    <span className="text-muted">Don't have an account? </span>
                    <Link href="/signup" className="text-decoration-none">
                      Sign up
                    </Link>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="auth-footer">
        <div className="container">
          <p className="mb-0">&copy; {new Date().getFullYear()} GoPalz. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
