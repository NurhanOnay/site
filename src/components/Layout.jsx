import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Header'ı import ediyoruz

export default function Layout() {
  return (
    // min-h-screen: Ekranı kapla
    // flex flex-col: İçeriği dikey sırala (Header, main, Footer)
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Header'ımız 'fixed' ve yüksekliği 4rem (h-16) olacak.
        Bu nedenle, ana sayfa içeriğinin (main) header'ın altından başlaması için
        ona 'padding-top: 4rem' (pt-16) veriyoruz.
      */}
      <main className="flex-grow pt-16">
        {/* Rota içeriği (ProductsPage, AddProductPage vb.) burada görünecek */}
        <Outlet />
      </main>

      {/* İleride bir footer eklenecekse buraya gelir */}
      {/* <footer className="bg-white shadow-inner p-4 text-center text-sm text-gray-500">
        © 2024 NexBuy. Tüm hakları saklıdır.
      </footer> */}
    </div>
  );
}