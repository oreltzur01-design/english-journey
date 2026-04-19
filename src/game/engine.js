import { GROWTH_RATE, UPGRADES, BASE_INCOME_PER_SUB, BASE_SUB_GROWTH, HYPE_DECAY, PRESTIGE_EXPONENT, TICK_MS } from './constants.js';

// Cost to buy the next unit of an upgrade
export function calcUpgradeCost(upgrade, currentCount) {
  return Math.ceil(upgrade.baseCost * Math.pow(GROWTH_RATE, currentCount));
}

// Total income & sub multipliers from all owned upgrades
export function calcMultipliers(upgradeCounts) {
  let income = 1;
  let subs = 1;
  for (const upg of UPGRADES) {
    const n = upgradeCounts[upg.id] || 0;
    if (n > 0) {
      income *= Math.pow(upg.incomeMult, n);
      subs *= Math.pow(upg.subsMult, n);
    }
  }
  return { income, subs };
}

// Passive income per second
export function calcIncomeRate(subscribers, incomeMult, traits) {
  let rate = subscribers * BASE_INCOME_PER_SUB * incomeMult;
  if (traits.pr_manager) rate *= 1.5;
  if (traits.billionaire_mode) rate *= 10;
  return rate;
}

// Subscriber growth per second
export function calcSubGrowth(hypeLevel, subsMult, traits) {
  const hypeBonus = Math.max(0, hypeLevel) / 100;
  let rate = BASE_SUB_GROWTH * subsMult * (1 + hypeBonus * 3);
  if (traits.nostalgia) rate *= 1.3;
  if (traits.viral_algo && Math.random() < 0.003) rate *= 8;
  return rate;
}

// Hype decay per second — returns 0 if Pnei Beton active
export function calcHypeDecay(pneiBeton) {
  if (pneiBeton.active && pneiBeton.windowRemaining > 0) return 0;
  return HYPE_DECAY;
}

// Influence Points gained from prestige
// P = (totalLifetimeEarnings ^ 0.5) * multiplier
export function calcPrestigePoints(totalLifetimeEarnings, prestigeCount) {
  return Math.floor(Math.pow(totalLifetimeEarnings, PRESTIGE_EXPONENT) * (1 + prestigeCount * 0.1));
}

// Which act the player is in
export function getAct(subscribers) {
  if (subscribers >= 1_000_000) return 3;
  if (subscribers >= 10_000) return 2;
  return 1;
}

// Format large numbers
export function fmt(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n).toLocaleString();
}

export function fmtMoney(n) {
  return '$' + fmt(n);
}

// Seconds elapsed since a timestamp (ms)
export function secondsSince(ms) {
  return (Date.now() - ms) / 1000;
}

// Tick delta in seconds
export const TICK_DELTA = TICK_MS / 1000;
