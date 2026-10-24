import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, CalendarClock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatPrice, formatPercent, formatVolume } from '../utils/format';
import { Send } from 'lucide-react';
import { getStock, getStockHistory, getStockEarnings, getAISummary, askAIFollowup } from '../api';

// Stock details page displaying price charts, market data, and earnings reports,
// including AI-powered stock analysis and interactive follow-up questions.

const PERIODS = [
  { label: '1М', value: '1mo' },
  { label: '3М', value: '3mo' },
  { label: '6М', value: '6mo' },
  { label: '1Г', value: '1y' },
];

export default function StockDetail() {
  const { ticker } = useParams();
  const [quote, setQuote] = useState(null);
  const [history, setHistory] = useState([]);
  const [period, setPeriod] = useState('1mo');
  const [earnings, setEarnings] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const loadHistory = useCallback(async (p) => {
    setChartLoading(true);
    try {
      const data = await getStockHistory(ticker, p);
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setChartLoading(false);
    }
  }, [ticker]);

  useEffect(() => {
    getStock(ticker).then(setQuote).catch(console.error);
    getStockEarnings(ticker).then(setEarnings).catch(console.error);
    loadHistory(period);

    setAiLoading(true);
    getAISummary(ticker)
      .then((res) => setAiSummary(res.analysis))
      .catch(() => setAiSummary('AI анализата не е достапна во моментов.'))
      .finally(() => setAiLoading(false));
  }, [ticker]);

  useEffect(() => {
    loadHistory(period);
  }, [period, loadHistory]);

  const isPositive = quote?.percent_change >= 0;

  const handleAskFollowup = async (e) => {
  e.preventDefault();
  const question = chatInput.trim();
  if (!question) return;

  setChatMessages((prev) => [...prev, { role: 'user', text: question }]);
  setChatInput('');
  setChatLoading(true);

  try {
    const { answer } = await askAIFollowup(ticker, question, aiSummary);
    setChatMessages((prev) => [...prev, { role: 'ai', text: answer }]);
  } catch (err) {
    setChatMessages((prev) => [...prev, { role: 'ai', text: 'Настана грешка, пробај повторно.' }]);
  } finally {
    setChatLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-graphite text-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors text-sm mb-6">
          <ArrowLeft className="w-4 h-4" />
          Назад кон dashboard
        </Link>

        {quote && (
          <div className="flex items-end justify-between mb-8 animate-fade-in">
            <div className="flex items-start gap-4">
              {quote.logo && (
                <img
                  src={quote.logo}
                  alt=""
                  className="w-12 h-12 rounded-full bg-white/10 object-contain shrink-0 mt-1"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <div>
                <p className="text-muted text-sm mb-1">{quote.name}</p>
                <div className="flex items-baseline gap-3">
                  <h1 className="font-display font-semibold text-4xl tracking-tight">{quote.ticker}</h1>
                  <span className="font-mono text-2xl">{formatPrice(quote.price)}</span>
                </div>
              <span className={`font-mono text-sm ${isPositive ? 'text-positive' : 'text-negative'}`}>
                {formatPercent(quote.percent_change)} денес
              </span>
            </div>
            <p className="text-muted text-sm font-mono">Волумен: {formatVolume(quote.volume)}</p>
          </div>
        </div>
        )}

        {/* График */}
        <div className="bg-panel border border-panelBorder rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-base">Ценовно движење</h2>
            <div className="flex gap-1">
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    period === p.value
                      ? 'bg-accent text-graphite'
                      : 'text-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72">
            {chartLoading ? (
              <div className="h-full flex items-center justify-center text-muted text-sm">Се вчитува графикот…</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid stroke="#262A35" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#9199A8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={40}
                  />
                  <YAxis
                    stroke="#9199A8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={['auto', 'auto']}
                    width={55}
                  />
                  <Tooltip
                    contentStyle={{ background: '#191C24', border: '1px solid #262A35', borderRadius: 8 }}
                    labelStyle={{ color: '#9199A8' }}
                    itemStyle={{ color: '#F2F3F5' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke={isPositive ? '#3DDC97' : '#E8604C'}
                    strokeWidth={2}
                    dot={false}
                    animationDuration={600}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* AI Анализа */}
          <div className="bg-panel border border-panelBorder rounded-xl p-5 flex flex-col">
              <h2 className="font-display font-semibold text-base flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-accent" />
                AI Анализа
              </h2>

              {aiLoading ? (
                <p className="text-muted text-sm">AI ја анализира акцијата…</p>
              ) : (
                <p className="text-sm text-white/90 leading-relaxed whitespace-pre-line">{aiSummary}</p>
              )}

              {!aiLoading && (
                <div className="mt-4 pt-4 border-t border-panelBorder flex flex-col gap-3">
                  {chatMessages.length > 0 && (
                    <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`text-sm rounded-lg px-3 py-2 ${
                            msg.role === 'user'
                              ? 'bg-accent/15 text-white self-end ml-6'
                              : 'bg-white/5 text-white/90 self-start mr-6'
                          }`}
                        >
                          {msg.text}
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="text-sm text-muted self-start mr-6 px-3 py-2">Размислувам…</div>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleAskFollowup} className="flex items-center gap-2">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Постави прашање за оваа акција…"
                      className="flex-1 bg-graphite border border-panelBorder rounded-full px-4 py-2 text-sm outline-none focus:border-accent transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !chatInput.trim()}
                      className="bg-accent text-graphite rounded-full p-2 hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>

          {/* Earnings */}
          <div className="bg-panel border border-panelBorder rounded-xl p-5">
            <h2 className="font-display font-semibold text-base flex items-center gap-2 mb-3">
              <CalendarClock className="w-4 h-4 text-accent" />
              Следен Earnings извештај
            </h2>
            {earnings?.message ? (
              <p className="text-muted text-sm">{earnings.message}</p>
            ) : earnings ? (
              <div className="space-y-1 text-sm">
                <p><span className="text-muted">Датум:</span> {earnings.date}</p>
                <p><span className="text-muted">Проценет EPS:</span> {earnings.eps_estimate ?? '—'}</p>
                <p><span className="text-muted">Проценет приход:</span> {earnings.revenue_estimate ? `$${(earnings.revenue_estimate / 1e6).toFixed(0)}M` : '—'}</p>
              </div>
            ) : (
              <p className="text-muted text-sm">Се вчитува…</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}