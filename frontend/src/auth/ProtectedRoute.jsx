import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

/** Przekierowuje na /login, jeśli użytkownik nie jest zalogowany lub nie ma wymaganej roli. */
export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
