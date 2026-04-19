export default function EventBanner({ event }) {
  if (!event) return null;

  const isBlocked = event.blocked;
  const isGood = event.type === 'good';

  let bannerClass = 'event-banner';
  if (isBlocked) {
    bannerClass += ' blocked';
  } else if (isGood) {
    bannerClass += ' good';
  } else {
    bannerClass += ' bad';
  }

  return (
    <div className={bannerClass}>
      <div className="event-content">
        <div className="event-name">{event.name}</div>
        <div className="event-desc">{event.desc}</div>
      </div>
    </div>
  );
}
