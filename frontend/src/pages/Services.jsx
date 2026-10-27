import React from 'react';

const Services = () => {
  const services = [
    { title: "Kardiologia", icon: "❤️" },
    { title: "Neurologia", icon: "🧠" },
    { title: "Stomatologia", icon: "🦷" },
    { title: "Badania Krwi", icon: "🩸" }
  ];

  return (
    <div className="pt-32 px-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-black mb-10 text-slate-900">Nasze <span className="text-blue-600">Usługi</span></h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s, i) => (
          <div key={i} className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">{s.icon}</div>
            <h3 className="text-xl font-bold">{s.title}</h3>
            <p className="text-slate-500 mt-2 text-sm">Profesjonalna opieka i nowoczesna diagnostyka.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;