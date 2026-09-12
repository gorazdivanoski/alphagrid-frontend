import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, X, Plus, Sparkles } from 'lucide-react';
import { formatPrice, formatPercent, formatVolume } from '../utils/format';
import Skeleton from './Skeleton';

const SUGGESTED_TICKERS = [
  { ticker: 'AAPL', name: 'Apple Inc' },
  { ticker: 'NVDA', name: 'Nvidia' },
  { ticker: 'TSLA', name: 'Tesla' },
  { ticker: 'MSFT', name: 'Microsoft' },
];

export default function WatchlistTable({ items, loading, onAdd, onRemove }) {
  const [newTicker, setNewTicker] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTicker.trim()) return;
    setAdding(true);
    setError('');
    try {
      await onAdd(newTicker.trim().toUpperCase());
      setNewTicker('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Не успеа да се додаде тикерот');
    } finally {
      setAdding(false);
    }
  };

  const handleSuggestedAdd = async (ticker, name) => {
    setError('');
    try {
      await onAdd(ticker, name);
    } catch (err) {
      setError(err.response?.data?.detail || 'Не успеа да се додаде тикерот');
    }
  };

  return (
    <div className="bg-panel border border-panelBorder rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-base flex items-center gap-2">
          <Star className="w-4 h-4 text-accent" fill="currentColor" />
          Watchlist
        </h2>
        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <input
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value)}
            placeholder="пр. NVDA"
            className="bg-graphite border border-panelBorder rounded-md text-sm px-3 py-1.5 w-28 outline-none focus:border-accent transition-colors"
          />
          <button
            type="submit"
            disabled={adding}
            className="bg-accent text-graphite rounded-md p-1.5 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>

      {error && <p className="text-negative text-xs mb-3">{error}</p>}

      {loading && (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-1">
              <Skeleton className="w-6 h-6 rounded-full shrink-0" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-14" />
            </div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-10 px-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <p className="text-white/90 font-medium mb-1">Твојата watchlist е сѐ уште празна</p>
          <p className="text-muted text-sm mb-6">
            Додади тикер погоре, или почни со една од овие популарни акции:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTED_TICKERS.map((s) => (
              <button
                key={s.ticker}
                onClick={() => handleSuggestedAdd(s.ticker, s.name)}
                className="flex items-center gap-1.5 bg-graphite border border-panelBorder hover:border-accent rounded-full px-3.5 py-1.5 text-sm transition-colors"
              >
                <span className="font-mono font-medium">{s.ticker}</span>
                <span className="text-muted text-xs">{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && items.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted text-xs uppercase tracking-wide border-b border-panelBorder">
              <th className="text-left font-medium pb-2">Тикер</th>
              <th className="text-left font-medium pb-2">Компанија</th>
              <th className="text-right font-medium pb-2">Цена</th>
              <th className="text-right font-medium pb-2">% (1Д)</th>
              <th className="text-right font-medium pb-2">Волумен</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isPositive = item.percent_change >= 0;
              return (
                <tr
                  key={item.ticker}
                  className="border-b border-panelBorder/50 last:border-0 hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <td className="py-3 font-mono font-medium">
                    <Link
                      to={`/stock/${item.ticker}`}
                      className="flex items-center gap-2.5 group-hover:text-accent transition-colors"
                    >
                      {item.logo ? (
                        <img
                          src={item.logo}
                          alt=""
                          className="w-6 h-6 rounded-full bg-white/10 object-contain shrink-0"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {item.ticker.charAt(0)}
                        </div>
                      )}
                      {item.ticker}
                    </Link>
                  </td>
                  <td className="py-3 text-muted">
                    <Link to={`/stock/${item.ticker}`} className="block">
                      {item.name}
                    </Link>
                  </td>
                  <td className="py-3 text-right font-mono">
                    <Link to={`/stock/${item.ticker}`} className="block">
                      {formatPrice(item.price)}
                    </Link>
                  </td>
                  <td className={`py-3 text-right font-mono ${isPositive ? 'text-positive' : 'text-negative'}`}>
                    <Link to={`/stock/${item.ticker}`} className="block">
                      {formatPercent(item.percent_change)}
                    </Link>
                  </td>
                  <td className="py-3 text-right font-mono text-muted">
                    <Link to={`/stock/${item.ticker}`} className="block">
                      {formatVolume(item.volume)}
                    </Link>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onRemove(item.ticker)}
                      className="text-muted hover:text-negative transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
