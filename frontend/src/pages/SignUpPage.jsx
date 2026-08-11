import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import '../styles/index.css';
import '../styles/auth.css';

/* ── SVG Icons ── */
const ChatBubbleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

function SignUpPage({ onSwitchToLogin }) {
  const { signUp }   = useAuth();
  const { addToast } = useToast();

  const [form, setForm]     = useState({ fullName: '', email: '', password: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, bio } = form;
    if (!fullName || !email || !password || !bio) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await signUp(fullName, email, password, bio);
      if (!data.success) {
        setError(data.message || 'Registration failed.');
        addToast(data.message || 'Registration failed.', 'error');
      } else {
        addToast('Account created! Welcome 🎉', 'success');
      }
    } catch {
      setError('Something went wrong. Please try again.');
      addToast('Connection error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-container">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Left branding */}
        <div className="auth-branding">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <ChatBubbleIcon />
            </div>
            <span className="auth-logo-text">Nexus</span>
          </div>

          <div className="auth-branding-content">
            <h1 className="auth-branding-headline">
              Join <span>Nexus</span><br />today.
            </h1>
            <p className="auth-branding-sub">
              Create your account in seconds and start messaging the people you love.
            </p>
          </div>

          <ul className="auth-feature-list">
            <li className="auth-feature-item">
              <span className="feature-icon"><CheckCircleIcon /></span>
              Free forever, no ads
            </li>
            <li className="auth-feature-item">
              <span className="feature-icon"><CheckCircleIcon /></span>
              Instant account setup
            </li>
            <li className="auth-feature-item">
              <span className="feature-icon"><CheckCircleIcon /></span>
              Custom profile &amp; avatar
            </li>
          </ul>
        </div>

        {/* Right form */}
        <div className="auth-form-panel">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Create account</h2>
            <p className="auth-form-subtitle">Get started — it's completely free</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} id="signup-form">
            {error && (
              <motion.div
                className="auth-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <AlertTriangleIcon /> {error}
              </motion.div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                name="fullName"
                className="form-input"
                type="text"
                placeholder="Your full name"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                name="email"
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                name="password"
                className="form-input"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-bio">Bio</label>
              <input
                id="signup-bio"
                name="bio"
                className="form-input"
                type="text"
                placeholder="A short bio about yourself"
                value={form.bio}
                onChange={handleChange}
                required
              />
            </div>

            <button
              id="btn-signup-submit"
              className="auth-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <><div className="spinner" /> Creating account…</>
              ) : (
                <>Create Account <ArrowRightIcon /></>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <span
              id="link-go-login"
              className="auth-switch-link"
              onClick={onSwitchToLogin}
              role="button"
            >
              Sign in
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default SignUpPage;
