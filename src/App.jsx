import { useState } from 'react';
import { useGameState } from './useGameState';
import {
  calcTotalVPS,
  calcClickValue,
  calcSubscribers,
  isPneiBetonActive,
  formatNumber,
} from './gameLogic';

import CurrencyDisplay from './components/CurrencyDisplay';
import ClickArea from './components/ClickArea';
import GeneratorShop from './components/GeneratorShop';
import UpgradeShop from './components/UpgradeShop';
import HypeMeter from './components/HypeMeter';
import PneiBeton from './components/PneiBeton';
import Milestones from './components/Milestones';
import Notification from './components/Notification';

export default function App() {
  const {
    state,
    handleClick,
    buyGenerator,
    buyUpgrade,
    activatePneiBeton,
    prestige,
    dismissNotification,
    resetSave,
  } = useGameState();

  const [shopTab, setShopTab] = useState('generators');

  const vps = calcTotalVPS(state.generators, state.upgrades, state.prestigeMultiplier);
  const clickValue = calcClickValue(state.upgrades);
  const subscribers = calcSubscribers(state.totalViews);
  const isImmune = isPneiBetonActive(state.pneiBeton);

  return (
    <div className="game-root">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="game-header">
        <div className="header-brand">
          <span className="brand-icon">🎬</span>
          <span className="brand-name">Vlogger Empire 2026</span>
          {state.prestigeMultiplier > 1 && (
            <span className="prestige-badge">
              ♻️ +{((state.prestigeMultiplier - 1) * 100).toFixed(0)}% bonus
            </span>
          )}
        </div>
        <CurrencyDisplay views={state.views} vps={vps} subscribers={subscribers} />
      </header>

      {/* ── Milestone notification ────────────────────────────────────────── */}
      {state.notification && (
        <Notification notification={state.notification} onDismiss={dismissNotification} />
      )}

      {/* ── Main layout ──────────────────────────────────────────────────── */}
      <main className="game-main">
        {/* Left panel */}
        <aside className="left-panel">
          <ClickArea
            onClick={handleClick}
            clickValue={clickValue}
            subscribers={subscribers}
          />

          <HypeMeter
            hypeMeter={state.hypeMeter}
            activeHaterEvent={state.activeHaterEvent}
            isImmune={isImmune}
          />

          {state.pneiBeton.unlocked && (
            <PneiBeton pneiBeton={state.pneiBeton} onActivate={activatePneiBeton} />
          )}

          <Milestones milestones={state.milestones} subscribers={subscribers} />

          {state.milestones['diamond_button'] && (
            <button className="prestige-btn" onClick={prestige}>
              <span>♻️ Prestige Reset</span>
              <small>Gain {formatNumber(Math.floor(Math.sqrt(state.totalViews)))} Influence Points</small>
            </button>
          )}

          <button className="reset-btn" onClick={() => { if (window.confirm('Reset all progress?')) resetSave(); }}>
            🗑 Hard Reset
          </button>
        </aside>

        {/* Right panel — shop */}
        <section className="right-panel">
          <div className="shop-tabs">
            <button
              className={`shop-tab ${shopTab === 'generators' ? 'active' : ''}`}
              onClick={() => setShopTab('generators')}
            >
              📺 Content Types
            </button>
            <button
              className={`shop-tab ${shopTab === 'upgrades' ? 'active' : ''}`}
              onClick={() => setShopTab('upgrades')}
            >
              ⚡ Upgrades
            </button>
          </div>

          <div className="shop-body">
            {shopTab === 'generators' ? (
              <GeneratorShop
                generators={state.generators}
                upgrades={state.upgrades}
                views={state.views}
                onBuy={buyGenerator}
                prestigeMultiplier={state.prestigeMultiplier}
              />
            ) : (
              <UpgradeShop
                upgrades={state.upgrades}
                generators={state.generators}
                views={state.views}
                onBuy={buyUpgrade}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
