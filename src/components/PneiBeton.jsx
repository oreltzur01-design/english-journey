import { PNEI_BETON_MAX_SECONDS } from '../game/constants.js';

function fmtTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function PneiBeton({ pneiBeton, traits, activatePneiBeton, deactivatePneiBeton }) {
  const unlocked = traits.pnei_beton_unlocked;
  const { active, windowRemaining } = pneiBeton;
  const windowPct = (windowRemaining / PNEI_BETON_MAX_SECONDS) * 100;
  const hasWindow = windowRemaining > 0;

  let panelClass = 'panel pnei-beton';
  if (!unlocked) panelClass += ' locked';
  if (active) panelClass += ' active-panel';

  return (
    <div className={panelClass}>
      <div className="panel-title">🪨 Pnei Beton</div>

      {!unlocked ? (
        <div className="pnei-locked-msg">
          🏆 Reach <strong>10,000 subscribers</strong> to unlock<br />
          <span style={{ fontSize: '0.65rem', color: '#444' }}>
            Concrete Face: immunity to Negative Energy
          </span>
        </div>
      ) : !active ? (
        <>
          <div className="pnei-window-info">
            Daily window:{' '}
            <span className="pnei-window-time">{fmtTime(windowRemaining)}</span>{' '}
            remaining
          </div>
          <div
            style={{
              height: '4px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginBottom: '10px',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${windowPct}%`,
                background: 'linear-gradient(90deg, #666, #aaa)',
                borderRadius: '2px',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
          <button
            className="pnei-activate-btn"
            onClick={activatePneiBeton}
            disabled={!hasWindow}
          >
            {hasWindow ? '🪨 Activate Concrete Face' : '⏳ Daily window exhausted'}
          </button>
        </>
      ) : (
        <>
          <div className="pnei-active-display">
            <div className="pnei-active-title">CONCRETE FACE ACTIVE</div>
            <div className="pnei-active-subtitle">— Immune to Negative Energy —</div>
            <div className="pnei-remaining">⏱ {fmtTime(windowRemaining)}</div>
          </div>

          <div
            style={{
              height: '4px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginBottom: '10px',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${windowPct}%`,
                background: 'linear-gradient(90deg, #555, #999)',
                borderRadius: '2px',
                transition: 'width 0.5s ease',
              }}
            />
          </div>

          <button className="pnei-deactivate-btn" onClick={deactivatePneiBeton}>
            Deactivate (saves remaining window)
          </button>
        </>
      )}
    </div>
  );
}
