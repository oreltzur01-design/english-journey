export default function Notification({ notification, onDismiss }) {
  if (!notification) return null;

  return (
    <div className="notification-banner" onClick={onDismiss} role="alert">
      <span className="notif-emoji">{notification.milestone?.emoji ?? '🎉'}</span>
      <div className="notif-body">
        <div className="notif-title">{notification.milestone?.name ?? 'Achievement!'}</div>
        {notification.milestone?.description && (
          <div className="notif-desc">{notification.milestone.description}</div>
        )}
      </div>
      <button className="notif-close" aria-label="Dismiss">×</button>
    </div>
  );
}
