import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StockDetail from './pages/StockDetail';

// Main React application defining public and protected routes,
// including authentication checks, dashboard, and stock detail navigation.

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="screen-loading">Се вчитува…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/stock/:ticker" element={<ProtectedRoute><StockDetail /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;