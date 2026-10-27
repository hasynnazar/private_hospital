import React, { useState, useEffect, useRef } from 'react';
import { sendAiChatMessage } from '../api';
import { useNavigate } from 'react-router-dom';

const DEFAULT_WELCOME = {
  sender: 'ai',
  text: `Cześć! 👋 Jestem inteligentnym asystentem medycznym kliniki NovaMed.\n\nOpisz mi krótko swoje dolegliwości lub objawy (np. ból gardła, ucisk w klatce piersiowej, migrena), a przeanalizuję problem, zasugeruję właściwego lekarza specjalistę oraz sprawdzę dla Ciebie najbliższe wolne terminy wizyt.`
};

const SUGGESTIONS = [
  '❤️ Kłucie w klatce piersiowej i duszności',
  '👂 Ból gardła, ucha i katar',
  '🧠 Silne bóle głowy i zawroty',
  '🩺 Przeziębienie, gorączka i osłabienie'
];

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('novamed_ai_chat');
      return saved ? JSON.parse(saved) : [DEFAULT_WELCOME];
    } catch {
      return [DEFAULT_WELCOME];
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => {
    let sid = sessionStorage.getItem('novamed_ai_session');
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem('novamed_ai_session', sid);
    }
    return sid;
  });

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      sessionStorage.setItem('novamed_ai_chat', JSON.stringify(messages));
    } catch (e) {
      console.warn('Could not save chat history', e);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await sendAiChatMessage(text, sessionId);
      setMessages([...newMessages, { sender: 'ai', text: res.reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          sender: 'ai',
          text: `Przepraszam, wystąpił problem z połączeniem: ${err.message}. Możesz również wybrać lekarza bezpośrednio w zakładce "Specjaliści".`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([DEFAULT_WELCOME]);
    sessionStorage.removeItem('novamed_ai_chat');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3.5 rounded-full shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
          title="Otwórz asystenta medycznego AI"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="font-bold text-sm tracking-wide">Asystent Medyczny AI</span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-[92vw] sm:w-[440px] h-[600px] max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white px-6 py-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-xl">
                🩺
              </div>
              <div>
                <h3 className="font-black text-sm tracking-wide">Asystent AI NovaMed</h3>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  n8n Medical Agent
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition text-xs"
                title="Wyczyść rozmowę"
              >
                ↺
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition"
                title="Zamknij"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-sm">
                    AI
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white shadow-sm rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-sm">
                  AI
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-xs text-slate-400 ml-2 font-medium">Konsultacja z bazą lekarzy...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length <= 2 && !loading && (
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s)}
                  className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Booking CTA shortcut */}
          <div className="px-4 py-2 bg-blue-50/70 border-t border-blue-100 flex items-center justify-between text-xs text-blue-900">
            <span>Wybrano lekarza?</span>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/doctors');
              }}
              className="font-bold underline hover:text-blue-700"
            >
              Przejdź do rezerwacji →
            </button>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Opisz swoje objawy..."
              disabled={loading}
              className="flex-1 bg-slate-100 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl px-4 py-2.5 text-sm focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-slate-900 text-white hover:bg-blue-600 disabled:opacity-40 p-2.5 rounded-2xl transition shadow-sm"
              title="Wyślij wiadomość"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
