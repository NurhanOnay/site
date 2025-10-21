import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Products from "./pages/Products";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import ProductDetail from "./pages/ProductDetail";
import AddProduct from "./pages/AddProduct";

function AppWrapper() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  // Ürünleri buradan yöneteceğiz
  const [products, setProducts] = useState([]);

  return (
    <>
      {!isLoginPage && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Private route */}
        <Route path="/products" element={
          <PrivateRoute>
            <Products products={products} setProducts={setProducts} />
          </PrivateRoute>
        } />

        {/* Ürün detay sayfası */}
        <Route path="/product/:id" element={
          <PrivateRoute>
            <ProductDetail products={products} />
          </PrivateRoute>
        } />

        {/* Yeni ürün ekleme sayfası */}
        <Route path="/add-product" element={
          <PrivateRoute>
            <AddProduct products={products} setProducts={setProducts} />
          </PrivateRoute>
        } />

        {/* Default yönlendirme */}
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
