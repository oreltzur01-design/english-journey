import { isUpgradeAvailable, formatNumber } from '../gameLogic';

export default function UpgradeShop({ upgrades, generators, views, onBuy }) {
  const available = upgrades.filter(u => isUpgradeAvailable(u, generators));
  const purchased = upgrades.filter(u => u.purchased);

  return (
    <div className="upgrade-shop">
      {available.length === 0 && purchased.length === 0 && (
        <div className="shop-empty">
          <span>Buy some content to unlock upgrades!</span>
          <span className="shop-empty-sub">Upgrades appear once you own a content type.</span>
        </div>
      )}

      {available.length > 0 && (
        <div className="upgrade-section">
          {available.map(upgrade => {
            const canAfford = views >= upgrade.cost;
            return (
              <button
                key={upgrade.id}
                className={`upgrade-item ${canAfford ? 'can-afford' : 'cannot-afford'}`}
                onClick={() => onBuy(upgrade.id)}
                disabled={!canAfford}
              >
                <div className="upgrade-info">
                  <div className="upgrade-name">{upgrade.name}</div>
                  <div className="upgrade-desc">{upgrade.description}</div>
                </div>
                <div className={`upgrade-cost ${canAfford ? 'affordable' : 'expensive'}`}>
                  {formatNumber(upgrade.cost)}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {purchased.length > 0 && (
        <div className="purchased-section">
          <div className="section-header">✓ Purchased</div>
          {purchased.map(upgrade => (
            <div key={upgrade.id} className="upgrade-item purchased">
              <div className="upgrade-name">{upgrade.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
