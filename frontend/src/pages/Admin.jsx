import React, { useEffect, useState } from 'react';
import { createDoctor, getAllAppointments } from '../api';

const input = 'w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600';
const empty = { name: '', surname: '', profession: '', email: '', phone: '', imageUrl: '', password: '' };

const Admin = () => {
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    getAllAppointments().then(setAppointments).catch(() => {});
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      const d = await createDoctor(form);
      setMsg({ type: 'ok', text: `Dodano lekarza: ${d.name} ${d.surname}` });
      setForm(empty);
    } catch (err) {
      setMsg({ type: 'err', text: err.message });
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-8">Panel <span className="text-blue-600">administratora</span></h1>
        <h2 className="text-xl font-black mb-4">Dodaj lekarza</h2>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input name="name" placeholder="Imię" value={form.name} onChange={change} className={input} required />
            <input name="surname" placeholder="Nazwisko" value={form.surname} onChange={change} className={input} required />
          </div>
          <input name="profession" placeholder="Specjalizacja (np. Kardiolog)" value={form.profession} onChange={change} className={input} required />
          <input name="email" type="email" placeholder="Email (login lekarza)" value={form.email} onChange={change} className={input} required />
          <input name="phone" placeholder="Telefon" value={form.phone} onChange={change} className={input} required />
          <input name="imageUrl" placeholder="URL zdjęcia (opcjonalnie)" value={form.imageUrl} onChange={change} className={input} />
          <input name="password" type="password" minLength={6} placeholder="Hasło (min. 6 znaków)" value={form.password} onChange={change} className={input} required />
          {msg.text && <p className={`text-sm font-semibold ${msg.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>{msg.text}</p>}
          <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-colors">Dodaj lekarza</button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-black mb-4 md:mt-[4.5rem]">Wszystkie wizyty ({appointments.length})</h2>
        <div className="space-y-2 max-h-[32rem] overflow-y-auto">
          {appointments.map((a) => (
            <div key={a.id} className="border border-slate-100 rounded-2xl p-4 text-sm">
              <b>{a.dateTime.slice(0, 10)} {a.dateTime.slice(11, 16)}</b> · {a.doctorName}<br />
              <span className="text-slate-500">Pacjent: {a.patientName} · {a.status}</span>
            </div>
          ))}
          {appointments.length === 0 && <p className="text-slate-500">Brak wizyt.</p>}
        </div>
      </div>
    </div>
  );
};

export default Admin;
