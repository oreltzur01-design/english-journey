import { formatNumber } from '../gameLogic';

export default function CurrencyDisplay({ views, vps, subscribers }) {
  return (
    <div className="currency-display">
      <div className="stat">
        <span className="stat-value">{formatNumber(views)}</span>
        <span className="stat-label">Views</span>
      </div>
      <div className="stat-divider" />
      <div className="stat">
        <span className="stat-value">{formatNumber(vps)}<span className="stat-unit">/s</span></span>
        <span className="stat-label">Views/sec</span>
      </div>
      <div className="stat-divider" />
      <div className="stat">
        <span className="stat-value">{formatNumber(subscribers)}</span>
        <span className="stat-label">Subscribers</span>
      </div>
    </div>
  );
}
