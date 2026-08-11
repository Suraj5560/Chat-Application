import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import UserAvatar from '../components/UserAvatar';
import axiosInstance from '../lib/axios';
import '../styles/index.css';
import '../styles/profile.css';

/* ── SVG Icons ── */
const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const CameraIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function ProfilePage({ onBack }) {
  const { authUser, updateUser } = useAuth();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState(authUser?.fullName || '');
  const [bio, setBio]           = useState(authUser?.bio || '');
  const [profilePic, setProfilePic] = useState(null);    // base64
  const [picPreview, setPicPreview] = useState(authUser?.profilePic || null);
  const [loading, setLoading]   = useState(false);

  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      addToast('Image must be under 4MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePic(reader.result);
      setPicPreview(reader.result);
    };
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
        addToast('Profile updated successfully!', 'success');
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
    <div className="profile-page">
      {/* Navbar */}
      <div className="profile-navbar">
        <button
          id="btn-back-to-chat"
          className="icon-btn"
          onClick={onBack}
          title="Back to chat"
        >
          <ArrowLeftIcon />
        </button>
        <span className="profile-navbar-logo">Nexus</span>
      </div>

      {/* Content */}
      <div className="profile-content">
        <motion.div
          className="profile-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Card header with avatar */}
          <div className="profile-card-header">
            <div className="profile-avatar-wrapper">
              {picPreview ? (
                <img
                  className="profile-avatar-img"
                  src={picPreview}
                  alt="Profile"
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  {authUser?.fullName?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
              <div
                className="profile-avatar-edit-btn"
                onClick={() => fileRef.current?.click()}
                title="Change photo"
              >
                <CameraIcon />
              </div>
              <input
                ref={fileRef}
                className="profile-avatar-input"
                id="profile-pic-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="profile-card-name">{fullName || authUser?.fullName}</div>
            <div className="profile-card-email">{authUser?.email}</div>
          </div>

          {/* Card body */}
          <div className="profile-card-body">
            {/* Info grid */}
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <span className="profile-info-label">Member since</span>
                <span className="profile-info-value">{joinDate}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Status</span>
                <span className="profile-info-value" style={{ color: 'var(--color-online)' }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
                    <circle cx="4" cy="4" r="4" fill="currentColor" />
                  </svg>
                  Active
                </span>
              </div>
            </div>

            {/* Edit form */}
            <form className="profile-form" onSubmit={handleSave} id="profile-form">
              <div className="form-group">
                <label className="form-label" htmlFor="profile-fullname">Full Name</label>
                <input
                  id="profile-fullname"
                  className="form-input"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-bio">Bio</label>
                <textarea
                  id="profile-bio"
                  className="form-input"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell people a bit about yourself…"
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                id="btn-save-profile"
                className="profile-save-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <><div className="spinner" /> Saving…</>
                ) : (
                  <><CheckIcon /> Save Changes</>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProfilePage;
