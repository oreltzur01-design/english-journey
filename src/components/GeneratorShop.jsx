import { calcGeneratorCost, calcGeneratorProduction, formatNumber } from '../gameLogic';

export default function GeneratorShop({ generators, upgrades, views, onBuy, prestigeMultiplier }) {
  return (
    <div className="generator-shop">
      {generators.map(gen => {
        const cost = calcGeneratorCost(gen, gen.owned);
        const canAfford = views >= cost;
        const production = calcGeneratorProduction(gen, gen.owned, upgrades, prestigeMultiplier);

        return (
          <button
            key={gen.id}
            className={`generator-item ${canAfford ? 'can-afford' : 'cannot-afford'} ${gen.owned > 0 ? 'has-owned' : ''}`}
            onClick={() => onBuy(gen.id)}
            disabled={!canAfford}
            title={gen.description}
          >
            <span className="gen-emoji">{gen.emoji}</span>
            <div className="gen-info">
              <div className="gen-name">{gen.name}</div>
              <div className="gen-desc">{gen.description}</div>
              {gen.owned > 0 && (
                <div className="gen-production">{formatNumber(production)}/s total</div>
              )}
            </div>
            <div className="gen-meta">
              <div className="gen-owned">{gen.owned}</div>
              <div className={`gen-cost ${canAfford ? 'affordable' : 'expensive'}`}>
                {formatNumber(cost)}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
