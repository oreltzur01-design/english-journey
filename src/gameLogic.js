// ─── Constants ───────────────────────────────────────────────────────────────

export const GROWTH_RATE = 1.15;
export const VIEWS_TO_SUBS_RATIO = 100; // 1 sub per 100 lifetime views
export const PNEI_BETON_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

// ─── Content Generators ──────────────────────────────────────────────────────

export const GENERATORS = [
  {
    id: 'post',
    name: 'Social Post',
    baseCost: 15,
    baseProduction: 0.1,
    emoji: '📱',
    description: 'Quick social media posts. Low reach, fast to make.',
  },
  {
    id: 'reel',
    name: 'Short Reel',
    baseCost: 100,
    baseProduction: 0.5,
    emoji: '🎬',
    description: '30-second clips that catch the algorithm.',
  },
  {
    id: 'vlog',
    name: 'Daily Vlog',
    baseCost: 1100,
    baseProduction: 4,
    emoji: '📹',
    description: 'A window into your life. Builds loyalty.',
  },
  {
    id: 'podcast',
    name: 'Podcast Episode',
    baseCost: 12000,
    baseProduction: 20,
    emoji: '🎙️',
    description: 'Deep dives that attract premium ad deals.',
  },
  {
    id: 'collab',
    name: 'Collab Video',
    baseCost: 130000,
    baseProduction: 100,
    emoji: '🤝',
    description: 'Team up with other creators for massive exposure.',
  },
  {
    id: 'viral',
    name: 'Viral Challenge',
    baseCost: 1400000,
    baseProduction: 400,
    emoji: '🔥',
    description: 'You started a global trend. The internet is yours.',
  },
  {
    id: 'docuseries',
    name: 'Docu-Series',
    baseCost: 20000000,
    baseProduction: 1600,
    emoji: '🎥',
    description: "A Netflix-style production. You're a media mogul now.",
  },
];

// ─── Upgrades ────────────────────────────────────────────────────────────────

export const UPGRADES = [
  {
    id: 'better_mic',
    name: 'Better Microphone',
    cost: 100,
    description: 'Social Posts produce 2× more views',
    type: 'generator_multiplier',
    target: 'post',
    multiplier: 2,
    requiresGenerator: { id: 'post', count: 1 },
  },
  {
    id: 'ring_light',
    name: 'Ring Light',
    cost: 500,
    description: 'Reels produce 2× more views',
    type: 'generator_multiplier',
    target: 'reel',
    multiplier: 2,
    requiresGenerator: { id: 'reel', count: 1 },
  },
  {
    id: 'auto_captions',
    name: 'Auto Captions',
    cost: 2000,
    description: 'Vlogs produce 2× more views',
    type: 'generator_multiplier',
    target: 'vlog',
    multiplier: 2,
    requiresGenerator: { id: 'vlog', count: 1 },
  },
  {
    id: 'thumbnail_ai',
    name: 'AI Thumbnail Generator',
    cost: 5000,
    description: 'All content produces 1.5× more views',
    type: 'global_multiplier',
    multiplier: 1.5,
    requiresGenerator: { id: 'vlog', count: 5 },
  },
  {
    id: 'nostalgia_kit',
    name: 'Vintage CRT Monitor',
    cost: 25000,
    description: 'Attracts older, wealthier audience. All content +1.25×',
    type: 'global_multiplier',
    multiplier: 1.25,
    requiresGenerator: { id: 'podcast', count: 1 },
  },
  {
    id: 'sponsorship_deal',
    name: 'Sponsorship Deal',
    cost: 50000,
    description: 'Podcasts produce 3× more views',
    type: 'generator_multiplier',
    target: 'podcast',
    multiplier: 3,
    requiresGenerator: { id: 'podcast', count: 5 },
  },
  {
    id: 'merch_store',
    name: 'Merch Store Launch',
    cost: 200000,
    description: 'Each click earns 5× more views',
    type: 'click_multiplier',
    multiplier: 5,
    requiresGenerator: { id: 'collab', count: 1 },
  },
  {
    id: 'dji_drone',
    name: 'DJI Neo Drone',
    cost: 750000,
    description: 'Collab Videos produce 3× more views',
    type: 'generator_multiplier',
    target: 'collab',
    multiplier: 3,
    requiresGenerator: { id: 'collab', count: 5 },
  },
  {
    id: 'ai_webcam',
    name: 'AI Smart Webcam (Insta360 Link 2 Pro)',
    cost: 2000000,
    description: 'Auto-framing tech. All content produces 2× more views',
    type: 'global_multiplier',
    multiplier: 2,
    requiresGenerator: { id: 'viral', count: 1 },
  },
  {
    id: 'bone_conduction',
    name: 'Halo Bone-Conduction Glasses',
    cost: 5000000,
    description: 'Hear chat prompts hands-free. Viral Challenges 3× production',
    type: 'generator_multiplier',
    target: 'viral',
    multiplier: 3,
    requiresGenerator: { id: 'viral', count: 10 },
  },
  {
    id: 'content_house',
    name: 'Content House',
    cost: 10000000,
    description: 'Mentor other creators. Docu-Series produce 4× more views',
    type: 'generator_multiplier',
    target: 'docuseries',
    multiplier: 4,
    requiresGenerator: { id: 'docuseries', count: 1 },
  },
];

// ─── Milestones ───────────────────────────────────────────────────────────────

