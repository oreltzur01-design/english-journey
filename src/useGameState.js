import { useState, useEffect, useRef, useCallback } from 'react';
import {
  GENERATORS,
  UPGRADES,
  MILESTONES,
  calcGeneratorCost,
  calcTotalVPS,
  calcClickValue,
  calcSubscribers,
  isPneiBetonActive,
  canActivatePneiBeton,
  generateHaterEvent,
  checkMilestones,
} from './gameLogic';

const TICK_MS = 100; // 10 ticks per second
const HATER_CHANCE_PER_TICK = 0.002; // ~1.2 events/minute
const HATER_CLEAR_CHANCE = 0.05;
const HYPE_REGEN_PER_TICK = 0.02; // +1 every 5 seconds
const SAVE_KEY = 'vlogger_empire_v1';

// ─── State Factory ────────────────────────────────────────────────────────────

function createInitialState() {
  return {
    views: 0,
    totalViews: 0,
    generators: GENERATORS.map(g => ({ ...g, owned: 0 })),
    upgrades: UPGRADES.map(u => ({ ...u, purchased: false })),
    milestones: Object.fromEntries(MILESTONES.map(m => [m.id, false])),
    hypeMeter: 100,
    pneiBeton: {
      unlocked: false,
      active: false,
      activatedAt: null,
      lastUsedDate: null,
    },
    activeHaterEvent: null,
    notification: null,
    prestigeMultiplier: 1,
    totalPrestigePoints: 0,
  };
}

// ─── Persistence ──────────────────────────────────────────────────────────────

