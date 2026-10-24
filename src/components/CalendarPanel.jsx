import { useState } from 'react';
import { Landmark, TrendingUp } from 'lucide-react';
import Skeleton from './Skeleton';

export default function CalendarPanel({ events, loading }) {
  const [expandedIdx, setExpandedIdx] = useState(null);

  return (
    <div className="bg-panel border border-panelBorder rounded-xl p-5 h-fit">
      <h2 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
        Настани оваа недела
      </h2>

      {loading && (
        <div className="flex flex-col gap-2.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3">
              <Skeleton className="w-8 h-8 rounded-md shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && events.length === 0 && (
        <p className="text-muted text-sm">Нема закажани настани оваа недела.</p>
      )}

      {!loading && events.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {events.map((event, idx) => {
            const isOpen = expandedIdx === idx;
            const isEarnings = event.source === 'earnings';
            const isPast = Boolean(event.is_past);

            return (
              <button
                key={`${event.date_iso}-${event.title}`}
                onClick={() => setExpandedIdx(isOpen ? null : idx)}
                className={`text-left rounded-lg border-l-[3px] px-4 py-3 transition-all ${
                  isPast ? 'opacity-50 hover:opacity-80' : ''
                } ${
                  isEarnings
                    ? 'border-l-positive bg-positive/[0.07] hover:bg-positive/[0.12]'
                    : 'border-l-accent bg-accent/[0.07] hover:bg-accent/[0.12]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${
                      isEarnings ? 'bg-positive/20 text-positive' : 'bg-accent/20 text-accent'
                    }`}
                  >
                    {isEarnings ? <TrendingUp className="w-4 h-4" /> : <Landmark className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm break-words min-w-0">{event.title}</p>
                      <span className="font-mono text-xs text-muted shrink-0 mt-0.5">{event.date}</span>
                    </div>
                    <p className="text-muted text-xs mt-0.5">{event.description}</p>
                    {isOpen && event.details && (
                      <p className="text-xs text-white/80 mt-2 pt-2 border-t border-white/10">
                        {event.details}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
