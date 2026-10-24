import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWatchList, addToWatchlist, removeFromWatchlist, getThisWeekEvents } from '../api';
import Header from '../components/Header';
import CalendarPanel from '../components/CalendarPanel';
import WatchlistTable from '../components/WatchlistTable';

// Main dashboard displaying the user's watchlist and weekly financial events,
// including live stock price updates and watchlist management.

export default function Dashboard() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [events, setEvents] = useState([]);
  const [watchlistLoading, setWatchlistLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);

  const loadWatchlist = useCallback(async () => {
    try {
      const data = await getWatchList();
      setWatchlist(data);
    } catch (err) {
      console.error('Грешка при вчитување на watchlist:', err);
    } finally {
      setWatchlistLoading(false);
    }
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      const data = await getThisWeekEvents();
      setEvents(data);
    } catch (err) {
      console.error('Грешка при вчитување на настани:', err);
    } finally {
      setEventsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWatchlist();
    loadEvents();

    // Refresh stock prices every 15 seconds to match the backend cache TTL.
    const interval = setInterval(loadWatchlist, 15000);
    return () => clearInterval(interval);
  }, [loadWatchlist, loadEvents]);

  const handleAdd = async (ticker, companyName) => {
    await addToWatchlist(ticker, companyName);
    await loadWatchlist();
  };

  const handleRemove = async (ticker) => {
    await removeFromWatchlist(ticker);
    await loadWatchlist();
  };

  return (
    <div className="min-h-screen bg-graphite">
      <Header onSelectTicker={handleAdd} />
      <div className="px-8 pt-8 pb-2">
          <h1 className="font-display font-semibold text-2xl tracking-tight">
            Здраво, {user?.full_name?.split(' ')[0] || 'инвеститор'}
          </h1>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5 px-8 py-6">
        <CalendarPanel events={events} loading={eventsLoading} />
        <WatchlistTable
          items={watchlist}
          loading={watchlistLoading}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      </main>
    </div>
  );
}