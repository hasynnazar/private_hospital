const BASE = 'http://localhost:8080/api/v1';

export const getToken = () => localStorage.getItem('token');

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    let message = 'Wystąpił błąd serwera';
    if (res.status === 401) message = 'Sesja wygasła lub brak logowania';
    if (res.status === 403) message = 'Brak uprawnień do tej operacji';
    try {
      message = (await res.json()).message || message;
    } catch { /* brak treści JSON */ }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

const post = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) });

// --- publiczne ---
export const getDoctors = () => request('/doctors');
export const getFreeSlots = (doctorId, date) =>
  request(`/appointments/doctor/${doctorId}/free-slots?date=${date}`);

// --- autoryzacja ---
export const login = (email, password) => post('/auth/login', { email, password });
export const register = (data) => post('/auth/register', data);

// --- wizyty (wymagają tokena) ---
export const bookAppointment = (doctorId, dateTime) => post('/appointments', { doctorId, dateTime });
export const getMyAppointments = () => request('/appointments/my');
export const getAllAppointments = () => request('/appointments/all');
export const cancelAppointment = (id) => request(`/appointments/${id}/cancel`, { method: 'PATCH' });

// --- asystent AI (n8n integration) ---
export const sendAiChatMessage = (message, sessionId) =>
  post('/ai/chat', { message, sessionId });

// --- administrator ---
export const createDoctor = (doctor) => post('/doctors', doctor);

