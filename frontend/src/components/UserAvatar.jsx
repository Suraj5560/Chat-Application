import '../styles/components.css';

/**
 * UserAvatar — shows profile pic or initials placeholder with optional online indicator
 * @param {object}  user        - user object with fullName & profilePic
 * @param {number}  size        - diameter in px (default 40)
 * @param {boolean} showOnline  - whether to show the online dot
 * @param {boolean} isOnline    - whether the user is actually online
 */
function UserAvatar({ user, size = 40, showOnline = false, isOnline = false }) {
  const initial = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : '?';

  const fontSize = Math.round(size * 0.38);
  const ringSize = Math.max(8, Math.round(size * 0.22));

  return (
    <div 
      className="user-avatar" 
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      {user?.profilePic ? (
        <img
          className="user-avatar-img"
          src={user.profilePic}
          alt={user.fullName}
          width={size}
          height={size}
        />
      ) : (
        <div
          className="user-avatar-placeholder"
          style={{ width: size, height: size, fontSize }}
        >
          {initial}
        </div>
      )}

      {showOnline && (
        <span
          className={`online-ring ${isOnline ? 'is-online' : 'is-offline'}`}
          style={{ width: ringSize, height: ringSize }}
        />
      )}
    </div>
  );
}

export default UserAvatar;
