import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const input = 'w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', surname: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/doctors');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-36 pb-20 px-6 max-w-md mx-auto">
      <h1 className="text-4xl font-black text-slate-900 mb-8">Załóż <span className="text-blue-600">konto</span></h1>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input name="name" placeholder="Imię" value={form.name} onChange={change} className={input} required />
          <input name="surname" placeholder="Nazwisko" value={form.surname} onChange={change} className={input} required />
        </div>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} className={input} required />
        <input name="phone" placeholder="Telefon" value={form.phone} onChange={change} className={input} required />
        <input name="password" type="password" minLength={6} placeholder="Hasło (min. 6 znaków)" value={form.password} onChange={change} className={input} required />
        {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-50">
          {loading ? 'Tworzenie konta…' : 'Zarejestruj się'}
        </button>
      </form>
      <p className="mt-6 text-slate-600 text-sm">
        Masz już konto? <Link to="/login" className="text-blue-600 font-bold">Zaloguj się</Link>
      </p>
    </div>
  );
};

export default Register;
