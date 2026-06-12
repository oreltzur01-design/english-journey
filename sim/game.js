#!/usr/bin/env node
'use strict';

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// ── Save file ─────────────────────────────────────────────────────────────────
const SAVE_PATH = path.join(__dirname, 'save.json');

// ── Game Data Config ──────────────────────────────────────────────────────────
const STAGES = [
  { name: 'Lod Apartment',                 reqFollowers: 0,         transitionCost: 2_500 },
  { name: 'Rishon LeZion',                 reqFollowers: 1_000,     transitionCost: 35_000 },
  { name: 'Gag Apartment & Shopify Store', reqFollowers: 30_000,    transitionCost: 400_000 },
  { name: 'Tel Aviv Penthouse',            reqFollowers: 250_000,   transitionCost: 3_000_000 },
  { name: 'Herzliya Villa & Porsche',      reqFollowers: 1_500_000, transitionCost: 0 },
];

function getCurrentStage(followers) {
  let current = STAGES[0];
  for (const s of STAGES) {
    if (followers >= s.reqFollowers) current = s;
    else break;
  }
  return current;
}

// ── Upgrades ──────────────────────────────────────────────────────────────────
const UPGRADES = [
  { name: 'Smartphone',       baseCost: 50,        costMult: 1.15, incomeBoost: 0.5 },
  { name: 'Ring Light',       baseCost: 200,        costMult: 1.15, incomeBoost: 2 },
  { name: 'Camera',           baseCost: 1_000,      costMult: 1.15, incomeBoost: 8 },
  { name: 'Editing PC',       baseCost: 5_000,      costMult: 1.15, incomeBoost: 30 },
  { name: 'Sponsorship Deal', baseCost: 25_000,     costMult: 1.18, incomeBoost: 120 },
  { name: 'Merch Store',      baseCost: 100_000,    costMult: 1.20, incomeBoost: 500 },
  { name: 'YouTube Manager',  baseCost: 500_000,    costMult: 1.20, incomeBoost: 2_000 },
];

function calcCost(upgrade, level) {
  return upgrade.baseCost * Math.pow(upgrade.costMult, level);
}

// ── Game State ────────────────────────────────────────────────────────────────
let state = {
  money: 0,
  mps: 0,
  followers: 0,
  upgradeLevels: {},   // name -> level
};

const BASE_CLICK = 1;

function addMoney(amount) { state.money += amount; }
function spendMoney(amount) {
  if (state.money < amount) return false;
  state.money -= amount;
  return true;
}

function clickAction() {
  addMoney(BASE_CLICK);
  state.followers += 0.01; // small follower gain per click
}

function buyUpgrade(idx) {
  const upg = UPGRADES[idx];
  if (!upg) return false;
  const level = state.upgradeLevels[upg.name] || 0;
  const cost = calcCost(upg, level);
  if (!spendMoney(cost)) return false;
  state.upgradeLevels[upg.name] = level + 1;
  state.mps += upg.incomeBoost;
  state.followers += upg.incomeBoost * 0.1; // each purchase gains followers
  return true;
}

// ── Save / Load ───────────────────────────────────────────────────────────────
function saveGame() {
  const data = { ...state, quitTime: new Date().toISOString() };
  fs.writeFileSync(SAVE_PATH, JSON.stringify(data, null, 2));
}

function loadGame() {
  if (!fs.existsSync(SAVE_PATH)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(SAVE_PATH, 'utf8'));
    state.money = data.money || 0;
    state.mps = data.mps || 0;
    state.followers = data.followers || 0;
    state.upgradeLevels = data.upgradeLevels || {};
    const offlineSeconds = data.quitTime
      ? Math.max(0, (Date.now() - new Date(data.quitTime).getTime()) / 1000)
      : 0;
    const offlineEarnings = offlineSeconds * state.mps;
    if (offlineEarnings > 0) addMoney(offlineEarnings);
    return offlineEarnings;
  } catch { return null; }
}

// ── Number Formatting ─────────────────────────────────────────────────────────
function fmt(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9)  return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6)  return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3)  return (n / 1e3).toFixed(2) + 'K';
  return n.toFixed(2);
}

// ── Terminal UI ───────────────────────────────────────────────────────────────
const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';
const YELLOW = '\x1b[33m';
const GREEN  = '\x1b[32m';
const CYAN   = '\x1b[36m';
const RED    = '\x1b[31m';
const DIM    = '\x1b[2m';
const CLEAR  = '\x1b[2J\x1b[H';

