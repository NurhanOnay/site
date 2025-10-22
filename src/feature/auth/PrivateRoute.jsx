import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './authSlice'; // authSlice'tan selector'ımızı alıyoruz

export default function PrivateRoute({ children }) {
  // Giriş durumunu localStorage'dan değil, doğrudan Redux store'dan okuyoruz.
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Giriş yapılmamışsa, kullanıcıyı login'e yönlendir.
    // 'state={{ from: location }}' kısmı, giriş yaptıktan sonra 
    // kullanıcının geri dönmesini sağlamak için iyi bir pratiktir.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Giriş yapılmışsa, korunan sayfayı (children, yani <Layout />) göster.
  return children;
}