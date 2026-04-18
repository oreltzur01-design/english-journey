import { MILESTONES, formatNumber } from '../gameLogic';

export default function Milestones({ milestones, subscribers }) {
  return (
    <div className="milestones-panel">
      <div className="milestones-title">Play Buttons</div>
      {MILESTONES.map(milestone => {
        const unlocked = milestones[milestone.id];
        const progress = Math.min(1, subscribers / milestone.subscriberThreshold);

        return (
          <div
            key={milestone.id}
            className={`milestone-item ${unlocked ? 'unlocked' : 'locked'}`}
          >
            <span className="milestone-emoji">{milestone.emoji}</span>
            <div className="milestone-body">
              <div className="milestone-name">{milestone.name}</div>
              {unlocked ? (
                <div className="milestone-desc">{milestone.description}</div>
              ) : (
                <>
                  <div className="milestone-threshold">
                    {formatNumber(subscribers)} / {formatNumber(milestone.subscriberThreshold)} subs
                  </div>
                  <div className="milestone-track">
                    <div
                      className="milestone-fill"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