export const MILESTONES = [
  {
    id: 'concrete_play',
    name: 'Concrete Play Button',
    subscriberThreshold: 10000,
    reward: 'pnei_beton',
    description: '"Pnei Beton" (Concrete Face) trait unlocked! 100% immunity to hater energy for 2 hours/day.',
    emoji: '🪨',
  },
  {
    id: 'silver_button',
    name: 'Silver Play Button',
    subscriberThreshold: 100000,
    reward: 'pr_manager',
    description: 'PR Manager hired! Auto-suppresses hater comments.',
    emoji: '🥈',
  },
  {
    id: 'gold_button',
    name: 'Gold Play Button',
    subscriberThreshold: 1000000,
    reward: 'global_viral',
    description: 'Global Viral Algorithm unlocked! +25% chance to hit Top Trending.',
    emoji: '🥇',
  },
  {
    id: 'diamond_button',
    name: 'Diamond & Ruby Play Button',
    subscriberThreshold: 10000000,
    reward: 'billionaire_mode',
    description: 'Billionaire Mode! Prestige reset now available.',
    emoji: '💎',
  },
];

// ─── Hater Events ─────────────────────────────────────────────────────────────

const HATER_EVENTS = [
  { message: '"Your content is cringe!" 😤', hypeDamage: 15 },
  { message: '"Bought subs detected! 🚨"', hypeDamage: 20 },
  { message: '"This vid is BORING 💤"', hypeDamage: 10 },
  { message: '"AI-generated content! 🤖"', hypeDamage: 12 },
  { message: '"Cancel this creator! ❌"', hypeDamage: 25 },
  { message: '"Total sell-out! 💸"', hypeDamage: 8 },
  { message: '"Diss track incoming! 🎤"', hypeDamage: 18 },
];

export function generateHaterEvent() {
  return HATER_EVENTS[Math.floor(Math.random() * HATER_EVENTS.length)];
}

// ─── Cost & Production Calculations ──────────────────────────────────────────

/**
 * Cost of the next unit of a generator.
 * Formula: Cn = baseCost × growthRate^owned
 */
export function calcGeneratorCost(generator, owned) {
  return Math.ceil(generator.baseCost * Math.pow(GROWTH_RATE, owned));
}

/**
 * Views-per-second for one generator type, with all modifiers applied.
 */
export function calcGeneratorProduction(generator, owned, upgrades, prestigeMultiplier) {
  if (owned === 0) return 0;

  let production = generator.baseProduction * owned;

  for (const upgrade of upgrades) {
    if (!upgrade.purchased) continue;
    if (upgrade.type === 'generator_multiplier' && upgrade.target === generator.id) {
      production *= upgrade.multiplier;
    } else if (upgrade.type === 'global_multiplier') {
      production *= upgrade.multiplier;
    }
  }

  return production * prestigeMultiplier;
}

/**
 * Total views-per-second across all generators.
 */
export function calcTotalVPS(generators, upgrades, prestigeMultiplier = 1) {
  return generators.reduce(
    (total, gen) => total + calcGeneratorProduction(gen, gen.owned, upgrades, prestigeMultiplier),
    0,
  );
}

/**
 * Views earned per manual click.
 */
export function calcClickValue(upgrades, baseClick = 1) {
  let value = baseClick;
  for (const upgrade of upgrades) {
    if (upgrade.purchased && upgrade.type === 'click_multiplier') {
      value *= upgrade.multiplier;
    }
  }
  return value;
}

export function calcSubscribers(totalViews) {
  return Math.floor(totalViews / VIEWS_TO_SUBS_RATIO);
}

/**
 * Influence Points earned on prestige.
 * Formula: P = sqrt(totalLifetimeViews) × multiplier
 */
export function calcPrestigePoints(totalLifetimeViews, multiplier = 1) {
  return Math.floor(Math.sqrt(totalLifetimeViews) * multiplier);
}

// ─── Pnei Beton (Concrete Face) Logic ────────────────────────────────────────

export function isPneiBetonActive(pneiBeton) {
  if (!pneiBeton.unlocked || !pneiBeton.active || !pneiBeton.activatedAt) return false;
  return Date.now() - pneiBeton.activatedAt < PNEI_BETON_DURATION_MS;
}

export function getPneiBetonRemainingMs(pneiBeton) {
  if (!isPneiBetonActive(pneiBeton)) return 0;
  return Math.max(0, PNEI_BETON_DURATION_MS - (Date.now() - pneiBeton.activatedAt));
}

export function canActivatePneiBeton(pneiBeton) {
  if (!pneiBeton.unlocked) return false;
  if (isPneiBetonActive(pneiBeton)) return false;
  if (pneiBeton.lastUsedDate === new Date().toDateString()) return false;
  return true;
}

// ─── Upgrade Availability ─────────────────────────────────────────────────────

export function isUpgradeAvailable(upgrade, generators) {
  if (upgrade.purchased) return false;
  if (!upgrade.requiresGenerator) return true;
  const gen = generators.find(g => g.id === upgrade.requiresGenerator.id);
  return gen && gen.owned >= upgrade.requiresGenerator.count;
}

// ─── Milestone Checking ───────────────────────────────────────────────────────

export function checkMilestones(subscribers, currentMilestones) {
  const updated = { ...currentMilestones };
  const newUnlocks = [];

  for (const milestone of MILESTONES) {
    if (!updated[milestone.id] && subscribers >= milestone.subscriberThreshold) {
      updated[milestone.id] = true;
      newUnlocks.push(milestone);
    }
  }

  return { milestones: updated, newUnlocks };
}

// ─── Formatting Helpers ───────────────────────────────────────────────────────

export function formatNumber(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n).toString();
}

export function formatTime(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
