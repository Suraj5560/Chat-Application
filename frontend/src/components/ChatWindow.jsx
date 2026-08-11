import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import UserAvatar from './UserAvatar';
import '../styles/chat.css';
import '../styles/components.css';

/* ── SVG Icons ── */
const MessageCircleIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const WaveIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.5 4.27C8.21 3.47 9.27 3 10.38 3a3.12 3.12 0 0 1 3.12 3.12v5.25" />
    <path d="M4.16 11.25a3.12 3.12 0 0 1 3.28-3.12 3.12 3.12 0 0 1 2.96 3.12" />
    <path d="M13.5 11.25V6.12a3.12 3.12 0 1 1 6.24 0v5.13" />
    <path d="M16.62 11.25a3.12 3.12 0 0 1 6.24 0V15a9.36 9.36 0 0 1-9.36 9.36H12a9.36 9.36 0 0 1-9.36-9.36v-3.75a3.12 3.12 0 0 1 6.24 0" />
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M19 12H5M5 12l7-7M5 12l7 7" />
  </svg>
);

function groupMessagesByDate(messages) {
  const groups = [];
  let lastDate = null;

  messages.forEach((msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString([], {
      weekday: 'long', month: 'long', day: 'numeric',
    });
    if (date !== lastDate) {
      groups.push({ type: 'divider', label: date, key: `divider-${date}` });
      lastDate = date;
    }
    groups.push({ type: 'message', message: msg, key: msg._id });
  });

  return groups;
}

