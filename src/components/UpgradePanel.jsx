import { UPGRADES } from '../game/constants.js';
import { calcUpgradeCost, fmt, fmtMoney } from '../game/engine.js';

export default function UpgradePanel({ state, buyUpgrade }) {
  const { money, subscribers, upgradeCounts } = state;

  return (
    <div className="panel upgrade-panel">
      <div className="panel-title">Upgrades</div>
      <div className="upgrade-list">
        {UPGRADES.map((upgrade) => {
          const count = upgradeCounts[upgrade.id] || 0;
          const isMaxed = count >= upgrade.max;
          const lockedBySubs = upgrade.reqSubs && subscribers < upgrade.reqSubs;
          const cost = isMaxed ? 0 : calcUpgradeCost(upgrade, count);
          const canAfford = !isMaxed && money >= cost;
          const isDisabled = isMaxed || lockedBySubs || !canAfford;

          let itemClass = 'upgrade-item';
          if (lockedBySubs) itemClass += ' locked-upgrade';
          if (isMaxed) itemClass += ' maxed';

          return (
            <div key={upgrade.id} className={itemClass}>
              <div className="upgrade-header">
                <span className="upgrade-icon">{upgrade.icon}</span>
                <div className="upgrade-info">
                  <div className="upgrade-name">{upgrade.name}</div>
                  <div className="upgrade-desc">{upgrade.desc}</div>
                  {upgrade.trait && (
                    <div style={{ fontSize: '0.65rem', color: '#bb86fc', marginTop: '2px' }}>
                      ✨ Grants: {upgrade.trait} trait
                    </div>
                  )}
                </div>
                <div className={`upgrade-count ${isMaxed ? 'at-max' : ''}`}>
                  {count}/{upgrade.max}
                  {isMaxed && <div style={{ fontSize: '0.6rem', color: '#00ff88' }}>MAX</div>}
                </div>
              </div>

              <div className="upgrade-footer">
                {lockedBySubs ? (
                  <span className="upgrade-locked-msg">
                    🔒 Need {fmt(upgrade.reqSubs)} subs
                  </span>
                ) : isMaxed ? (
                  <span className="text-green" style={{ fontSize: '0.75rem' }}>
                    ✅ Fully upgraded
                  </span>
                ) : (
                  <span className={`upgrade-cost ${canAfford ? 'can-afford' : ''}`}>
                    {fmtMoney(cost)}
                  </span>
                )}

                {!lockedBySubs && !isMaxed && (
                  <button
                    className="upgrade-buy-btn"
                    onClick={() => buyUpgrade(upgrade.id)}
                    disabled={isDisabled}
                  >
                    Buy
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
