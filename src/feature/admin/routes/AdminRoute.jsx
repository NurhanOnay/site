import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '../../auth/authSlice'; // Yolu kontrol et
import Spinner from '../../../components/Spinner'; 

export default function AdminRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole); 
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Yüklenme kontrolü (Admin Dashboard'un beyaz ekrana düşmesini engeller)
  if (isAuthenticated && !userRole) {
      return <div className="flex h-screen w-screen items-center justify-center bg-gray-100"><Spinner /></div>;
  }

  if (userRole !== 'admin') {
    return <Navigate to="/products" replace />;
  }

  return children;
}