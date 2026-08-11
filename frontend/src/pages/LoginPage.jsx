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

function LoginPage({ onSwitchToSignUp }) {
  const { login }   = useAuth();
  const { addToast } = useToast();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      if (!data.success) {
        setError(data.message || 'Login failed.');
        addToast(data.message || 'Login failed.', 'error');
      } else {
        addToast('Welcome back! 👋', 'success');
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
      {/* Background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Left branding panel */}
        <div className="auth-branding">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <ChatBubbleIcon />
            </div>
            <span className="auth-logo-text">Nexus</span>
          </div>

          <div className="auth-branding-content">
            <h1 className="auth-branding-headline">
              Connect. Chat.<br /><span>Anywhere.</span>
            </h1>
            <p className="auth-branding-sub">
              Real-time messaging with beautiful design. Stay connected with the people that matter.
            </p>
          </div>

          <ul className="auth-feature-list">
            <li className="auth-feature-item">
              <span className="feature-icon"><CheckCircleIcon /></span>
              End-to-end real-time messaging
            </li>
            <li className="auth-feature-item">
              <span className="feature-icon"><CheckCircleIcon /></span>
              Share images instantly
            </li>
            <li className="auth-feature-item">
              <span className="feature-icon"><CheckCircleIcon /></span>
              Online presence indicators
            </li>
            <li className="auth-feature-item">
              <span className="feature-icon"><CheckCircleIcon /></span>
              Message seen receipts
            </li>
          </ul>
        </div>

        {/* Right form panel */}
        <div className="auth-form-panel">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Welcome back</h2>
            <p className="auth-form-subtitle">Sign in to continue your conversations</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} id="login-form">
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
              <label className="form-label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="form-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              id="btn-login-submit"
              className="auth-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <><div className="spinner" /> Signing in…</>
              ) : (
                <>Sign In <ArrowRightIcon /></>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <span
              id="link-go-signup"
              className="auth-switch-link"
              onClick={onSwitchToSignUp}
              role="button"
            >
              Create one
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
