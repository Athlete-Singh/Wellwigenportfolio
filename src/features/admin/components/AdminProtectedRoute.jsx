import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('adminToken');

  const expiry = localStorage.getItem('adminTokenExpiry');
  const isTimeExpired = expiry ? Date.now() > Number(expiry) : false;

  const [isVerifying, setIsVerifying] = useState(!!token && !isTimeExpired);
  const [isValid, setIsValid] = useState(!!token && !isTimeExpired);

  useEffect(() => {
    let isMounted = true;

    // Strict 24h expiration check
    if (!token || isTimeExpired) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminTokenExpiry');
      localStorage.removeItem('wellwigen_admin_user');
      setIsVerifying(false);
      setIsValid(false);
      return;
    }

    // Setup active timer for the remainder of the 24 hours to automatically force re-login
    let autoLogoutTimer = null;
    if (expiry) {
      const remainingMs = Number(expiry) - Date.now();
      if (remainingMs > 0) {
        autoLogoutTimer = setTimeout(() => {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminTokenExpiry');
          localStorage.removeItem('wellwigen_admin_user');
          if (isMounted) setIsValid(false);
        }, remainingMs);
      } else {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminTokenExpiry');
        localStorage.removeItem('wellwigen_admin_user');
        setIsVerifying(false);
        setIsValid(false);
        return;
      }
    }

    axios
      .get(`${API_BASE}/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 8000,
      })
      .then((res) => {
        if (isMounted) {
          if (res.data?.valid) {
            setIsValid(true);
          } else {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminTokenExpiry');
            localStorage.removeItem('wellwigen_admin_user');
            setIsValid(false);
          }
          setIsVerifying(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          if (err.response?.status === 401 || err.response?.status === 403 || err.response?.data?.expired) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminTokenExpiry');
            localStorage.removeItem('wellwigen_admin_user');
            setIsValid(false);
          } else {
            // If momentary network delay and timestamp is still unexpired, allow access
            if (!isTimeExpired) {
              setIsValid(true);
            }
          }
          setIsVerifying(false);
        }
      });

    return () => {
      isMounted = false;
      if (autoLogoutTimer) clearTimeout(autoLogoutTimer);
    };
  }, [token, expiry, isTimeExpired]);

  // If no token exists at all, redirect immediately
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // While validating token on fresh reload
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#F2FAF8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-teal-500/30 border-t-teal-600 rounded-full animate-spin" />
          <span className="text-xs font-bold text-teal-800 tracking-wider uppercase">
            Verifying Admin Session...
          </span>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
