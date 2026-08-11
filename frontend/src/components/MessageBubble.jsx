import { motion } from 'framer-motion';
import UserAvatar from './UserAvatar';
import '../styles/chat.css';

/* ── SVG Icons ── */
const DoubleCheckIcon = ({ color = 'currentColor' }) => (
  <svg width="16" height="12" viewBox="0 0 24 16" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 8 5 12 13 4" />
    <polyline points="8 8 12 12 20 4" />
  </svg>
);

const SingleCheckIcon = ({ color = 'currentColor' }) => (
  <svg width="12" height="12" viewBox="0 0 24 16" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 8 8 12 18 4" />
  </svg>
);

/**
 * MessageBubble — individual message with image support, seen indicator, timestamps
 */
function MessageBubble({ message, isSent, sender, onImageClick }) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      className={`message-group ${isSent ? 'sent' : 'received'}`}
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="message-row">
        {!isSent && (
          <UserAvatar user={sender} size={30} />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '100%' }}>
          {/* Image */}
          {message.image && (
            <div className="message-image">
              <img
                src={message.image}
                alt="Shared image"
                onClick={() => onImageClick?.(message.image)}
              />
            </div>
          )}

          {/* Text */}
          {message.text && (
            <div className={`message-bubble ${isSent ? 'sent' : 'received'}`}>
              {message.text}
            </div>
          )}

          {/* Meta */}
          <div
            className="message-meta"
            style={{ justifyContent: isSent ? 'flex-end' : 'flex-start' }}
          >
            <span className="message-time">{time}</span>
            {isSent && message.seen && (
              <span className="message-seen" title="Seen">
                <DoubleCheckIcon color="var(--color-primary)" />
              </span>
            )}
            {isSent && !message.seen && (
              <span className="message-seen" title="Sent">
                <SingleCheckIcon color="var(--color-text-muted)" />
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MessageBubble;
