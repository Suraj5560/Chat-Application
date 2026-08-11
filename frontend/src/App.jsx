import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ToastProvider } from './components/Toast';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ChatPage from './pages/ChatPage';
import './styles/index.css';
import './styles/components.css';

/* ---- Loading screen shown while checking auth ---- */
function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-logo">Nexus</div>
      <div className="spinner spinner-lg" />
    </div>
  );
}

/* ---- Main App ---- */
function AppContent() {
  const { authUser, isLoading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup'

  if (isLoading) return <LoadingScreen />;

  if (!authUser) {
    return (
      <AnimatePresence mode="wait">
        {authView === 'login' ? (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoginPage onSwitchToSignUp={() => setAuthView('signup')} />
          </motion.div>
        ) : (
          <motion.div key="signup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SignUpPage onSwitchToLogin={() => setAuthView('login')} />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <ChatProvider>
      <motion.div
        key="chat"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ height: '100vh' }}
      >
        <ChatPage />
      </motion.div>
    </ChatProvider>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
