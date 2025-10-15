import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Route-level guard: checks context and localStorage synchronously to avoid flashes
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const stored = localStorage.getItem('auth_user');
  if (!user && !stored) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
