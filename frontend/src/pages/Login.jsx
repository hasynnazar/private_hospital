import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const input = 'w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      navigate(user.role === 'ADMIN' ? '/admin' : user.role === 'DOCTOR' ? '/my-appointments' : '/doctors');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-36 pb-20 px-6 max-w-md mx-auto">
      <h1 className="text-4xl font-black text-slate-900 mb-8">Zaloguj <span className="text-blue-600">się</span></h1>
      <form onSubmit={submit} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} required />
        <input type="password" placeholder="Hasło" value={password} onChange={(e) => setPassword(e.target.value)} className={input} required />
        {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-50">
          {loading ? 'Logowanie…' : 'Zaloguj się'}
        </button>
      </form>
      <p className="mt-6 text-slate-600 text-sm">
        Nie masz konta? <Link to="/register" className="text-blue-600 font-bold">Zarejestruj się</Link>
      </p>
    </div>
  );
};

export default Login;
