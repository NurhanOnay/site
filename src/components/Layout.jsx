import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import Footer from './Footer'; // Footer'ı import et

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow pt-16 pb-16 md:pb-0">
        <Outlet />
      </main>
      <BottomNav />
      <Footer /> {/* Footer'ı en alta ekle */}
    </div>
  );
}