/* ── Receiver Profile Panel ────────────────────────────── */
function ReceiverProfilePanel({ user, isOnline, onClose }) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString([], {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '—';

  return (
    <motion.div
      className="receiver-profile-panel"
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
    >
      {/* Header */}
      <div className="receiver-profile-header">
        <button className="icon-btn" onClick={onClose} title="Close" id="btn-close-receiver-profile">
          <ArrowLeftIcon />
        </button>
        <span className="receiver-profile-title">Contact Info</span>
      </div>

      {/* Body */}
      <div className="receiver-profile-body">
        {/* Hero */}
        <div className="receiver-profile-hero">
          {user?.profilePic ? (
            <img 
              className="receiver-profile-avatar" 
              src={user.profilePic} 
              alt={user.fullName} 
              onClick={() => setIsImageModalOpen(true)}
            />
          ) : (
            <div className="receiver-profile-avatar-placeholder">
              {user?.fullName?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
          <div className="receiver-profile-name">{user?.fullName}</div>
          <div className={`receiver-profile-status ${isOnline ? 'receiver-profile-online' : ''}`}>
            {isOnline ? (
              <>
                <svg width="8" height="8" viewBox="0 0 8 8" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
                  <circle cx="4" cy="4" r="4" fill="currentColor" />
                </svg>
                Online
              </>
            ) : 'Offline'}
          </div>
        </div>

        {/* Info list */}
        <div className="receiver-profile-info-list">
          {user?.bio && (
            <div className="receiver-profile-info-item">
              <span className="receiver-profile-info-label">About</span>
              <span className="receiver-profile-info-value">{user.bio}</span>
            </div>
          )}
          <div className="receiver-profile-info-item">
            <span className="receiver-profile-info-label">Email</span>
            <span className="receiver-profile-info-value">{user?.email || '—'}</span>
          </div>
          <div className="receiver-profile-info-item">
            <span className="receiver-profile-info-label">Member Since</span>
            <span className="receiver-profile-info-value">{joinDate}</span>
          </div>
          <div className="receiver-profile-info-item">
            <span className="receiver-profile-info-label">Status</span>
            <span
              className="receiver-profile-info-value"
              style={{ color: isOnline ? 'var(--color-online)' : 'var(--color-text-muted)' }}
            >
              {isOnline ? (
                <>
                  <svg width="8" height="8" viewBox="0 0 8 8" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
                    <circle cx="4" cy="4" r="4" fill="currentColor" />
                  </svg>
                  Online now
                </>
              ) : (
                <>
                  <svg width="8" height="8" viewBox="0 0 8 8" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
                    <circle cx="4" cy="4" r="3.5" fill="none" stroke="currentColor" strokeWidth="1" />
                  </svg>
                  Offline
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {isImageModalOpen && user?.profilePic && (
        <div 
          className="profile-image-lightbox"
          onClick={() => setIsImageModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <button 
            style={{
              position: 'absolute',
              top: '16px', right: '24px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: '10px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => { e.stopPropagation(); setIsImageModalOpen(false); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <img 
            src={user.profilePic} 
            alt={user.fullName}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxHeight: '80vh',
              maxWidth: '80vw',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              cursor: 'default'
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

/* ── Main ChatWindow ─────────────────────────────────────── */
function ChatWindow() {
  const { selectedUser, messages, onlineUsers, sendMessage, isLoadingMessages } = useChat();
  const { authUser } = useAuth();
  const messagesEndRef = useRef(null);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [showReceiverProfile, setShowReceiverProfile] = useState(false);

  const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  // Close receiver profile when user changes
  useEffect(() => {
    setShowReceiverProfile(false);
  }, [selectedUser]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="chat-area">
        <NoChatSelected />
      </div>
    );
  }

  const grouped = groupMessagesByDate(messages);

  return (
    <div className="chat-area">
      {/* Chat Header */}
      <div className="chat-header">
        <div
          className="chat-header-user"
          onClick={() => setShowReceiverProfile((v) => !v)}
          title="View contact info"
        >
          <UserAvatar user={selectedUser} size={42} showOnline isOnline={isOnline} />
          <div className="chat-header-info">
            <div className="chat-header-name">{selectedUser.fullName}</div>
            <div className={`chat-header-status ${isOnline ? 'online' : ''}`}>
              {isOnline ? (
                <>
                  <svg width="8" height="8" viewBox="0 0 8 8" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
                    <circle cx="4" cy="4" r="4" fill="currentColor" />
                  </svg>
                  Online now
                </>
              ) : 'Offline'}
            </div>
          </div>
        </div>

        <div className="chat-header-actions">
          {/* Info / Contact profile button */}
          <button
            id="btn-receiver-info"
            className="icon-btn"
            title="Contact info"
            onClick={() => setShowReceiverProfile((v) => !v)}
          >
            <InfoIcon />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-area">
        {isLoadingMessages ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <div className="spinner spinner-lg" />
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-state" style={{ flex: 1 }}>
            <span className="empty-state-icon"><WaveIcon /></span>
            <h3>Start the conversation</h3>
            <p>Send a message to {selectedUser.fullName}</p>
          </div>
        ) : (
          <>
            {grouped.map((item) =>
              item.type === 'divider' ? (
                <div key={item.key} className="date-divider">
                  <span className="date-divider-label">{item.label}</span>
                </div>
              ) : (
                <MessageBubble
                  key={item.key}
                  message={item.message}
                  isSent={item.message.senderId === authUser?._id}
                  sender={selectedUser}
                  onImageClick={setLightboxSrc}
                />
              )
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput onSend={sendMessage} disabled={isLoadingMessages} />

      {/* Receiver Profile Panel — slides in from right */}
      <AnimatePresence>
        {showReceiverProfile && (
          <ReceiverProfilePanel
            user={selectedUser}
            isOnline={isOnline}
            onClose={() => setShowReceiverProfile(false)}
          />
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            className="image-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxSrc(null)}
          >
            <motion.img
              className="image-modal-img"
              src={lightboxSrc}
              alt="Full size"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── No Chat Selected ─────────────────────────────────────── */
function NoChatSelected() {
  return (
    <motion.div
      className="no-chat-selected"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="no-chat-icon"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MessageCircleIcon />
      </motion.div>
      <h2 className="no-chat-title">Select a conversation</h2>
      <p className="no-chat-sub">
        Choose from your contacts on the left to start chatting in real time.
      </p>
    </motion.div>
  );
}

export default ChatWindow;