function saveState(s) {
  try {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        views: s.views,
        totalViews: s.totalViews,
        generators: s.generators.map(g => ({ id: g.id, owned: g.owned })),
        upgrades: s.upgrades.map(u => ({ id: u.id, purchased: u.purchased })),
        milestones: s.milestones,
        hypeMeter: s.hypeMeter,
        pneiBeton: s.pneiBeton,
        prestigeMultiplier: s.prestigeMultiplier,
        totalPrestigePoints: s.totalPrestigePoints,
      }),
    );
  } catch {
    // localStorage unavailable — continue without saving
  }
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function hydrate(saved) {
  const fresh = createInitialState();
  if (!saved) return fresh;

  return {
    ...fresh,
    views: saved.views ?? 0,
    totalViews: saved.totalViews ?? 0,
    generators: fresh.generators.map(g => {
      const s = saved.generators?.find(sg => sg.id === g.id);
      return s ? { ...g, owned: s.owned ?? 0 } : g;
    }),
    upgrades: fresh.upgrades.map(u => {
      const s = saved.upgrades?.find(su => su.id === u.id);
      return s ? { ...u, purchased: s.purchased ?? false } : u;
    }),
    milestones: saved.milestones ?? fresh.milestones,
    hypeMeter: saved.hypeMeter ?? 100,
    pneiBeton: saved.pneiBeton ?? fresh.pneiBeton,
    prestigeMultiplier: saved.prestigeMultiplier ?? 1,
    totalPrestigePoints: saved.totalPrestigePoints ?? 0,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGameState() {
  const [state, setState] = useState(() => hydrate(loadSave()));
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // ── Game loop ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const vps = calcTotalVPS(prev.generators, prev.upgrades, prev.prestigeMultiplier);
        const earned = (vps * TICK_MS) / 1000;
        const newViews = prev.views + earned;
        const newTotalViews = prev.totalViews + earned;
        const subscribers = calcSubscribers(newTotalViews);

        // ── Milestones ─────────────────────────────────────────────────────────
        const { milestones, newUnlocks } = checkMilestones(subscribers, prev.milestones);

        // ── Pnei Beton state ──────────────────────────────────────────────────
        let pneiBeton = { ...prev.pneiBeton };

        // Unlock when Concrete Play Button is earned
        if (newUnlocks.find(m => m.id === 'concrete_play')) {
          pneiBeton = { ...pneiBeton, unlocked: true };
        }

        // Expire activation when duration runs out
        if (pneiBeton.active && !isPneiBetonActive(pneiBeton)) {
          pneiBeton = { ...pneiBeton, active: false };
        }

        const isImmune = isPneiBetonActive(pneiBeton);

        // ── Hype meter ────────────────────────────────────────────────────────
        let hypeMeter = Math.min(100, prev.hypeMeter + HYPE_REGEN_PER_TICK);
        let activeHaterEvent = prev.activeHaterEvent;

        if (!isImmune && Math.random() < HATER_CHANCE_PER_TICK) {
          const event = generateHaterEvent();
          hypeMeter = Math.max(0, hypeMeter - event.hypeDamage);
          activeHaterEvent = event;
        } else if (activeHaterEvent && Math.random() < HATER_CLEAR_CHANCE) {
          activeHaterEvent = null;
        }

        // Silver Button: PR Manager auto-suppresses hater events
        if (milestones['silver_button'] && activeHaterEvent && !isImmune) {
          activeHaterEvent = null;
        }

        // ── Notifications ─────────────────────────────────────────────────────
        let notification = prev.notification;

        if (newUnlocks.length > 0 && !notification) {
          notification = {
            milestone: newUnlocks[0],
            expiresAt: Date.now() + 6000,
          };
        }

        if (notification?.expiresAt && Date.now() > notification.expiresAt) {
          notification = null;
        }

        return {
          ...prev,
          views: newViews,
          totalViews: newTotalViews,
          milestones,
          pneiBeton,
          hypeMeter,
          activeHaterEvent,
          notification,
        };
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, []);

  // ── Auto-save every 30 s ──────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => saveState(stateRef.current), 30000);
    return () => clearInterval(interval);
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleClick = useCallback(() => {
    setState(prev => {
      const value = calcClickValue(prev.upgrades);
      return { ...prev, views: prev.views + value, totalViews: prev.totalViews + value };
    });
  }, []);

  const buyGenerator = useCallback(generatorId => {
    setState(prev => {
      const idx = prev.generators.findIndex(g => g.id === generatorId);
      if (idx === -1) return prev;

      const gen = prev.generators[idx];
      const cost = calcGeneratorCost(gen, gen.owned);
      if (prev.views < cost) return prev;

      const generators = [...prev.generators];
      generators[idx] = { ...gen, owned: gen.owned + 1 };
      return { ...prev, views: prev.views - cost, generators };
    });
  }, []);

  const buyUpgrade = useCallback(upgradeId => {
    setState(prev => {
      const idx = prev.upgrades.findIndex(u => u.id === upgradeId);
      if (idx === -1) return prev;

      const upgrade = prev.upgrades[idx];
      if (upgrade.purchased || prev.views < upgrade.cost) return prev;

      const upgrades = [...prev.upgrades];
      upgrades[idx] = { ...upgrade, purchased: true };
      return { ...prev, views: prev.views - upgrade.cost, upgrades };
    });
  }, []);

  const activatePneiBeton = useCallback(() => {
    setState(prev => {
      if (!canActivatePneiBeton(prev.pneiBeton)) return prev;
      return {
        ...prev,
        pneiBeton: {
          ...prev.pneiBeton,
          active: true,
          activatedAt: Date.now(),
          lastUsedDate: new Date().toDateString(),
        },
      };
    });
  }, []);

  const prestige = useCallback(() => {
    setState(prev => {
      if (!prev.milestones['diamond_button']) return prev;

      const earned = Math.floor(Math.sqrt(prev.totalViews));
      const totalPrestigePoints = prev.totalPrestigePoints + earned;
      // Each prestige point grants 1% production bonus
      const prestigeMultiplier = 1 + totalPrestigePoints * 0.01;

      const fresh = createInitialState();
      return {
        ...fresh,
        totalPrestigePoints,
        prestigeMultiplier,
        // Keep milestones and pnei beton unlock status across prestige
        milestones: prev.milestones,
        pneiBeton: { ...fresh.pneiBeton, unlocked: prev.milestones['concrete_play'] },
        notification: {
          milestone: {
            emoji: '♻️',
            name: 'Prestige Reset!',
            description: `Gained ${earned} Influence Points. Production bonus: +${((prestigeMultiplier - 1) * 100).toFixed(0)}%`,
          },
          expiresAt: Date.now() + 8000,
        },
      };
    });
  }, []);

  const dismissNotification = useCallback(() => {
    setState(prev => ({ ...prev, notification: null }));
  }, []);

  const resetSave = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setState(createInitialState());
  }, []);

  return {
    state,
    handleClick,
    buyGenerator,
    buyUpgrade,
    activatePneiBeton,
    prestige,
    dismissNotification,
    resetSave,
  };
}
