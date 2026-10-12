import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { trainerApi } from '../../../services/trainerApi';

export default function TrainerProtectedRoute({ children }) {
  const location = useLocation();
  const isAuth = trainerApi.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/trainer/login" state={{ from: location }} replace />;
  }

  return children;
}
