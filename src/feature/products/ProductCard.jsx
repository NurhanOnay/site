import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Edit, Trash2, Star } from 'lucide-react';

// ProductsPage'den 'role', 'onAddToCart', 'onDelete' gibi propları alır
export default function ProductCard({ product, role, onAddToCart, onDelete, isDeleting }) {

  // Karttaki butonları role göre belirler
  const renderCardButtons = () => {
    switch (role) {
      // ADMIN: Güncelleme ve Silme butonlarını görür
      case 'admin':
        return (
          <div className="flex gap-2">
            <Link
              to={`/update-product/${product.id}`} // Güncelleme sayfasına yönlendirir
              className="flex flex-1 items-center justify-center gap-1 rounded-md bg-yellow-500 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-600"
            >
              <Edit size={16} /> Güncelle
            </Link>
            <button
              onClick={() => onDelete(product.id)}
              disabled={isDeleting} // Silme işlemi sürerken butonu kilitler
              className="flex flex-1 items-center justify-center gap-1 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 size={16} /> Sil
            </button>
          </div>
        );
      
      // MODERATOR ve USER: Sepete Ekle butonunu görür
      case 'moderator':
      case 'user':
        return (
          <button
            onClick={() => onAddToCart(product)}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <ShoppingCart size={18} /> Sepete Ekle
          </button>
        );

      // Diğer roller (veya misafir) hiçbir buton görmez
      default:
        return <div className="h-10" />; // Kart yüksekliğini korumak için boşluk
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      {/* Ürün Görseli (Detay sayfasına link) */}
      <Link to={`/product/${product.id}`} className="block">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-48 w-full object-cover"
        />
      </Link>

      {/* Ürün Bilgileri */}
      <div className="flex flex-1 flex-col p-4">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="truncate text-lg font-semibold text-gray-900" title={product.title}>
            {product.title}
          </h3>
        </Link>
        <p className="text-sm capitalize text-gray-500">{product.category}</p>
        
        <div className="my-2 flex items-center gap-1">
          <Star size={16} className="fill-yellow-400 text-yellow-500" />
          <span className="text-sm text-gray-700">{product.rating}/5</span>
        </div>

        {/* Fiyat (mt-auto ile en alta iter) */}
        <p className="mt-auto text-xl font-bold text-gray-900">{product.price} ₺</p>

        {/* Role Göre Butonlar */}
        <div className="mt-4">
          {renderCardButtons()}
        </div>
      </div>
    </div>
  );
}