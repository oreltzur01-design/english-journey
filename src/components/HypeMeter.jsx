export default function HypeMeter({ hypeMeter, activeHaterEvent, isImmune }) {
  const pct = Math.max(0, Math.min(100, hypeMeter));
  const color = pct > 60 ? '#22c55e' : pct > 30 ? '#f59e0b' : '#ef4444';

  return (
    <div className="hype-meter">
      <div className="hype-header">
        <span className="hype-title">Hype Meter</span>
        <div className="hype-badges">
          {isImmune && <span className="badge badge-immune">🪨 Immune</span>}
          <span className="hype-pct">{Math.floor(pct)}%</span>
        </div>
      </div>

      <div className="hype-track">
        <div
          className="hype-fill"
          style={{ width: `${pct}%`, backgroundColor: color, transition: 'width 0.15s, background-color 0.3s' }}
        />
      </div>

      {activeHaterEvent && (
        <div className={`hater-event ${isImmune ? 'blocked' : 'active'}`}>
          {isImmune ? (
            <span>🪨 Blocked → {activeHaterEvent.message}</span>
          ) : (
            <>
              <span className="hater-icon">💢</span>
              <span>{activeHaterEvent.message}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
