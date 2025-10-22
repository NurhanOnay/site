import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../auth/authSlice';
import { User, ShoppingBag, MapPin, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function ProfileLayout() {
  const user = useSelector(selectUser); // Mevcut kullanıcıyı Redux'tan al
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // NavLink için stil belirleme (aktif sekmeyi vurgulamak için)
  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-600 text-white' // Aktif
        : 'text-gray-700 hover:bg-gray-100' // Pasif
    }`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        
        {/* --- Sol Taraf: Profil Menüsü --- */}
        <aside className="md:col-span-1">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            {/* Kullanıcı Bilgisi */}
            <div className="mb-6 flex flex-col items-center border-b pb-4">
              <span className="mb-2 rounded-full bg-blue-100 p-3 text-blue-600">
                <User size={40} />
              </span>
              <h2 className="text-lg font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            
            {/* Navigasyon Menüsü */}
            <nav className="space-y-1">
              <NavLink to="/profile" end className={getNavLinkClass}>
                <User size={18} />
                Hesap Bilgileri
              </NavLink>
              <NavLink to="/profile/orders" className={getNavLinkClass}>
                <ShoppingBag size={18} />
                Siparişlerim
              </NavLink>
              <NavLink to="/profile/addresses" className={getNavLinkClass}>
                <MapPin size={18} />
                Adreslerim
              </NavLink>
              <button
                onClick={handleLogout}
                className="mt-4 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                Çıkış Yap
              </button>
            </nav>
          </div>
        </aside>

        {/* --- Sağ Taraf: Değişen İçerik --- */}
        <main className="md:col-span-3">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            {/* Buraya /profile, /profile/orders veya /profile/addresses sayfaları gelecek */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}