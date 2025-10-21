import React from "react";

export default function ProductCard({ product, onClick, onEdit, onDelete, onAddToCart }) {
  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
      onClick={() => onClick && onClick(product)} // opsiyonel modal açma
    >
      <img
        src={product.thumbnail || product.image}
        alt={product.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{product.title}</h2>
        <p className="text-indigo-600 font-bold mt-1">{product.price} ₺</p>

        {/* Sepete Ekle Butonu */}
        {onAddToCart && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // modal tetiklemeyi engeller
              onAddToCart(product);
            }}
            className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sepete Ekle
          </button>
        )}

        {/* Düzenle / Sil Butonları */}
        <div className="flex justify-between mt-4">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
              }}
              className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-500 transition"
            >
              Düzenle
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product.id);
              }}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
            >
              Sil
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
