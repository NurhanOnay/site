import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // <Link> eklendi
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../store/cartSlice";
import { Menu, X, ShoppingCart, Search, LogOut } from "lucide-react";
import "../styles/Header.css"; // Bu CSS dosyasını aşağıda vereceğim

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Sayfa kaydırma (scroll) efekti
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // Sadece 100px'ten fazla aşağı kaydırınca gizle
        setHideHeader(true);
      } else {
        setHideHeader(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Menü veya Sepet açıkken sayfanın kaymasını engelle
  useEffect(() => {
    if (menuOpen || showCart) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Component unmount olduğunda overflow'u resetle
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen, showCart]);


  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    dispatch(clearCart());
    setMenuOpen(false); // Menüyü kapat
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`); // Arama sayfasına yönlendir
      setSearchQuery("");
    }
  };

  const closeModals = () => {
    setMenuOpen(false);
    setShowCart(false);
  };

  return (
    <>
      {/* Overlay: Menü veya sepet açıkken arka planı kaplar */}
      {(menuOpen || showCart) && (
        <div className="overlay" onClick={closeModals}></div>
      )}

      <header className={`modern-header ${hideHeader ? "hide" : ""}`}>
        <div className="header-container">
          {/* Logo */}
          <div className="logo-area">
            <Link to="/products" className="logo-link" onClick={closeModals}>
              <img src="/images/elogo.png" alt="NexBuy" className="logo" />
              <span className="brand-name">NexBuy</span>
            </Link>
          </div>

          {/* Navigation (Desktop) - Navigasyon için <Link> kullanıldı */}
          <nav className="nav-links-desktop">
            <Link to="/">Ana Sayfa</Link>
            <Link to="/products">Ürünler</Link>
            <Link to="/about">Hakkımızda</Link>
            <Link to="/contact">İletişim</Link>
          </nav>

          {/* Actions */}
          <div className="actions">
            {/* Search */}
            <form className="search-box" onSubmit={handleSearchSubmit}>
              <button type="submit" className="search-btn">
                <Search size={18} />
              </button>
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Cart */}
            <button
              className="action-btn cart-btn"
              onClick={() => setShowCart(true)} // Tıklayınca aç, overlay kapatır
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* Hamburger (Mobile) */}
            <button
              className="action-btn hamburger"
              onClick={() => setMenuOpen(true)} // Tıklayınca aç
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu (Slide-in) */}
      <nav className={`nav-links-mobile ${menuOpen ? "active" : ""}`}>
        <button className="close-btn" onClick={() => setMenuOpen(false)}>
          <X size={26} />
        </button>
        <Link to="/" onClick={closeModals}>Ana Sayfa</Link>
        <Link to="/products" onClick={closeModals}>Ürünler</Link>
        <Link to="/about" onClick={closeModals}>Hakkımızda</Link>
        <Link to="/contact" onClick={closeModals}>İletişim</Link>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Çıkış
        </button>
      </nav>

      {/* Cart Drawer (Slide-in) */}
      <div className={`cart-drawer ${showCart ? "active" : ""}`}>
        <div className="cart-header">
          <h3>Sepetim ({cartCount})</h3>
          <button className="close-btn" onClick={() => setShowCart(false)}>
            <X size={26} />
          </button>
        </div>
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <ShoppingCart size={50} />
              <p>Sepetiniz şu anda boş 🛒</p>
              <button onClick={closeModals} className="start-shopping-btn">
                Alışverişe Başla
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.thumbnail} alt={item.title} />
                    <div className="cart-info">
                      <p className="title">{item.title}</p>
                      <p className="price">{item.price}₺</p>
                      <div className="controls">
                        <div className="quantity-control">
                          <button onClick={() => dispatch(decreaseQuantity(item.id))}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
                        </div>
                        <button className="remove-btn" onClick={() => dispatch(removeFromCart(item.id))}>
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-footer">
                <button className="checkout-btn" onClick={() => {
                  navigate('/checkout'); // Ödeme sayfasına yönlendir
                  closeModals();
                }}>
                  Ödemeye Git
                </button>
                <button className="clear-cart-btn" onClick={() => dispatch(clearCart())}>
                  Sepeti Temizle
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}