import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';


import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Clinicks from './pages/Clinicks'; 
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import MyAppointments from './pages/MyAppointments';
import Admin from './pages/Admin';
import AuthProvider from './auth/AuthProvider';
import ProtectedRoute from './auth/ProtectedRoute';
import { useAuth } from './auth/useAuth';
import logo from './assets/logo.png';
import AiChatWidget from './components/AiChatWidget';

function AuthNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Link to="/login" className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition shadow-lg text-sm">
        Zaloguj się
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      {user.role === 'ADMIN' ? (
        <Link to="/admin" className="font-bold text-slate-600 hover:text-blue-600 transition">Panel admina</Link>
      ) : (
        <Link to="/my-appointments" className="font-bold text-slate-600 hover:text-blue-600 transition">
          {user.role === 'DOCTOR' ? 'Mój grafik' : 'Moje wizyty'}
        </Link>
      )}
      <span className="hidden lg:inline text-slate-400">{user.name}</span>
      <button
        onClick={() => { logout(); navigate('/'); }}
        className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-600 transition shadow-lg"
      >
        Wyloguj
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-white">
          
          
          <nav className="flex items-center justify-between px-10 py-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
           <Link to="/" className="flex items-center no-underline group">
              <img 
                src={logo} 
                alt="NovaMed Logo" 
                className="h-16 md:h-20 w-auto object-contain hover:scale-105 hover:-rotate-1 transition-all duration-300" 
              />
            </Link>
            
            <div className="hidden md:flex gap-8 font-bold text-slate-600 uppercase text-xs tracking-widest">
              <Link to="/" className="hover:text-blue-600 transition">Start</Link>
              <Link to="/doctors" className="hover:text-blue-600 transition">Specjaliści</Link>
              <Link to="/clinicks" className="hover:text-blue-600 transition">Kliniki</Link>
              <Link to="/services" className="hover:text-blue-600 transition">Usługi</Link>
              <Link to="/contact" className="hover:text-blue-600 transition">Kontakt</Link>
            </div>

            <AuthNav />
          </nav>

        
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/clinicks" element={<Clinicks />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-appointments" element={
              <ProtectedRoute roles={['PATIENT', 'DOCTOR']}><MyAppointments /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute roles={['ADMIN']}><Admin /></ProtectedRoute>
            } />
          </Routes>

          <AiChatWidget />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;