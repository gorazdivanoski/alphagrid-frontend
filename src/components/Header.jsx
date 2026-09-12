import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Settings, LogOut, ChevronDown } from 'lucide-react';
import { searchStocks } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Header({ onSelectTicker }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const containerRef = useRef(null);
  const profileRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const data = await searchStocks(query.trim());
        setResults(data);
        setOpen(true);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (symbol, description) => {
    onSelectTicker(symbol, description);
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = user?.full_name?.charAt(0)?.toUpperCase() || '?';

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-panelBorder">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center">
          <span className="font-display font-bold text-graphite text-sm">A</span>
        </div>
        <span className="font-display font-semibold text-lg tracking-tight">A-Grid</span>
      </div>

      <div className="relative w-full max-w-sm mx-8" ref={containerRef}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
          placeholder="Пребарај тикер или компанија"
          className="w-full bg-panel border border-panelBorder rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-muted outline-none focus:border-accent transition-colors"
        />

        {open && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#20242E] border border-accent/30 rounded-lg overflow-hidden z-20 max-h-72 overflow-y-auto shadow-xl shadow-black/40">
            {loading && <p className="px-4 py-3 text-sm text-muted">Пребарува…</p>}
            {!loading && results.length === 0 && (
              <p className="px-4 py-3 text-sm text-muted">Нема резултати</p>
            )}
            {!loading &&
              results.map((r) => (
                <button
                  key={r.symbol}
                  onClick={() => handleSelect(r.symbol, r.description)}
                  className="w-full text-left px-4 py-2.5 hover:bg-white/5 transition-colors flex items-center justify-between"
                >
                  <span className="font-mono text-sm font-medium">{r.symbol}</span>
                  <span className="text-xs text-muted truncate ml-3">{r.description}</span>
                </button>
              ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button className="text-muted hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 hover:bg-white/5 rounded-full pl-1 pr-2 py-1 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-panel border border-panelBorder flex items-center justify-center font-display font-semibold text-xs">
              {initial}
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-muted transition-transform ${profileOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {profileOpen && (
            <div className="absolute top-full right-0 mt-2 bg-[#20242E] border border-panelBorder rounded-lg overflow-hidden z-20 w-56 shadow-xl shadow-black/40">
              <div className="px-4 py-3 border-b border-panelBorder">
                <p className="text-sm font-medium truncate">{user?.full_name}</p>
                <p className="text-xs text-muted truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-negative hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Одјави се
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