function renderUI(lastMsg) {
  const stage = getCurrentStage(state.followers);
  const nextStage = STAGES.find(s => s.reqFollowers > state.followers);

  process.stdout.write(CLEAR);
  console.log(`${BOLD}${CYAN}╔══════════════════════════════════════════════════════╗`);
  console.log(`║          LAMAR - IDLE VLOGGER  (Terminal Sim)        ║`);
  console.log(`╚══════════════════════════════════════════════════════╝${RESET}`);
  console.log();
  console.log(`${BOLD}${YELLOW}  💰 Money   :${RESET}  $${fmt(state.money)}`);
  console.log(`${BOLD}${GREEN}  📈 Income  :${RESET}  $${fmt(state.mps)}/s`);
  console.log(`${BOLD}${CYAN}  👥 Followers:${RESET} ${fmt(state.followers)}`);
  console.log();
  console.log(`${BOLD}  📍 Stage   :${RESET}  ${stage.name}`);
  if (nextStage) {
    const pct = Math.min(100, (state.followers / nextStage.reqFollowers * 100)).toFixed(1);
    const bar = buildBar(parseFloat(pct), 30);
    console.log(`  ${DIM}Next: ${nextStage.name} (${fmt(nextStage.reqFollowers)} followers)${RESET}`);
    console.log(`  [${GREEN}${bar}${RESET}] ${pct}%`);
  } else {
    console.log(`  ${BOLD}${YELLOW}★ MAX STAGE REACHED ★${RESET}`);
  }

  console.log();
  console.log(`${BOLD}${CYAN}─── UPGRADES ─────────────────────────────────────────${RESET}`);
  UPGRADES.forEach((upg, i) => {
    const level = state.upgradeLevels[upg.name] || 0;
    const cost  = calcCost(upg, level);
    const canAfford = state.money >= cost;
    const color = canAfford ? GREEN : RED;
    console.log(
      `  ${BOLD}[${i + 1}]${RESET} ${upg.name.padEnd(18)}` +
      ` Lv${String(level).padStart(3)}` +
      `  Cost: ${color}$${fmt(cost)}${RESET}` +
      `  +$${fmt(upg.incomeBoost)}/s`
    );
  });

  console.log();
  console.log(`${BOLD}${CYAN}─── CONTROLS ─────────────────────────────────────────${RESET}`);
  console.log(`  ${BOLD}[SPACE]${RESET}  Click (earn $${BASE_CLICK})`);
  console.log(`  ${BOLD}[1-${UPGRADES.length}]${RESET}    Buy upgrade`);
  console.log(`  ${BOLD}[s]${RESET}     Save & quit`);
  console.log(`  ${BOLD}[q]${RESET}     Quit without saving`);

  if (lastMsg) {
    console.log();
    console.log(`  ${BOLD}${YELLOW}» ${lastMsg}${RESET}`);
  }
}

function buildBar(pct, width) {
  const filled = Math.round((pct / 100) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

// ── Main Loop ─────────────────────────────────────────────────────────────────
function main() {
  const offlineEarnings = loadGame();

  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  let lastMsg = '';

  if (offlineEarnings && offlineEarnings > 0) {
    lastMsg = `Offline earnings: +$${fmt(offlineEarnings)}`;
  }

  // Passive income tick every 100 ms
  const TICK = 100;
  const ticker = setInterval(() => {
    addMoney(state.mps * (TICK / 1000));
    state.followers += state.mps * (TICK / 1000) * 0.001;
    renderUI(lastMsg);
  }, TICK);

  process.stdin.on('keypress', (str, key) => {
    if (!key) return;

    if (key.name === 'space') {
      clickAction();
      lastMsg = `+$${BASE_CLICK} clicked!`;
    } else if (key.name === 'q') {
      cleanup(ticker, false);
    } else if (key.name === 's') {
      cleanup(ticker, true);
    } else {
      const n = parseInt(str);
      if (n >= 1 && n <= UPGRADES.length) {
        const upg = UPGRADES[n - 1];
        const level = state.upgradeLevels[upg.name] || 0;
        const cost = calcCost(upg, level);
        if (buyUpgrade(n - 1)) {
          lastMsg = `Bought ${upg.name} Lv${level + 1} for $${fmt(cost)} → +$${fmt(upg.incomeBoost)}/s`;
        } else {
          lastMsg = `Not enough money for ${upg.name} ($${fmt(cost)} needed)`;
        }
      }
    }
  });

  renderUI(lastMsg);
}

function cleanup(ticker, save) {
  clearInterval(ticker);
  if (save) {
    saveGame();
    process.stdout.write(CLEAR);
    console.log('Game saved. See you next time!\n');
  } else {
    process.stdout.write(CLEAR);
    console.log('Quit without saving.\n');
  }
  if (process.stdin.isTTY) process.stdin.setRawMode(false);
  process.exit(0);
}

main();
