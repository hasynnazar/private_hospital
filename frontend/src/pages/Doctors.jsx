import React, { useEffect, useState } from 'react';
import { getDoctors } from '../api';
import BookingModal from './BookingModal';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getDoctors()
      .then(setDoctors)
      .catch(() => setError('Nie udało się pobrać listy lekarzy. Sprawdź, czy backend jest uruchomiony.'))
      .finally(() => setLoading(false));
  }, []);

  const professions = [...new Set(doctors.map((d) => d.profession).filter(Boolean))];
  const visible = filter ? doctors.filter((d) => d.profession === filter) : doctors;

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <h1 className="text-5xl font-black mb-8 text-slate-900 tracking-tight">Nasi <span className="text-blue-600">Specjaliści</span></h1>

      {professions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {['', ...professions].map((p) => (
            <button key={p || 'all'} onClick={() => setFilter(p)}
              className={`px-5 py-2 rounded-full text-sm font-bold border transition-colors ${filter === p ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600 hover:border-blue-600'}`}>
              {p || 'Wszyscy'}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="text-slate-500">Ładowanie…</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}
      {!loading && !error && visible.length === 0 && <p className="text-slate-500">Brak lekarzy do wyświetlenia.</p>}

      <div className="grid md:grid-cols-3 gap-8">
        {visible.map((doc) => (
          <div key={doc.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
            {doc.imageUrl ? (
              <img src={doc.imageUrl} alt={`${doc.name} ${doc.surname}`} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-slate-100 flex items-center justify-center text-6xl font-black text-blue-600/40">
                {doc.name?.[0]}{doc.surname?.[0]}
              </div>
            )}
            <div className="p-8">
              <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">{doc.profession}</span>
              <h3 className="text-2xl font-black mt-2 text-slate-900">dr {doc.name} {doc.surname}</h3>
              <button onClick={() => setSelected(doc)} className="mt-6 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-colors">
                Zarezerwuj wizytę
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && <BookingModal doctor={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Doctors;