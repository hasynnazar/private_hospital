import React, { useState, useEffect, useRef } from 'react';

// --- КОМПОНЕНТ ЧАТ-БОТА ---
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    { text: "Cześć! Jestem Twoim asystentem AI NovaMed. Opisz swoje objawy, a ja postaram się pomóc.", isBot: true }
  ]);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages(prev => [...prev, { text: inputValue, isBot: false }]);
    setInputValue("");
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "Analizuję... Wygląda na to, że Twoje objawy mogą wymagać konsultacji z laryngologiem.", isBot: true }]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <button onClick={() => setIsOpen(!isOpen)} className="bg-slate-900 text-white p-5 rounded-full shadow-2xl hover:bg-blue-600 transition-all flex items-center gap-3 border-none cursor-pointer group">
        {isOpen ? '✕' : <><span className="text-2xl">🤖</span><span className="font-bold text-sm">Asystent AI</span></>}
      </button>
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-[380px] h-[550px] bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-slate-900 p-6 text-white font-black">NovaMed AI</div>
          <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm ${msg.isBot ? 'bg-white border text-slate-800' : 'bg-blue-600 text-white'}`}>{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 bg-white border-t flex gap-3">
            <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} className="flex-1 p-4 bg-slate-50 rounded-xl outline-none border border-slate-200 text-slate-900" placeholder="Opisz objawy..." />
            <button onClick={handleSend} className="bg-blue-600 text-white w-12 h-12 rounded-xl">➜</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- САМА СТОРІНКА HOME ---
function Home() {
  const hospitalImageUrl = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="relative py-32 md:py-48 px-6 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={hospitalImageUrl} alt="Hospital" className="w-full h-full object-cover opacity-40 scale-105 animate-pulse-slow" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent"></div>
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-10">
          <span className="bg-blue-600/20 text-blue-300 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-blue-500/20">Nowoczesna Diagnostyka AI</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.95]">Przyszłość zdrowia <br /><span className="text-blue-400 italic">zaczyna się tutaj.</span></h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto font-medium">Skonsultuj objawy z naszym asystentem AI i zarezerwuj wizytę u najlepszych specjalistów.</p>
          <div className="flex justify-center gap-6 pt-6">
            <button className="bg-blue-600 text-white px-14 py-5 rounded-[2.5rem] text-xl font-black hover:bg-blue-700 transition-all">Umów wizytę</button>
          </div>
        </div>
      </header>

      {/* Секція послуг */}
      <section className="bg-white py-28 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center">
            <div className="p-12 bg-white rounded-[3.5rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all">
              <div className="text-6xl mb-8">🤖</div>
              <h3 className="text-3xl font-black mb-5 text-slate-950">AI Diagnoza</h3>
              <p className="text-slate-600 text-lg">Szybka wstępna analiza objawów dzięki AI.</p>
            </div>
            <div className="p-12 bg-white rounded-[3.5rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all">
              <div className="text-6xl mb-8">👨‍⚕️</div>
              <h3 className="text-3xl font-black mb-5 text-slate-950">Eksperci</h3>
              <p className="text-slate-600 text-lg">Dostęp do certyfikowanych lekarzy.</p>
            </div>
            <div className="p-12 bg-white rounded-[3.5rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all">
              <div className="text-6xl mb-8">🏥</div>
              <h3 className="text-3xl font-black mb-5 text-slate-950">Kliniki</h3>
              <p className="text-slate-600 text-lg">Nowoczesny sprzęt i komfortowe warunki.</p>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-50 border-t border-slate-100 text-center">
        <div className="text-xl font-black text-blue-600 mb-4">NovaMed Polska</div>
        <p className="text-slate-400 text-sm">© 2026 NovaMed. Wszystkie prawa zastrzeżone.</p>
      </footer>

      {/* Чат-бот */}
      <ChatBot />
    </div>
  );
}

export default Home;