import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFreeSlots, bookAppointment } from '../api';
import { useAuth } from '../auth/useAuth';

const today = () => new Date().toISOString().slice(0, 10);
const timeOf = (iso) => iso.slice(11, 16);

const BookingModal = ({ doctor, onClose }) => {
  const { user } = useAuth();
  const [date, setDate] = useState(today());
  const [slots, setSlots] = useState([]);
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getFreeSlots(doctor.id, date)
      .then((s) => { if (!cancelled) { setSlots(s); setSlot(null); } })
      .catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [doctor.id, date]);

  const submit = async (e) => {
    e.preventDefault();
    if (!slot) { setError('Wybierz godzinę wizyty'); return; }
    setLoading(true);
    setError('');
    try {
      setDone(await bookAppointment(doctor.id, slot));
    } catch (err) {
      setError(err.message);
      getFreeSlots(doctor.id, date).then(setSlots).catch(() => {});
    } finally {
      setLoading(false);
    }
  };

  const shell = (content) => (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-[2rem] max-w-lg w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
        {content}
      </div>
    </div>
  );

  if (!user) {
    return shell(
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-3">Zaloguj się, aby zarezerwować wizytę</h2>
        <p className="text-slate-600 mb-6">Rezerwacja wizyt jest dostępna dla zalogowanych pacjentów.</p>
        <div className="flex gap-3">
          <Link to="/login" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-colors">Zaloguj się</Link>
          <Link to="/register" className="flex-1 border border-slate-200 py-4 rounded-2xl font-bold hover:bg-slate-50">Załóż konto</Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'PATIENT') {
    return shell(
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-3">Rezerwacja niedostępna</h2>
        <p className="text-slate-600 mb-6">Wizyty mogą rezerwować tylko konta pacjentów.</p>
        <button onClick={onClose} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold">Zamknij</button>
      </div>
    );
  }

  if (done) {
    return shell(
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-4">Wizyta zarezerwowana ✓</h2>
        <p className="text-slate-600">
          {doctor.name} {doctor.surname} ({doctor.profession})<br />
          <b>{done.dateTime.slice(0, 10)} o {timeOf(done.dateTime)}</b>
        </p>
        <div className="flex gap-3 mt-8">
          <Link to="/my-appointments" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-colors">Moje wizyty</Link>
          <button onClick={onClose} className="flex-1 border border-slate-200 py-4 rounded-2xl font-bold hover:bg-slate-50">Zamknij</button>
        </div>
      </div>
    );
  }

  return shell(
    <form onSubmit={submit} className="space-y-4">
      <h2 className="text-2xl font-black text-slate-900">Rezerwacja: {doctor.name} {doctor.surname}</h2>
      <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">{doctor.profession}</span>

      <input type="date" min={today()} value={date} onChange={(e) => setDate(e.target.value)}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600" required />

      <div className="grid grid-cols-4 gap-2">
        {slots.length === 0 && <p className="col-span-4 text-slate-500 text-sm">Brak wolnych terminów w tym dniu.</p>}
        {slots.map((s) => (
          <button type="button" key={s} onClick={() => setSlot(s)}
            className={`py-2 rounded-xl text-sm font-bold border transition-colors ${slot === s ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 hover:border-blue-600'}`}>
            {timeOf(s)}
          </button>
        ))}
      </div>

      {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}

      <div className="flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 border border-slate-200 py-4 rounded-2xl font-bold hover:bg-slate-50">Anuluj</button>
        <button type="submit" disabled={loading} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-50">
          {loading ? 'Rezerwuję…' : 'Zarezerwuj'}
        </button>
      </div>
    </form>
  );
};

export default BookingModal;
