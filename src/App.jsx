import { useGameState } from './hooks/useGameState.js';
import { getAct } from './game/engine.js';
import { ACTS } from './game/constants.js';
import StatsBar from './components/StatsBar.jsx';
import VideoCreator from './components/VideoCreator.jsx';
import HypeMeter from './components/HypeMeter.jsx';
import PneiBeton from './components/PneiBeton.jsx';
import UpgradePanel from './components/UpgradePanel.jsx';
import MilestonePanel from './components/MilestonePanel.jsx';
import ActProgress from './components/ActProgress.jsx';
import EventBanner from './components/EventBanner.jsx';
import './styles/game.css';

export default function App() {
  const {
    state,
    buyUpgrade,
    makeVideo,
    activatePneiBeton,
    deactivatePneiBeton,
    prestige,
    clearNotification,
  } = useGameState();

  const actNum = getAct(state.subscribers);
  const act = ACTS[actNum];

  return (
    <div className="app">
      <header className="app-header">
        <h1>Vlogger Empire 2026</h1>
        <div className="header-act">
          <span>Act {actNum}:</span>
          <span className="header-act-name">{act.name}</span>
          <span>—</span>
          <span className="header-location">{act.location}</span>
        </div>
      </header>

      <main className="main-content">
        <div className="stats-bar-container">
          <StatsBar state={state} />
        </div>

        <div className="left-column">
          <VideoCreator state={state} makeVideo={makeVideo} />
          <HypeMeter hypeLevel={state.hypeLevel} />
          <PneiBeton
            pneiBeton={state.pneiBeton}
            traits={state.traits}
            activatePneiBeton={activatePneiBeton}
            deactivatePneiBeton={deactivatePneiBeton}
          />
        </div>

        <div className="center-column">
          <ActProgress
            state={state}
            actNum={actNum}
            prestige={prestige}
          />
          <MilestonePanel
            subscribers={state.subscribers}
            milestones={state.milestones}
          />
        </div>

        <div className="right-column">
          <UpgradePanel
            state={state}
            buyUpgrade={buyUpgrade}
          />
        </div>
      </main>

      {state.currentEvent && (
        <EventBanner event={state.currentEvent} />
      )}

      {state.notification && (
        <div className={`notification-toast ${state.notification.type}`}>
          <span className="notification-text">{state.notification.text}</span>
          <button className="notification-close" onClick={clearNotification}>✕</button>
        </div>
      )}
    </div>
  );
}
