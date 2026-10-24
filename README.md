# AlphaGrid Frontend

Web interface for **AlphaGrid**, a stock-market dashboard. Users can keep a watchlist with live prices, open detailed stock pages with charts and AI-generated briefings, and see the week's market-moving events at a glance. The interface is in Macedonian.

This app needs the **alphagrid-backend** API to run.

## Features

- **Login and registration** with JWT sessions (the token is stored in `localStorage`; an expired session redirects to the login page).
- **Dashboard:** a personalised greeting, the user's watchlist (price, daily change, volume, logo; refreshed every 15 seconds) and the "events this week" panel.
- **Watchlist management:** add tickers through the input or suggested tickers, remove them, or click a row to open the stock page.
- **Weekly events:** FOMC rate decisions, CPI, employment and GDP releases, and earnings reports for watchlist stocks. Past events are dimmed and each event expands for details.
- **Stock detail page:** price chart (1M, 3M, 6M, 1Y), market data, next earnings report, an AI briefing and a chat for follow-up questions.
- **Search:** debounced ticker and company search in the header.

## Tech stack

React 19, Vite, Tailwind CSS 4, React Router, Axios, Recharts, Lucide icons.

## Getting started

### Prerequisites

- Node.js 20.19 or newer (required by Vite)
- The backend running at `http://127.0.0.1:8000` (see the **alphagrid-backend** README)

### Install and run

```bash
git clone <repo-url>
cd alphagrid-frontend
npm install
npm run dev
```

Open the address Vite prints, usually http://localhost:5173. Register an account and log in.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Configuration

The API address is set in `src/api.js` (`API_BASE`, currently `http://127.0.0.1:8000`). Change it there if the backend runs elsewhere.

## Project structure

```
src/
  main.jsx, App.jsx     entry point and routes (/login, /, /stock/:ticker)
  api.js                Axios client and all API calls
  context/              AuthContext (user session)
  pages/                Login, Dashboard, StockDetail
  components/           Header, WatchlistTable, CalendarPanel, WelcomeBanner, Skeleton
  utils/format.js       price, percentage and volume formatting
```

## Disclaimer

AlphaGrid is a learning project. Market data and AI-generated text are informational only and are not financial advice.
