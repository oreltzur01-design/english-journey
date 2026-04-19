import { useState, useEffect } from 'react';
import {
  isPneiBetonActive,
  canActivatePneiBeton,
  getPneiBetonRemainingMs,
  formatTime,
} from '../gameLogic';

export default function PneiBeton({ pneiBeton, onActivate }) {
  // Re-render every second to update the countdown
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const isActive = isPneiBetonActive(pneiBeton);
  const canActivate = canActivatePneiBeton(pneiBeton);
  const remainingMs = getPneiBetonRemainingMs(pneiBeton);
  const usedToday = pneiBeton.lastUsedDate === new Date().toDateString();

  let statusText;
  if (isActive) {
    statusText = `Active — immune for ${formatTime(remainingMs)} more`;
  } else if (canActivate) {
    statusText = 'Ready! Grants 2 hours of full hater immunity.';
  } else if (usedToday) {
    statusText = 'Already used today. Resets at midnight.';
  } else {
    statusText = 'Ready to activate!';
  }

  return (
    <div className={`pnei-beton-card ${isActive ? 'is-active' : ''}`}>
      <div className="pnei-header">
        <span className="pnei-icon">🪨</span>
        <span className="pnei-title">Pnei Beton — Concrete Face</span>
      </div>
      <p className="pnei-status">{statusText}</p>
      {canActivate && (
        <button className="pnei-activate-btn" onClick={onActivate}>
          Activate Concrete Face
        </button>
      )}
      {isActive && (
        <div className="pnei-active-bar">
          <div
            className="pnei-active-fill"
            style={{ width: `${(remainingMs / (2 * 60 * 60 * 1000)) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
