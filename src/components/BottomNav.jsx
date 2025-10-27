import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../feature/auth/authSlice';
import { Home, User, ShoppingCart, LogOut } from 'lucide-react';

export default function BottomNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector((state) => state.cart.items.reduce((total, item) => total + item.quantity, 0));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getNavLinkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center pt-1 pb-1 w-full text-xs transition-colors ${
      isActive
        ? 'text-blue-600' // Aktif renk
        : 'text-gray-500 hover:text-gray-700' // Pasif renk
    }`;

  return (
    // Sadece mobil için (md:hidden), alta sabitlenmiş (fixed bottom-0), gölgeli
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.1)] md:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        <NavLink to="/products" className={getNavLinkClass} end>
          <Home size={24} />
          Ana Sayfa
        </NavLink>
        <NavLink to="/profile" className={getNavLinkClass}>
          <User size={24} />
          Profil
        </NavLink>
        <NavLink to="/cart" className={getNavLinkClass}>
           <div className="relative">
             <ShoppingCart size={24} />
             {cartCount > 0 && (
               <span className="absolute -top-1 -right-1 flex h-3 w-3">
                 <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                 <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
               </span>
             )}
           </div>
           Sepetim
        </NavLink>
        <button onClick={handleLogout} className="flex flex-col items-center justify-center pt-1 pb-1 w-full text-xs text-gray-500 hover:text-gray-700">
          <LogOut size={24} />
          Çıkış
        </button>
      </div>
    </nav>
  );
}