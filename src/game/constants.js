export const GROWTH_RATE = 1.15;
export const TICK_MS = 200; // game loop interval
export const TICKS_PER_SEC = 1000 / TICK_MS;

export const ACTS = {
  1: { name: 'The Basement Hustle', location: 'Trash City', maxSubs: 9999 },
  2: { name: 'The Viral Breakthrough', location: 'City Apartment', maxSubs: 999999 },
  3: { name: 'The Global Icon', location: 'Luxury Villa', maxSubs: Infinity },
};

export const UPGRADES = [
  { id: 'cracked_phone', name: 'Cracked Smartphone', desc: 'Borrowed from a friend. Raw and shaky.', baseCost: 15, incomeMult: 1.3, subsMult: 1.2, icon: '📱', max: 10 },
  { id: 'ring_light', name: 'Ring Light', desc: 'Basic lighting for better video quality.', baseCost: 80, incomeMult: 1.5, subsMult: 1.4, icon: '💡', max: 5, reqSubs: 500 },
  { id: 'ai_webcam', name: 'AI Smart Webcam (Insta360)', desc: 'Auto-framing & gesture control.', baseCost: 500, incomeMult: 2.0, subsMult: 1.8, icon: '📸', max: 3, reqSubs: 1000 },
  { id: 'dji_drone', name: 'DJI Neo Drone', desc: '4K aerial shots for Day in the Life vlogs.', baseCost: 2000, incomeMult: 3.5, subsMult: 3.0, icon: '🚁', max: 2, reqSubs: 10000 },
  { id: 'halo_glasses', name: 'Halo Bone-Conduction Glasses', desc: 'Hear chat without headphones.', baseCost: 1000, incomeMult: 2.5, subsMult: 2.2, icon: '🕶️', max: 1, reqSubs: 5000 },
  { id: 'crt_monitor', name: 'Vintage CRT Monitor', desc: 'Nostalgia Buff — attracts older, wealthier subs.', baseCost: 800, incomeMult: 2.8, subsMult: 2.5, icon: '📺', max: 2, reqSubs: 2000, trait: 'nostalgia' },
  { id: 'rotary_dial', name: 'Rotary Dial Stream Deck', desc: 'Old-school phone dial that triggers memes.', baseCost: 400, incomeMult: 1.8, subsMult: 1.6, icon: '☎️', max: 3, reqSubs: 1500 },
  { id: 'content_house', name: 'Content House', desc: 'Mentor other creators. Passive subscriber flow.', baseCost: 50000, incomeMult: 10.0, subsMult: 8.0, icon: '🏠', max: 1, reqSubs: 100000 },
];

export const MILESTONES = [
  { id: 'concrete_button', name: 'Concrete Play Button', reqSubs: 10000, icon: '🏆', color: '#8B7355', unlocks: 'pnei_beton', unlockDesc: 'Pnei Beton (Concrete Face): 100% immunity to Negative Energy for 2h daily.' },
  { id: 'silver_button', name: 'Silver Play Button', reqSubs: 100000, icon: '🥈', color: '#C0C0C0', unlocks: 'pr_manager', unlockDesc: 'PR Manager: auto-deletes bad comments, +50% ad revenue.' },
  { id: 'gold_button', name: 'Gold Play Button', reqSubs: 1000000, icon: '🥇', color: '#FFD700', unlocks: 'viral_algo', unlockDesc: 'Global Viral Algorithm: +25% chance of hitting Top Trending.' },
  { id: 'diamond_button', name: 'Diamond Play Button', reqSubs: 10000000, icon: '💎', color: '#B9F2FF', unlocks: 'billionaire_mode', unlockDesc: 'Billionaire Mode: 10x passive income.' },
  { id: 'ruby_button', name: 'Ruby Play Button', reqSubs: 100000000, icon: '💍', color: '#FF0044', unlocks: 'prestige', unlockDesc: 'Prestige Reset: convert earnings to Influence Points.' },
];

export const EVENTS = [
  { id: 'hater_attack', name: '😡 Hater Attack!', desc: 'Trolls are spamming your comments!', hypeDelta: -20, type: 'bad' },
  { id: 'viral_moment', name: '🔥 Viral Moment!', desc: 'Your clip is blowing up online!', hypeDelta: 30, subBonus: 200, type: 'good' },
  { id: 'scandal', name: '💀 Scandal Alert!', desc: 'A rival is spreading rumors!', hypeDelta: -35, type: 'bad' },
  { id: 'brand_deal', name: '💰 Brand Deal!', desc: 'A company wants to sponsor you!', moneyBonus: 2000, type: 'good' },
  { id: 'diss_track', name: '🎤 AI Rival Diss Track!', desc: 'The corporate vlogger went off!', hypeDelta: -25, type: 'bad' },
  { id: 'trending', name: '📈 Trending Now!', desc: 'You hit the trending page!', hypeDelta: 20, subBonus: 500, type: 'good' },
];

export const PNEI_BETON_MAX_SECONDS = 7200; // 2 hours
export const BASE_INCOME_PER_SUB = 0.0005; // per second
export const BASE_SUB_GROWTH = 0.05; // per second
export const HYPE_DECAY = 0.3; // per second
export const VIDEO_HYPE_BOOST = 25;
export const VIDEO_SUB_BOOST = 50;
export const VIDEO_COOLDOWN_MS = 8000;
export const PRESTIGE_EXPONENT = 0.5;
export const EVENT_CHANCE_PER_TICK = 0.003;
export const EVENT_DURATION_MS = 5000;
