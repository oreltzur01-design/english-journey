import { ACTS, MILESTONES } from '../game/constants.js';
import { fmt, fmtMoney, calcPrestigePoints } from '../game/engine.js';

const ACT_STORIES = {
  1: 'Start in Trash City — survive the streets with a cracked phone. Every subscriber counts. Post every day or die trying.',
  2: 'City Apartment — you went viral and the world noticed. Fight AI rivals, dodge scandals, and grind to a million.',
  3: 'Luxury Villa — global icon status. Mentor other creators, activate Billionaire Mode, and build your empire.',
};

const ACT_NEXT_THRESHOLDS = {
  1: 10000,
  2: 1000000,
  3: Infinity,
};

export default function ActProgress({ state, actNum, prestige }) {
  const { subscribers, milestones, totalLifetimeEarnings, prestigeCount } = state;
  const act = ACTS[actNum];
  const story = ACT_STORIES[actNum];
  const nextThreshold = ACT_NEXT_THRESHOLDS[actNum];
  const prevThreshold = actNum === 1 ? 0 : actNum === 2 ? 10000 : 1000000;

  const hasRubyButton = milestones.includes('ruby_button');
  const estimatedIP = calcPrestigePoints(totalLifetimeEarnings, prestigeCount);

  let progress;
  let progressLabel;
  let isMaxAct = actNum === 3;

  if (isMaxAct) {
    progress = 1;
    progressLabel = 'Global Icon — Maximum Act';
  } else {
    const range = nextThreshold - prevThreshold;
    const current = Math.max(0, subscribers - prevThreshold);
    progress = Math.min(1, current / range);
    progressLabel = `${fmt(subscribers)} / ${fmt(nextThreshold)} subs to Act ${actNum + 1}`;
  }

  const actClass = `act-badge act-${actNum}`;
  const fillClass = `act-progress-fill act-${actNum}`;

  return (
    <div className="panel act-progress">
      <div className="panel-title">Act Progress</div>

      <div className={actClass}>
        Act {actNum}: {act.name}
      </div>

      <div className="act-story">{story}</div>

      <div className="act-progress-section">
        {isMaxAct ? (
          <div className="act-max-label">🌟 Maximum Act Reached!</div>
        ) : (
          <>
            <div className="act-progress-label">
              <span>Progress to Act {actNum + 1}</span>
              <span>{(progress * 100).toFixed(1)}%</span>
            </div>
            <div className="act-progress-track">
              <div
                className={fillClass}
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              {progressLabel}
            </div>
          </>
        )}
      </div>

      {actNum === 3 && (
        <div className="prestige-section">
          <div className="prestige-info">
            {hasRubyButton ? (
              <>
                <strong style={{ color: '#ff0044' }}>💍 Ruby Play Button Unlocked!</strong>
                <br />
                Prestige to earn <strong style={{ color: '#bb86fc' }}>~{fmt(estimatedIP)} Influence Points</strong>.
                <br />
                Your progress resets but you grow stronger each time.
              </>
            ) : (
              <>
                Reach <strong>100,000,000 subscribers</strong> to unlock Prestige mode.
                <br />
                Convert lifetime earnings into Influence Points.
              </>
            )}
          </div>
          {hasRubyButton && (
            <button className="prestige-btn" onClick={prestige}>
              💫 Prestige — Earn {fmt(estimatedIP)} IP
            </button>
          )}
        </div>
      )}
    </div>
  );
}
