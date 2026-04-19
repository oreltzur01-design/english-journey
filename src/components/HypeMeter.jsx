export default function HypeMeter({ hypeLevel }) {
  const pct = Math.min(100, Math.max(0, hypeLevel));

  let color;
  let statusText;

  if (pct >= 70) {
    color = '#00ff88';
    statusText = '🔥 You\'re on fire!';
  } else if (pct >= 40) {
    color = '#ffaa00';
    statusText = '😐 Steady growth';
  } else if (pct >= 20) {
    color = '#ff6b35';
    statusText = '😰 Losing momentum...';
  } else {
    color = '#ff3366';
    statusText = '💀 Dying channel! Post NOW!';
  }

  return (
    <div className="panel hype-meter">
      <div className="hype-header">
        <span className="hype-label">Hype Meter</span>
        <span className="hype-value" style={{ color }}>{Math.floor(pct)}%</span>
      </div>

      <div className="hype-bar-track">
        <div
          className="hype-bar-fill"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}aa, ${color})`,
            boxShadow: `0 0 10px ${color}66`,
          }}
        />
      </div>

      <div className="hype-status" style={{ color }}>
        {statusText}
      </div>
    </div>
  );
}
