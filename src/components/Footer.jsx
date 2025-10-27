import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // mt-auto: Footer'ı Layout içinde en alta iter
    // py-6: Dikey padding azaltıldı (önceki py-8 idi)
    <footer className="mt-auto bg-gradient-to-r from-violet-50 to-pink-50 border-t border-purple-100 shadow-inner">
      {/* max-w-7xl: İçeriği ortalar, px: Yan boşluklar */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {/* Logo & Açıklama */}
          <div className="text-center md:text-left">
            <Link to="/" className="inline-flex items-center gap-2">
              <img className="h-7 w-auto" src="/images/elogo.png" alt="NexBuy" /> {/* Logo boyutu biraz küçültüldü */}
              <span className="text-lg font-bold text-gray-800">NexBuy</span> {/* Font boyutu biraz küçültüldü */}
            </Link>
            <p className="mt-1 text-xs text-gray-500"> {/* mt azaltıldı, text küçültüldü */}
              Kaliteli ürünler, uygun fiyatlar.
            </p>
          </div>

          {/* Hızlı Linkler */}
          <nav className="text-center">
            <p className="font-semibold text-gray-700 text-sm">Hızlı Linkler</p> {/* Font boyutu küçültüldü */}
            {/* mt ve space-y azaltıldı, text küçültüldü */}
            <ul className="mt-1 space-y-0.5 text-xs">
              <li><Link to="/about" className="text-gray-500 hover:text-purple-600">Hakkımızda</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-purple-600">İletişim</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-purple-600">Gizlilik Politikası</Link></li>
            </ul>
          </nav>

          {/* Sosyal Medya */}
          <nav className="text-center md:text-right">
             <p className="font-semibold text-gray-700 text-sm">Bizi Takip Edin</p> {/* Font boyutu küçültüldü */}
             <p className="mt-1 text-xs text-gray-500"> {/* mt azaltıldı, text küçültüldü */}
                Yakında...
             </p>
          </nav>
        </div>

        {/* Alt Kısım */}
        {/* mt ve pt azaltıldı */}
        <div className="mt-6 border-t border-purple-200 pt-3 text-center text-xs text-gray-400">
          &copy; {currentYear} NexBuy. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}