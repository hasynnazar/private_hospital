import React from 'react';

const Clinicks = () => {
  return (
    <div className="pt-32 px-10">
      <h1 className="text-4xl font-black text-slate-900">Nasze Kliniki 🏢</h1>
      <p className="text-slate-500 mt-4 text-lg font-medium">
        Znajdź najbliższą placówkę SmartCare w Twoim mieście.
      </p>
      
      {/* Тимчасовий список для перевірки */}
      <div className="mt-10 grid gap-6">
        <div className="p-6 bg-white border rounded-2xl shadow-sm italic text-slate-400">
          Już wkrótce: Warszawa, Kraków, Wrocław...
        </div>
      </div>
    </div>
  );
};

// ОСЬ ЦЬОГО РЯДКА ТОБІ БРАКУВАЛО:
export default Clinicks;