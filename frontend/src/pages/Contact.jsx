import React from 'react';

const Contact = () => {
  return (
    <div className="pt-32 px-10 max-w-4xl mx-auto">
      <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">
        Kontakt <span className="text-blue-600">SmartCare</span>
      </h1>
      <div className="grid gap-6">
        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-lg font-bold text-slate-800">📍 Adres:</p>
          <p className="text-slate-600">ul. Medyczna 12, 00-001 Warszawa</p>
          
          <p className="text-lg font-bold text-slate-800 mt-6">📞 Telefon:</p>
          <p className="text-slate-600">+48 123 456 789</p>
          
          <p className="text-lg font-bold text-slate-800 mt-6">✉️ Email:</p>
          <p className="text-slate-600">kontakt@smartcare.pl</p>
        </div>
      </div>
    </div>
  );
};

// ОБОВ'ЯЗКОВО ДОДАЙ ЦЕЙ РЯДОК:
export default Contact;