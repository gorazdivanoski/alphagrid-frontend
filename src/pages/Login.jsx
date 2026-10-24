import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Authentication page for user login and registration,
// including form validation, error handling, and navigation.

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, fullName, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Грешка при вчитување. Обиди се повторно.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1 className="auth-title">A-Grid</h1>
        <p className="auth-subtitle">
          {isRegister ? 'Креирај профил' : 'Најави се на твојот профил'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <label>
              Име и презиме
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </label>
          )}
          <label>
            Емаил
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Лозинка
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Се вчитува…' : isRegister ? 'Креирај профил' : 'Најави се'}
          </button>
        </form>

        <button className="auth-toggle" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Имате профил? Најави се' : 'Немате профил? Регистрирај се'}
        </button>
      </div>
    </div>
  );
}