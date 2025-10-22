import React from "react";
// --- HATA ÇÖZÜMÜ: REACT ROUTER İMPORTLARI ---
import { Routes, Route, Navigate } from "react-router-dom"; 

// --- HATA ÇÖZÜMÜ: DİĞER TÜM BİLEŞEN İMPORTLARI ---
// Layout ve Auth
import Layout from "./components/Layout";
import PrivateRoute from "./feature/auth/PrivateRoute";
import LoginPage from "./feature/auth/LoginPage";

// Productsroducts/ProductsPage";
import ProductDetailPage from "./feature/products/ProductDetailPage";
import ProductFormPage from "./feature/products/ProductFormPage";
import ProductsPage from "./feature/products/ProductsPage";

// Cart
import CartPage from "./feature/cart/CartPage";

// Profile (Yeni eklediklerimiz)
import ProfileLayout from "./feature/profile/ProfileLayout";
import ProfileInfoPage from "./feature/profile/ProfileInfoPage";
import ProfileOrdersPage from "./feature/profile/ProfileOrdersPage";
import ProfileAddressesPage from "./feature/profile/ProfileAddressesPage";

function App() {
  return (
    <Routes>
      {/* 1. Login Sayfası (Header'sız) */}
      <Route path="/login" element={<LoginPage />} />

      {/* 2. Korumalı Sayfalar (Header'lı) */}
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* Ana Rotalar */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        
        {/* Admin Rotaları (Form) */}
        <Route path="/add-product" element={<ProductFormPage />} />
        <Route path="/update-product/:id" element={<ProductFormPage />} />
        
        {/* Profil Rotaları */}
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<ProfileInfoPage />} /> 
          <Route path="orders" element={<ProfileOrdersPage />} />
          <Route path="addresses" element={<ProfileAddressesPage />} />
        </Route>
        
        {/* Varsayılan Rota */}
        <Route path="/" element={<Navigate to="/products" replace />} />
      </Route>

      {/* 3. Eşleşmeyen Rotalar */}
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
}

export default App;