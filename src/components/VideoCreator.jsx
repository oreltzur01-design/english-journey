import { useState, useEffect } from 'react';
import { VIDEO_COOLDOWN_MS } from '../game/constants.js';
import { calcMultipliers, calcIncomeRate, calcSubGrowth, fmt, fmtMoney } from '../game/engine.js';

export default function VideoCreator({ state, makeVideo }) {
  const [cooldownLeft, setCooldownLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - state.lastVideoTime;
      const remaining = Math.max(0, VIDEO_COOLDOWN_MS - elapsed);
      setCooldownLeft(remaining);
    }, 100);
    return () => clearInterval(interval);
  }, [state.lastVideoTime]);

  const onCooldown = cooldownLeft > 0;
  const cooldownSec = (cooldownLeft / 1000).toFixed(1);

  const mult = calcMultipliers(state.upgradeCounts);
  const incomePerSec = calcIncomeRate(state.subscribers, mult.income, state.traits);
  const subsPerSec = calcSubGrowth(state.hypeLevel, mult.subs, state.traits);

  return (
    <div className="panel video-creator">
      <div className="panel-title">Create Content</div>

      <button
        className="video-btn"
        onClick={makeVideo}
        disabled={onCooldown}
      >
        {onCooldown ? `⏳ Uploading… (${cooldownSec}s)` : '🎬 Create Video'}
      </button>

      {onCooldown && (
        <div className="video-cooldown">
          Cooldown: {cooldownSec}s remaining
        </div>
      )}

      <div className="video-stats">
        <div className="video-stat">
          <div className="video-stat-label">Income/sec</div>
          <div className="video-stat-value">{fmtMoney(incomePerSec)}</div>
        </div>
        <div className="video-stat">
          <div className="video-stat-label">Subs/sec</div>
          <div className="video-stat-value">+{fmt(subsPerSec)}</div>
        </div>
      </div>

      <div className="videos-created-badge">
        🎬 Videos created: {state.videosCreated}
      </div>
    </div>
  );
}
