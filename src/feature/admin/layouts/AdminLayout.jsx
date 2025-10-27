import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../auth/authSlice';
import { selectUser } from '../../auth/authSlice';
import { LayoutDashboard, Package, Users, LogOut, Menu, X, ArrowLeft, MessageSquare } from 'lucide-react';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // NavLink için aktif stil fonksiyonu (Mor/Pembe Uyumlu)
  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors text-sm font-medium ${
      isActive
        ? 'bg-purple-100 text-purple-700 font-semibold shadow-sm' 
        : 'text-gray-600 hover:bg-purple-50 hover:text-purple-800'
    }`;

  return (
    // Ana Kapsayıcı: Tam Ekran Yüksekliği
    <div className="flex h-screen bg-gray-100 overflow-hidden"> 
      
      {/* 1. SOL SİDEBAR (Kenar Çubuğu) */}
      <aside 
          // Mobilde Sabit, Masaüstünde Kalıcı (Sticky)
          className={`fixed top-0 left-0 z-40 h-full w-64 flex-shrink-0 
                      bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
                      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                      md:sticky md:translate-x-0 md:shadow-lg`}
      >
        {/* Başlık ve Kapatma Butonu */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
           {/* Logo - Mobil menüdeyken logoya tıklanırsa menü kapanır */}
           <Link to="/admin/dashboard" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
             <img className="h-7 w-auto" src="/images/elogo.png" alt="NexBuy" />
             <span className="text-lg font-bold text-purple-700">Admin Paneli</span>
           </Link>
           {/* Mobil Kapatma Butonu */}
           <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700 md:hidden">
             <X size={24} />
           </button>
        </div>
        
        {/* Navigasyon Alanı */}
        <div className="flex flex-col h-[calc(100%-4rem)]">
          <nav className="flex flex-col flex-grow p-4 space-y-1 overflow-y-auto">
            {/* Linkler - onClick={() => setSidebarOpen(false)} ile mobil menü kapanır */}
            <NavLink to="/admin/dashboard" end className={getNavLinkClass} onClick={() => setSidebarOpen(false)}><LayoutDashboard size={18} /> Dashboard</NavLink>
            <NavLink to="/admin/products" className={getNavLinkClass} onClick={() => setSidebarOpen(false)}><Package size={18} /> Ürün Yönetimi</NavLink>
            <NavLink to="/admin/comments" className={getNavLinkClass} onClick={() => setSidebarOpen(false)}><MessageSquare size={18} /> Yorumlar</NavLink>
            <NavLink to="/admin/users" className={getNavLinkClass} onClick={() => setSidebarOpen(false)}><Users size={18} /> Kullanıcılar</NavLink>
          </nav>
        
          {/* Logout Butonu (En Alta Sabit) */}
          <div className="pt-4 border-t border-gray-200 p-4">
             <button
               onClick={handleLogout}
               className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
             >
               <LogOut size={18} /> Çıkış Yap
             </button>
          </div>
        </div>
        
      </aside>

      {/* Mobil Overlay */}
      {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* 2. SAĞ İÇERİK ALANI */}
      <div className="flex-1 flex flex-col overflow-y-auto"> 
        
        {/* Admin Header (Üst Bar) */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
           {/* Mobil Sidebar Açma Butonu (onClick={toggleSidebar} yerine direkt state ayarı) */}
           <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-purple-700 md:hidden mr-4">
               <Menu size={24} />
           </button>
           
           <span className="text-sm font-medium text-gray-700 ml-auto">Hoşgeldin, {user?.firstName || 'Admin'}!</span>
           
           {/* Kullanıcı Sitesine Dön Butonu */}
           <Link to="/products" className="ml-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-600 hidden sm:flex">
             <ArrowLeft size={16} /> Kullanıcı Sitesine Dön
           </Link>
        </header>

        {/* Ana İçerik (Outlet ile değişecek) */}
        <main className="flex-grow p-6">
          <Outlet /> {/* Admin sayfaları buraya render edilecek */}
        </main>
      </div>
    </div>
  );
}