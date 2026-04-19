import { MILESTONES } from '../game/constants.js';
import { fmt } from '../game/engine.js';

export default function MilestonePanel({ subscribers, milestones }) {
  return (
    <div className="panel">
      <div className="panel-title">Play Buttons</div>
      <div className="milestone-panel">
        {MILESTONES.map((ms) => {
          const achieved = milestones.includes(ms.id);
          const progress = Math.min(1, subscribers / ms.reqSubs);
          const progressPct = (progress * 100).toFixed(1);

          return (
            <div
              key={ms.id}
              className={`milestone-item ${achieved ? 'achieved' : ''}`}
              style={achieved ? { borderColor: ms.color + '55' } : {}}
            >
              <div className="milestone-header">
                <span className="milestone-icon">{ms.icon}</span>
                <div>
                  <div
                    className="milestone-name"
                    style={achieved ? { color: ms.color } : {}}
                  >
                    {ms.name}
                  </div>
                  {achieved && (
                    <div style={{ fontSize: '0.65rem', color: ms.color + 'aa', fontWeight: 600 }}>
                      ✅ Unlocked!
                    </div>
                  )}
                </div>
              </div>

              <div className="milestone-unlock-desc">
                {ms.unlockDesc}
              </div>

              {!achieved ? (
                <>
                  <div className="milestone-progress-track">
                    <div
                      className="milestone-progress-fill"
                      style={{
                        width: `${progressPct}%`,
                        background: `linear-gradient(90deg, ${ms.color}88, ${ms.color})`,
                      }}
                    />
                  </div>
                  <div className="milestone-progress-text">
                    {fmt(subscribers)} / {fmt(ms.reqSubs)} ({progressPct}%)
                  </div>
                </>
              ) : (
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: ms.color + 'aa',
                    textAlign: 'right',
                  }}
                >
                  Required: {fmt(ms.reqSubs)} subs
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
