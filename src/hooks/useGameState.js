import { useReducer, useEffect, useCallback } from 'react';
import {
  UPGRADES,
  MILESTONES,
  EVENTS,
  PNEI_BETON_MAX_SECONDS,
  VIDEO_HYPE_BOOST,
  VIDEO_SUB_BOOST,
  VIDEO_COOLDOWN_MS,
  EVENT_CHANCE_PER_TICK,
  EVENT_DURATION_MS,
  TICK_MS,
} from '../game/constants.js';
import {
  calcMultipliers,
  calcIncomeRate,
  calcSubGrowth,
  calcHypeDecay,
  calcPrestigePoints,
  TICK_DELTA,
} from '../game/engine.js';

const STORAGE_KEY = 'vlogger_empire_2026_state';

const DEFAULT_STATE = {
  money: 0,
  subscribers: 1,
  totalLifetimeEarnings: 0,
  influencePoints: 0,
  hypeLevel: 50,
  upgradeCounts: {},
  milestones: [],
  traits: {
    nostalgia: false,
    pr_manager: false,
    viral_algo: false,
    billionaire_mode: false,
    pnei_beton_unlocked: false,
  },
  pneiBeton: {
    active: false,
    windowRemaining: PNEI_BETON_MAX_SECONDS,
    lastReset: 0,
  },
  currentEvent: null,
  eventExpiry: 0,
  lastVideoTime: 0,
  videosCreated: 0,
  prestigeCount: 0,
  notification: null,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    // Deep merge with defaults to handle missing fields from older saves
    return {
      ...DEFAULT_STATE,
      ...parsed,
      traits: { ...DEFAULT_STATE.traits, ...(parsed.traits || {}) },
      pneiBeton: { ...DEFAULT_STATE.pneiBeton, ...(parsed.pneiBeton || {}) },
      upgradeCounts: parsed.upgradeCounts || {},
      milestones: Array.isArray(parsed.milestones) ? parsed.milestones : [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function applyMilestone(state, milestone) {
  const newTraits = { ...state.traits };
  if (milestone.unlocks === 'pnei_beton') {
    newTraits.pnei_beton_unlocked = true;
  } else if (milestone.unlocks === 'pr_manager') {
    newTraits.pr_manager = true;
  } else if (milestone.unlocks === 'viral_algo') {
    newTraits.viral_algo = true;
  } else if (milestone.unlocks === 'billionaire_mode') {
    newTraits.billionaire_mode = true;
  }
  return newTraits;
}

function reducer(state, action) {
  switch (action.type) {
    case 'TICK': {
      const now = Date.now();
      const mult = calcMultipliers(state.upgradeCounts);

      // Pnei Beton daily reset check
      let pneiBeton = { ...state.pneiBeton };
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
      if (pneiBeton.lastReset > 0 && now - pneiBeton.lastReset >= TWENTY_FOUR_HOURS) {
        pneiBeton = {
          ...pneiBeton,
          windowRemaining: PNEI_BETON_MAX_SECONDS,
          lastReset: now,
          active: false,
        };
      } else if (pneiBeton.lastReset === 0) {
        // Initialize lastReset on first tick
        pneiBeton = { ...pneiBeton, lastReset: now };
      }

      // Income
      const incomeRate = calcIncomeRate(state.subscribers, mult.income, state.traits);
      const earned = incomeRate * TICK_DELTA;
      const newMoney = state.money + earned;
      const newLifetime = state.totalLifetimeEarnings + earned;

      // Sub growth
      const subRate = calcSubGrowth(state.hypeLevel, mult.subs, state.traits);
      const newSubs = Math.max(0, state.subscribers + subRate * TICK_DELTA);

      // Hype decay
      const hypeDecay = calcHypeDecay(pneiBeton);
      const newHype = Math.min(100, Math.max(0, state.hypeLevel - hypeDecay * TICK_DELTA));

      // Pnei Beton window countdown
      if (pneiBeton.active) {
        pneiBeton = {
          ...pneiBeton,
          windowRemaining: Math.max(0, pneiBeton.windowRemaining - TICK_DELTA),
        };
        if (pneiBeton.windowRemaining <= 0) {
          pneiBeton = { ...pneiBeton, active: false };
        }
      }

      // Event expiry
      let currentEvent = state.currentEvent;
      let eventExpiry = state.eventExpiry;
      if (currentEvent && now >= eventExpiry) {
        currentEvent = null;
        eventExpiry = 0;
      }

      // Milestone check
      let milestones = [...state.milestones];
      let traits = { ...state.traits };
      let notification = state.notification;

      for (const ms of MILESTONES) {
        if (!milestones.includes(ms.id) && newSubs >= ms.reqSubs) {
          milestones.push(ms.id);
          traits = applyMilestone({ ...state, traits }, ms);
          notification = {
            text: `🏆 ${ms.name} unlocked! ${ms.unlockDesc}`,
            type: 'milestone',
          };
        }
      }

      return {
        ...state,
        money: newMoney,
        subscribers: newSubs,
        totalLifetimeEarnings: newLifetime,
        hypeLevel: newHype,
        pneiBeton,
        currentEvent,
        eventExpiry,
        milestones,
        traits,
        notification,
      };
    }

    case 'BUY_UPGRADE': {
      const { upgradeId } = action;
      const upgrade = UPGRADES.find(u => u.id === upgradeId);
      if (!upgrade) return state;

      const currentCount = state.upgradeCounts[upgradeId] || 0;
      if (currentCount >= upgrade.max) return state;

      const cost = Math.ceil(upgrade.baseCost * Math.pow(1.15, currentCount));
      if (state.money < cost) return state;

      // reqSubs check
      if (upgrade.reqSubs && state.subscribers < upgrade.reqSubs) return state;

      const newCounts = { ...state.upgradeCounts, [upgradeId]: currentCount + 1 };

      // Apply trait if upgrade has one and it's the first purchase
      let traits = { ...state.traits };
      if (upgrade.trait && currentCount === 0) {
        traits[upgrade.trait] = true;
      }

      return {
        ...state,
        money: state.money - cost,
        upgradeCounts: newCounts,
        traits,
      };
    }

    case 'MAKE_VIDEO': {
      const now = Date.now();
      if (now - state.lastVideoTime < VIDEO_COOLDOWN_MS) return state;
      const newHype = Math.min(100, state.hypeLevel + VIDEO_HYPE_BOOST);
      const newSubs = state.subscribers + VIDEO_SUB_BOOST;
      return {
        ...state,
        hypeLevel: newHype,
        subscribers: newSubs,
        lastVideoTime: now,
        videosCreated: state.videosCreated + 1,
      };
    }

    case 'ACTIVATE_PNEI_BETON': {
      if (!state.traits.pnei_beton_unlocked) return state;
      if (state.pneiBeton.windowRemaining <= 0) return state;
      return {
        ...state,
        pneiBeton: { ...state.pneiBeton, active: true },
      };
    }

    case 'DEACTIVATE_PNEI_BETON': {
      return {
        ...state,
        pneiBeton: { ...state.pneiBeton, active: false },
      };
    }

    case 'TRIGGER_EVENT': {
      const { event } = action;
      const now = Date.now();

      // Block negative events if Pnei Beton is active
      if (event.type === 'bad' && state.pneiBeton.active && state.pneiBeton.windowRemaining > 0) {
        return {
          ...state,
          currentEvent: { ...event, blocked: true, name: '🛡️ Blocked!', desc: 'Pnei Beton absorbed the negative energy!' },
          eventExpiry: now + EVENT_DURATION_MS,
        };
      }

      let newMoney = state.money;
      let newSubs = state.subscribers;
      let newHype = state.hypeLevel;

      if (event.hypeDelta) {
        newHype = Math.min(100, Math.max(0, state.hypeLevel + event.hypeDelta));
      }
      if (event.moneyBonus) {
        newMoney = state.money + event.moneyBonus;
      }
      if (event.subBonus) {
        newSubs = state.subscribers + event.subBonus;
      }

      return {
        ...state,
        money: newMoney,
        subscribers: Math.max(0, newSubs),
        hypeLevel: newHype,
        currentEvent: event,
        eventExpiry: now + EVENT_DURATION_MS,
      };
    }

    case 'CLEAR_NOTIFICATION': {
      return { ...state, notification: null };
    }

    case 'PRESTIGE': {
      if (!state.milestones.includes('ruby_button')) return state;
      const ip = calcPrestigePoints(state.totalLifetimeEarnings, state.prestigeCount);
      return {
        ...DEFAULT_STATE,
        influencePoints: state.influencePoints + ip,
        prestigeCount: state.prestigeCount + 1,
        notification: {
          text: `✨ Prestige! Earned ${ip} Influence Points. Starting fresh...`,
          type: 'prestige',
        },
      };
    }

    case 'RESET_PNEI_BETON_WINDOW': {
      return {
        ...state,
        pneiBeton: {
          ...state.pneiBeton,
          windowRemaining: PNEI_BETON_MAX_SECONDS,
          lastReset: Date.now(),
          active: false,
        },
      };
    }

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  // Game loop
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, []);

  // Random event scheduler
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < EVENT_CHANCE_PER_TICK) {
        const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        dispatch({ type: 'TRIGGER_EVENT', event });
      }
    }, TICK_MS);
    return () => clearInterval(interval);
  }, []);

  // Persist to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }, [state]);

  const buyUpgrade = useCallback((upgradeId) => {
    dispatch({ type: 'BUY_UPGRADE', upgradeId });
  }, []);

  const makeVideo = useCallback(() => {
    dispatch({ type: 'MAKE_VIDEO' });
  }, []);

  const activatePneiBeton = useCallback(() => {
    dispatch({ type: 'ACTIVATE_PNEI_BETON' });
  }, []);

  const deactivatePneiBeton = useCallback(() => {
    dispatch({ type: 'DEACTIVATE_PNEI_BETON' });
  }, []);

  const prestige = useCallback(() => {
    dispatch({ type: 'PRESTIGE' });
  }, []);

  const clearNotification = useCallback(() => {
    dispatch({ type: 'CLEAR_NOTIFICATION' });
  }, []);

  return {
    state,
    buyUpgrade,
    makeVideo,
    activatePneiBeton,
    deactivatePneiBeton,
    prestige,
    clearNotification,
  };
}
