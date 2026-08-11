import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import UserAvatar from './UserAvatar';
import axiosInstance from '../lib/axios';
import '../styles/chat.css';

/* ── SVG Icons ── */
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const UsersIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CameraIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="17" x2="12" y2="22" />
    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);
const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M19 12H5M5 12l7-7M5 12l7 7" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SmallPinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
    <line x1="12" y1="17" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

/* ── My Profile Panel (embedded inside sidebar) ─────────── */
function MyProfilePanel({ onClose }) {
  const { authUser, updateUser, logout } = useAuth();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState(authUser?.fullName || '');
  const [bio, setBio] = useState(authUser?.bio || '');
  const [profilePic, setProfilePic] = useState(null);
  const [picPreview, setPicPreview] = useState(authUser?.profilePic || null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { addToast('Image must be under 4MB', 'error'); return; }
    const reader = new FileReader();
    reader.onload = () => { setProfilePic(reader.result); setPicPreview(reader.result); };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { fullName, bio };
      if (profilePic) payload.profilePic = profilePic;
      const { data } = await axiosInstance.put('/update-profile/update-profile', payload);
      if (data.success) {
        updateUser(data.user);
        addToast('Profile updated', 'success');
      } else {
        addToast(data.message || 'Update failed.', 'error');
      }
    } catch {
      addToast('Connection error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const joinDate = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (
    <motion.div
      className="my-profile-panel"
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -320, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
    >
      {/* Header */}
      <div className="my-profile-panel-header">
        <button id="btn-close-my-profile" className="icon-btn" onClick={onClose} title="Back">
          <ArrowLeftIcon />
        </button>
        <span className="my-profile-panel-title">My Profile</span>
      </div>

      {/* Body */}
      <div className="my-profile-panel-body">
        {/* Avatar hero */}
        <div className="my-profile-avatar-section">
          <div className="my-profile-avatar-wrapper">
            {picPreview ? (
              <img className="my-profile-avatar-img" src={picPreview} alt="Profile" />
            ) : (
              <div className="my-profile-avatar-placeholder">
                {authUser?.fullName?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
            <div
              className="my-profile-avatar-edit"
              onClick={() => fileRef.current?.click()}
              title="Change photo"
            >
              <CameraIcon />
            </div>
            <input
              ref={fileRef}
              id="my-profile-pic-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
          <div className="my-profile-name">{fullName || authUser?.fullName}</div>
          <div className="my-profile-email">{authUser?.email}</div>
        </div>

        {/* Info */}
        <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', padding: '0 4px' }}>
          Member since {joinDate}
        </div>

        {/* Edit form */}
        <form className="my-profile-form" onSubmit={handleSave} id="my-profile-form">
          <div className="form-group">
            <label className="form-label" htmlFor="my-profile-fullname">Full Name</label>
            <input
              id="my-profile-fullname"
              className="form-input"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="my-profile-bio">Bio</label>
            <textarea
              id="my-profile-bio"
              className="form-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people a bit about yourself…"
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
          <button id="btn-save-my-profile" className="my-profile-save-btn" type="submit" disabled={loading}>
            {loading ? <><div className="spinner" /> Saving…</> : <><CheckIcon /> Save Changes</>}
          </button>
        </form>

        {/* Logout */}
        <button
          id="btn-logout-from-profile"
          onClick={logout}
          style={{
            width: '100%',
            padding: 'var(--space-3)',
            background: 'rgba(217,123,143,0.08)',
            color: 'var(--color-error)',
            border: '1px solid rgba(217,123,143,0.2)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(217,123,143,0.15)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(217,123,143,0.08)'}
        >
          <LogOutIcon /> Log Out
        </button>
      </div>
    </motion.div>
  );
}

/* ── Sidebar ─────────────────────────────────────────────── */
function Sidebar() {
  const { users, selectedUser, selectUser, onlineUsers, unseenMessages, isLoadingUsers, pinChat, deleteChat } = useChat();
  const { authUser } = useAuth();
  const [search, setSearch] = useState('');
  const [showMyProfile, setShowMyProfile] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(420);
  const [isResizing, setIsResizing] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX;
        if (newWidth >= 200 && newWidth <= 600) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      // Disable text selection while resizing
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) =>
      u.fullName.toLowerCase().includes(q) || (u.bio || '').toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <div className="sidebar" style={{ width: sidebarWidth, minWidth: sidebarWidth }}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-text">Chats</span>
          <button className="sidebar-compose-btn" title="New chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
        <div className="sidebar-search">
          <span className="sidebar-search-icon"><SearchIcon /></span>
          <input
            id="sidebar-search-input"
            className="sidebar-search-input"
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar-users-list">
        {isLoadingUsers ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <div className="spinner spinner-lg" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon"><UsersIcon /></span>
            <p>{search ? 'No users match your search.' : 'No users found.'}</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredUsers.map((user) => {
              const isOnline = onlineUsers.includes(user._id);
              const unseen = unseenMessages[user._id] || 0;
              const isActive = selectedUser?._id === user._id;

              return (
                <motion.div
                  key={user._id}
                  className={`user-item ${isActive ? 'active' : ''}`}
                  onClick={() => selectUser(user)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <UserAvatar user={user} size={46} showOnline isOnline={isOnline} />

                  <div className="user-item-info">
                    <div className="user-item-name">{user.fullName}</div>
                    <div className="user-item-status">
                      {user.bio || 'Available'}
                    </div>
                  </div>

                  {/* Right-side section: pin indicator + badge (default) / chevron (hover) */}
                  <div className="user-item-right">
                    {/* Permanent small pin icon shown when pinned */}
                    {user.isPinned && (
                      <span className="user-item-pin-indicator" title="Pinned">
                        <SmallPinIcon />
                      </span>
                    )}

                    {/* Badge — visible at rest, hidden on hover */}
                    <div className="user-item-badge-wrap">
                      {unseen > 0 && (
                        <motion.span
                          className="badge"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          {unseen > 99 ? '99+' : unseen}
                        </motion.span>
                      )}
                    </div>

                    {/* Chevron dropdown trigger — hidden at rest, visible on hover */}
                    <button
                      className="user-item-chevron-btn"
                      title="More options"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(prev => prev === user._id ? null : user._id);
                      }}
                    >
                      <ChevronDownIcon />
                    </button>

                    {/* Dropdown context menu */}
                    {openDropdownId === user._id && (
                      <div
                        className="user-item-dropdown"
                        ref={dropdownRef}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            pinChat(user._id);
                            setOpenDropdownId(null);
                          }}
                        >
                          <PinIcon />
                          {user.isPinned ? 'Unpin chat' : 'Pin chat'}
                        </button>
                        <div className="dropdown-divider" />
                        <button
                          className="dropdown-item danger"
                          onClick={() => {
                            deleteChat(user._id);
                            setOpenDropdownId(null);
                          }}
                        >
                          <TrashIcon />
                          Delete chat
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Footer — logged-in user — click opens profile panel */}
      <div
        className="sidebar-footer"
        onClick={() => setShowMyProfile(true)}
        title="View profile"
        id="sidebar-footer-profile"
        style={{ cursor: 'pointer' }}
      >
        <UserAvatar user={authUser} size={38} />
        <div className="sidebar-footer-info">
          <div className="sidebar-footer-name">{authUser?.fullName}</div>
          <div className="sidebar-footer-email">{authUser?.email}</div>
        </div>
        <div className="sidebar-footer-actions" onClick={(e) => e.stopPropagation()}>
          <button
            id="btn-open-profile"
            className="icon-btn"
            title="Edit profile"
            onClick={(e) => { e.stopPropagation(); setShowMyProfile(true); }}
          >
            <SettingsIcon />
          </button>
        </div>
      </div>

      {/* My Profile Panel — slides in over the sidebar content */}
      <AnimatePresence>
        {showMyProfile && (
          <MyProfilePanel onClose={() => setShowMyProfile(false)} />
        )}
      </AnimatePresence>
      <div
        className={`sidebar-resizer ${isResizing ? 'is-resizing' : ''}`}
        onMouseDown={startResizing}
      />
    </div>
  );
}

export default Sidebar;
