import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/chat.css';

/* ── SVG Icons ── */
const ImageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/**
 * MessageInput — text + image compose area
 */
function MessageInput({ onSend, disabled }) {
  const [text, setText]         = useState('');
  const [image, setImage]       = useState(null);    // base64
  const [preview, setPreview]   = useState(null);    // data URL for display
  const [sending, setSending]   = useState(false);
  const textareaRef             = useRef(null);
  const fileInputRef            = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert('Image must be under 4MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);   // base64 for API
      setPreview(reader.result); // same for preview
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = useCallback(async () => {
    if ((!text.trim() && !image) || sending || disabled) return;
    setSending(true);
    try {
      await onSend(text.trim(), image);
      setText('');
      clearImage();
      // reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } finally {
      setSending(false);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 10);
    }
  }, [text, image, sending, disabled, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    // Auto-resize textarea
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  };

  const canSend = (text.trim() || image) && !sending && !disabled;

  return (
    <div className="message-input-area">
      {/* Image preview */}
      <AnimatePresence>
        {preview && (
          <motion.div
            className="image-preview-container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <img className="image-preview-thumb" src={preview} alt="Preview" />
            <span className="image-preview-remove" onClick={clearImage}>
              <XIcon />
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="message-input-wrapper">
        {/* Left actions */}
        <div className="message-input-actions-left">
          <input
            ref={fileInputRef}
            id="msg-image-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <button
            id="btn-attach-image"
            className="icon-btn"
            title="Attach image"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <ImageIcon />
          </button>
        </div>

        {/* Text input */}
        <textarea
          ref={textareaRef}
          id="msg-text-input"
          className="message-text-input"
          placeholder="Type a message… (Enter to send)"
          rows={1}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          disabled={disabled || sending}
        />

        {/* Send button */}
        <motion.button
          id="btn-send-message"
          className="send-btn"
          onClick={handleSend}
          disabled={!canSend}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: canSend ? 1.08 : 1 }}
        >
          {sending ? (
            <div className="spinner" style={{ width: 16, height: 16 }} />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </motion.button>
      </div>
    </div>
  );
}

export default MessageInput;
