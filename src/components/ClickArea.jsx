import { useState, useCallback } from 'react';
import { formatNumber } from '../gameLogic';

const STAGES = [
  { minSubs: 0, label: '🏚️ Trash City Trailer', cls: 'stage-basement' },
  { minSubs: 10000, label: '🏢 City Apartment', cls: 'stage-apartment' },
  { minSubs: 1000000, label: '🏙️ City Penthouse', cls: 'stage-penthouse' },
  { minSubs: 100000000, label: '🏛️ Luxury Villa', cls: 'stage-villa' },
];

export default function ClickArea({ onClick, clickValue, subscribers }) {
  const [floaters, setFloaters] = useState([]);

  const stage = [...STAGES].reverse().find(s => subscribers >= s.minSubs);

  const handleClick = useCallback(
    e => {
      onClick();
      const rect = e.currentTarget.getBoundingClientRect();
      const id = Date.now() + Math.random();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setFloaters(prev => [...prev.slice(-8), { id, x, y }]);
      setTimeout(() => setFloaters(prev => prev.filter(f => f.id !== id)), 900);
    },
    [onClick],
  );

  return (
    <div className="click-area-wrapper">
      <div className="stage-label">{stage.label}</div>
      <button className={`click-btn ${stage.cls}`} onClick={handleClick}>
        <span className="click-icon">📱</span>
        <span className="click-hint">TAP TO POST</span>
        <span className="click-sub">+{formatNumber(clickValue)} views per tap</span>
        {floaters.map(f => (
          <span
            key={f.id}
            className="click-floater"
            style={{ left: f.x, top: f.y }}
          >
            +{formatNumber(clickValue)}
          </span>
        ))}
      </button>
    </div>
  );
}
