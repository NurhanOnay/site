import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../feature/cart/cartSlice"; // <-- Doğru feature yolu
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  LogOut,
  LogIn,
  Trash2,
  User,
} from "lucide-react";
// "../styles/Header.css" import'u burada YOK!

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Component State
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Auth State (localStorage'dan)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Redux State
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  // --- EFFECT'LER ---

  // 1. Auth Durumunu Kontrol Et
  useEffect(() => {
    const updateAuthStatus = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };
    updateAuthStatus();
    window.addEventListener('storage', updateAuthStatus);
    return () => window.removeEventListener('storage', updateAuthStatus);
  }, []);

  // 2. Header'ı Scroll'a Göre Gizle/Göster
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setHideHeader(true);
      } else {
        setHideHeader(false);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // 3. Modallar Açıkken Arka Plan Kaydırmasını Engelle
  useEffect(() => {
    document.body.style.overflow = (menuOpen || showCart) ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [menuOpen, showCart]);


  // --- FONKSİYONLAR ---

  const closeModals = () => {
    setMenuOpen(false);
    setShowCart(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    dispatch(clearCart());
    closeModals();
    navigate("/login");
  };

  const handleLogin = () => {
    closeModals();
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery("");
      closeModals();
    }
  };

  // İSTEĞİNİZ: Siparişi tamamlama ve alert
  const handleCompleteOrder = () => {
    dispatch(clearCart());
    closeModals();
    setTimeout(() => {
      alert("Siparişiniz başarıyla alındı!");
    }, 100);
    navigate("/products");
  };

  return (
    <>
      {/* --- Overlay (Mobil Menü/Sepet Açıkken) --- */}
      {(menuOpen || showCart) && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
          onClick={closeModals}
        />
      )}

      {/* --- ANA HEADER --- */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-md transition-transform duration-300 ${
          hideHeader ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {/* h-16 = height: 4rem (64px) */}
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo ve Ana Navigasyon (Sol ve Orta) */}
          <div className="flex items-center gap-6">
            <Link to="/products" className="flex flex-shrink-0 items-center gap-2" onClick={closeModals}>
              <img className="h-8 w-auto" src="/images/elogo.png" alt="NexBuy" />
              <span className="hidden text-xl font-bold text-gray-800 sm:block">NexBuy</span>
            </Link>
            <nav className="hidden items-center space-x-6 md:flex">
              <Link to="/" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                Ana Sayfa
              </Link>
              <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                Ürünler
              </Link>
            </nav>
          </div>

          {/* Aksiyon Alanı (Sağ Taraf) */}
          <div className="flex items-center gap-3 sm:gap-4">
            <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 rounded-full border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 xl:w-64"
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </button>
            </form>


            {/* Auth Butonları (Desktop) */}
            <div className="hidden items-center gap-2 md:flex">
              {isLoggedIn ? (
                <>
                  {/* --- YENİ EKLENEN PROFİL LİNKİ --- */}
                  <Link
                    to="/profile"
                    className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                    aria-label="Profilim"
                  >
                    <User size={22} />
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 rounded-full bg-red-50 py-2 px-4 text-sm font-medium text-red-600 hover:bg-red-100"
                  >
                    <LogOut size={16} /> Çıkış
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-1.5 rounded-full bg-blue-50 py-2 px-4 text-sm font-medium text-blue-600 hover:bg-blue-100"
                >
                  <LogIn size={16} /> Giriş
                </button>
              )}
            </div>
            

            {/* Sepet Butonu */}
            <button
              onClick={() => setShowCart(true)}
              className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              aria-label="Sepeti aç"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobil Menü Butonu */}
            <button
              onClick={() => setMenuOpen(true)}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 md:hidden"
              aria-label="Menüyü aç"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBİL MENÜ (Soldan Kayan) --- */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 transform bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <span className="text-lg font-bold text-gray-800">Menü</span>
          <button onClick={closeModals} className="rounded-full p-2 text-gray-600 hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>
        <div className="flex h-[calc(100%-4rem)] flex-col justify-between p-4">
          <div className="flex flex-col gap-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </button>
            </form>
            <nav className="flex flex-col gap-2">
              <Link to="/" onClick={closeModals} className="rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                Ana Sayfa
              </Link>
              <Link to="/products" onClick={closeModals} className="rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                Ürünler
              </Link>
            </nav>
          </div>
          <div className="border-t border-gray-200 pt-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-100 py-3 text-base font-medium text-red-700 hover:bg-red-200"
              >
                <LogOut size={18} /> Çıkış Yap
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-100 py-3 text-base font-medium text-blue-700 hover:bg-blue-200"
              >
                <LogIn size={18} /> Giriş Yap
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- SEPET (Sağdan Kayan Drawer) --- */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md transform bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          showCart ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 px-4 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Sepetim ({cartCount})</h2>
            <button onClick={closeModals} className="rounded-full p-2 text-gray-600 hover:bg-gray-100">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:px-6">
            {cartItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingCart size={48} className="text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">Sepetiniz boş</h3>
                <p className="mt-1 text-sm text-gray-500">Hemen alışverişe başlayın!</p>
                <button
                  onClick={closeModals}
                  className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Alışverişe Başla
                </button>
              </div>
            ) : (
              <ul role="list" className="-my-6 divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link to={`/products/${item.id}`} onClick={closeModals}>
                              {item.title}
                            </Link>
                          </h3>
                          <p className="ml-4">{item.price} ₺</p>
                        </div>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center rounded border border-gray-300">
                          <button
                            onClick={() => dispatch(decreaseQuantity(item.id))}
                            className="px-2 py-1 text-lg text-gray-600 hover:bg-gray-100"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 text-base font-medium">{item.quantity}</span>
                          <button
                            onClick={() => dispatch(increaseQuantity(item.id))}
                            className="px-2 py-1 text-lg text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex">
                          <button
                            type="button"
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="flex items-center gap-1 font-medium text-red-600 hover:text-red-500"
                          >
                            <Trash2 size={16} /> Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Sepet Footer (Doluysa) */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Ara Toplam</p>
                <p>{cartTotal} ₺</p>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleCompleteOrder} // İSTEĞİNİZE GÖRE GÜNCELLENDİ
                  className="w-full rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Siparişi Tamamla
                </button>
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => dispatch(clearCart())}
                  className="text-sm font-medium text-gray-600 hover:text-gray-500"
                >
                  Sepeti Temizle
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}