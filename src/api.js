// Axios API service for handling authentication, watchlist, stock data,
// AI analysis, and calendar requests, including JWT token management
// and automatic handling of unauthorized responses.

import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const loginUser = (email, password) =>
  api.post('/auth/login', { email, password }).then((res) => res.data);

export const registerUser = (email, full_name, password) =>
  api.post('/auth/register', { email, full_name, password }).then((res) => res.data);

export const getCurrentUser = () =>
  api.get('/auth/me').then((res) => res.data);

// Watchlist
export const getWatchList = () =>
  api.get('/watchlist').then((res) => res.data);

export const addToWatchlist = (ticker, companyName) =>
  api.post('/watchlist', { ticker, company_name: companyName }).then((res) => res.data);

export const removeFromWatchlist = (ticker) =>
  api.delete(`/watchlist/${ticker}`).then((res) => res.data);

// Stocks
export const getStock = (ticker) =>
  api.get(`/stocks/${ticker}`).then((res) => res.data);

export const searchStocks = (query) =>
  api.get(`/stocks/search?q=${query}`).then((res) => res.data);

export const getStockHistory = (ticker, period = '1mo') =>
  api.get(`/stocks/${ticker}/history?period=${period}`).then((res) => res.data);

export const getStockEarnings = (ticker) =>
  api.get(`/stocks/${ticker}/earnings`).then((res) => res.data);

export const getAISummary = (ticker) =>
  api.get(`/stocks/${ticker}/ai-summary`).then((res) => res.data);

export const askAIFollowup = (ticker, question, previousAnalysis) =>
  api
    .post(`/stocks/${ticker}/ai-chat`, { question, previous_analysis: previousAnalysis })
    .then((res) => res.data);

// Calendar
export const getThisWeekEvents = () =>
  api.get('/calendar/this-week').then((res) => res.data);

export default api;