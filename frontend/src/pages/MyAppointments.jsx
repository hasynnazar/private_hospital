import React, { useCallback, useEffect, useState } from 'react';
import { getMyAppointments, cancelAppointment } from '../api';
import { useAuth } from '../auth/useAuth';

const STATUS = {
  ACTIVE: { label: 'Aktywna', cls: 'bg-blue-100 text-blue-700' },
  COMPLETED: { label: 'Zakończona', cls: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Anulowana', cls: 'bg-slate-100 text-slate-500' },
};

const MyAppointments = () => {
  const { user } = useAuth();
  const isDoctor = user.role === 'DOCTOR';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    getMyAppointments()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const cancel = async (id) => {
    if (!window.confirm('Czy na pewno anulować wizytę?')) return;
    try {
      await cancelAppointment(id);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const upcoming = items.filter((a) => a.status === 'ACTIVE').length;

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <h1 className="text-5xl font-black mb-2 text-slate-900 tracking-tight">
        {isDoctor ? <>Mój <span className="text-blue-600">grafik</span></> : <>Moje <span className="text-blue-600">wizyty</span></>}
      </h1>
      <p className="text-slate-500 mb-10">Aktywne wizyty: <b>{upcoming}</b></p>

      {loading && <p className="text-slate-500">Ładowanie…</p>}
      {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}
      {!loading && items.length === 0 && <p className="text-slate-500">Brak wizyt.</p>}

      <div className="space-y-4">
        {items.map((a) => {
          const st = STATUS[a.status] || STATUS.ACTIVE;
          return (
            <div key={a.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-2xl font-black text-slate-900">
                  {a.dateTime.slice(0, 10)} <span className="text-blue-600">{a.dateTime.slice(11, 16)}</span>
                </p>
                {isDoctor ? (
                  <p className="text-slate-600">Pacjent: <b>{a.patientName}</b> · tel. {a.patientPhone}</p>
                ) : (
                  <p className="text-slate-600">{a.doctorName} · <span className="uppercase text-xs font-bold tracking-widest text-blue-600">{a.doctorProfession}</span></p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1 rounded-full text-xs font-bold ${st.cls}`}>{st.label}</span>
                {a.status === 'ACTIVE' && (
                  <button onClick={() => cancel(a.id)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold hover:border-red-500 hover:text-red-600 transition-colors">
                    Anuluj
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyAppointments;
