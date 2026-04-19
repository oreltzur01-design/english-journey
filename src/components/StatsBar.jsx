import { fmt, fmtMoney, calcMultipliers, calcIncomeRate, calcSubGrowth } from '../game/engine.js';

export default function StatsBar({ state }) {
  const mult = calcMultipliers(state.upgradeCounts);
  const incomePerSec = calcIncomeRate(state.subscribers, mult.income, state.traits);
  const subsPerSec = calcSubGrowth(state.hypeLevel, mult.subs, state.traits);

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-label">💰 Balance</span>
        <span className="stat-value money">{fmtMoney(state.money)}</span>
        <span className="stat-sub">+{fmtMoney(incomePerSec)}/sec</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">👥 Subscribers</span>
        <span className="stat-value subs">{fmt(state.subscribers)}</span>
        <span className="stat-sub">+{fmt(subsPerSec)}/sec</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">⚡ Hype Level</span>
        <span className="stat-value hype">{Math.floor(state.hypeLevel)}%</span>
        <span className="stat-sub">Lifetime: {fmtMoney(state.totalLifetimeEarnings)}</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">✨ Influence Pts</span>
        <span className="stat-value ip">{fmt(state.influencePoints)}</span>
        <span className="stat-sub">Prestiges: {state.prestigeCount}</span>
      </div>
    </div>
  );
}
