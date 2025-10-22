import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../cart/cartSlice";

// HATA BURADA: Bu 'import' satırı sizde muhtemelen eksik
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "./productsApi"; // <-- BU SATIR ÇOK ÖNEMLİ

import ProductCard from "./ProductCard";
import Spinner from "../../components/Spinner";
import Swal from "sweetalert2";
import { Plus } from "lucide-react";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. VERİ ÇEKME (RTK Query)
  // Bu satır, yukarıdaki import olmadan çalışmaz ve hataya neden olur
  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useGetProductsQuery();
  
  // 2. SİLME MUTASYONU (RTK Query)
  // Bu satır da, yukarıdaki import olmadan çalışmaz
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // 3. ROL KONTROLÜ
  const role = localStorage.getItem("role") || "user";
  const isLoggedIn = () => localStorage.getItem("isLoggedIn") === "true";

  const requireLogin = () => {
    if (!isLoggedIn()) {
      Swal.fire({
        icon: "warning",
        title: "Giriş Yapmalısınız",
        text: "Sepete eklemek için giriş yapmanız gerekli.",
        confirmButtonText: "Giriş Yap",
        showCancelButton: true,
        cancelButtonText: "İptal",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
      return false;
    }
    return true;
  };

  const handleAddToCart = (product) => {
    if (!requireLogin()) return;
    dispatch(addToCart({ ...product, quantity: 1 }));
    Swal.fire({
      icon: "success",
      title: "Sepete Eklendi!",
      text: `${product.title} sepete eklendi.`,
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Emin misiniz?",
      text: "Bu ürünü kalıcı olarak sileceksiniz!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Evet, Sil",
      cancelButtonText: "İptal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduct(id).unwrap(); // API'den sil
          Swal.fire("Silindi!", "Ürün başarıyla silindi.", "success");
        } catch (err) {
          Swal.fire("Hata!", "Ürün silinirken bir hata oluştu.", "error");
        }
      }
    });
  };

  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <div className="p-8 text-center text-red-600">Hata: {error.message}</div>;
  }

  const products = productsData?.products || [];

  const categories = ["all", ...new Set(products.map((p) => p.category))];
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Ürünler
        </h1>
        {role === "admin" && (
          <button
            onClick={() => navigate("/add-product")}
            className="flex items-center gap-2 rounded-md bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700"
          >
            <Plus size={18} /> Yeni Ürün Ekle
          </button>
        )}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full py-2 px-4 text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 shadow-sm hover:bg-gray-100"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              role={role}
              onAddToCart={handleAddToCart}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            Bu kategoride ürün bulunamadı.
          </p>
        )}
      </div>
    </div>
  );
}