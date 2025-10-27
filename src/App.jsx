import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Bileşenleri feature yollarından import et (feature/ yapısını koruyoruz)
import Layout from "./components/Layout"; // Genel Kullanıcı Layout'u
import PrivateRoute from "./feature/auth/PrivateRoute";
import LoginPage from "./feature/auth/LoginPage";

// Products (Kullanıcı Tarafı)
import ProductsPage from "./feature/products/ProductsPage";
import ProductDetailPage from "./feature/products/ProductDetailPage";
import ProductFormPage from "./feature/products/ProductFormPage";
import CartPage from "./feature/cart/CartPage";

import ProfileLayout from "./feature/profile/ProfileLayout";
import ProfileInfoPage from "./feature/profile/ProfileInfoPage";
import ProfileOrdersPage from "./feature/profile/ProfileOrdersPage";
import ProfileAddressesPage from "./feature/profile/ProfileAddressesPage";

// --- ADMİN SAYFALARI İMPORTU ---
import AdminRoute from "./feature/admin/routes/AdminRoute"; // Yetki kontrolü
import AdminLayout from "./feature/admin/layouts/AdminLayout"; // Admin şablonu
import AdminDashboardPage from "./feature/admin/pages/AdminDashbordPage"; 
import AdminProductsPage from "./feature/admin/pages/AdminProductsPage";
import AdminUsersPage from "./feature/admin/pages/AdminUsersPage";
// import AdminUsersPage from "./feature/admin/pages/AdminUsersPage"; // Kullanım dışı
import AdminCommentsPage from "./feature/admin/pages/AdminCommentsPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* 1. KORUMALI KULLANICI ROTALARI (Genel Layout'u Kullanır) */}
      <Route
        element={
          <PrivateRoute> 
            <Layout /> 
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        
        {/* Ürün CRUD Rotaları (Adminler burayı kullanır) */}
        <Route path="/add-product" element={<ProductFormPage />} />
        <Route path="/update-product/:id" element={<ProductFormPage />} />

        {/* Profil Rotaları */}
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<ProfileInfoPage />} />
          <Route path="orders" element={<ProfileOrdersPage />} />
          <Route path="addresses" element={<ProfileAddressesPage />} />
        </Route>
      </Route>

      {/* 2. KORUMALI ADMİN PANELİ ROTALARI (AdminLayout'u Kullanır) */}
      <Route
        path="/admin"
        element={ <AdminRoute> <AdminLayout /> </AdminRoute> } // Sadece Adminler girebilir
      >
        {/* /admin ve /admin/dashboard aynı sayfayı açar */}
        <Route index element={<AdminDashboardPage />} /> 
        <Route path="dashboard" element={<AdminDashboardPage />} /> 
        <Route path="products" element={<AdminProductsPage />} /> 
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="comments" element={<AdminCommentsPage />} />
        
      </Route>

      {/* Eşleşmeyen Rotalar */}
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
}

export default App;