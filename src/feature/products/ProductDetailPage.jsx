import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addToCart } from "../cart/cartSlice"; // Doğru 'feature' yolu
import { useGetProductByIdQuery } from "./productsApi.jsx"; // RTK Query hook'u
import Spinner from "../../components/Spinner"; // Yükleniyor ikonu
import Swal from "sweetalert2";
import { ShoppingCart, Star, AlertTriangle, CheckCircle } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams(); // URL'den ID'yi al
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- RTK Query ile Veri Çekme ---
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetProductByIdQuery(id); // 'id'yi ver, veriyi al

  // Rol ve Giriş Durumu
  const role = localStorage.getItem("role") || "user";
  const isLoggedIn = () => localStorage.getItem("isLoggedIn") === "true";

  // Thumbnail galerisi için state
  const [mainImage, setMainImage] = useState("");

  // Ürün verisi geldiğinde, ana resmi ayarla
  useEffect(() => {
    if (product) {
      setMainImage(product.thumbnail);
    }
  }, [product]);

  // --- Fonksiyonlar ---
  const requireLogin = () => { // <-- HATA BURADAYDI, DÜZELTİLDİ
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

  const handleAddToCart = () => {
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

  // --- Render Durumları ---
  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-red-600">
        <AlertTriangle size={48} className="mb-4" />
        <h2 className="text-xl font-semibold">Hata Oluştu</h2>
        <p>{error?.message || "Ürün yüklenirken bir sorun oluştu."}</p>
      </div>
    );
  }
  if (!product) {
    return <div className="p-8 text-center text-gray-500">Ürün bulunamadı.</div>;
  }

  return (
    // Tailwind ile ana container
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        
        {/* Üst Kısım: Resimler ve Ana Bilgiler */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          
          {/* 1. Görsel Alanı */}
          <div>
            <img
              src={mainImage}
              alt={product.title}
              className="h-auto w-full max-w-full rounded-lg object-contain shadow-md"
              style={{ maxHeight: "500px" }}
            />
            {/* Küçük Resim Galerisi */}
            <div className="mt-4 flex flex-wrap gap-2">
              {product.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.title}-${idx}`}
                  onClick={() => setMainImage(img)}
                  className={`h-20 w-20 cursor-pointer rounded-md border-2 object-cover ${
                    mainImage === img ? "border-blue-500" : "border-gray-200"
                  } hover:border-blue-400`}
                />
              ))}
            </div>
          </div>

          {/* 2. Ürün Bilgi Alanı */}
          <div className="flex flex-col">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
              {product.title}
            </h1>
            <span className="mb-4 text-sm font-medium capitalize text-gray-500">
              {product.brand} - {product.category}
            </span>
            <p className="mb-4 text-lg text-gray-700">{product.description}</p>
            
            <div className="mb-4 flex items-center gap-2">
              <Star size={20} className="fill-yellow-400 text-yellow-500" />
              <span className="text-xl font-bold text-gray-800">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviews?.length || 0} yorum)</span>
            </div>

            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-blue-600">{product.price} ₺</span>
              <span className="text-lg text-gray-500 line-through">
                {(product.price * (1 + product.discountPercentage / 100)).toFixed(2)} ₺
              </span>
            </div>

            <div className="mb-6 flex items-center gap-2">
              {product.stock > 0 ? (
                <CheckCircle size={20} className="text-green-500" />
              ) : (
                <AlertTriangle size={20} className="text-red-500" />
              )}
              <span className="text-base font-medium text-gray-700">
                {product.stock > 0 ? `${product.stock} adet stokta` : "Stokta Yok"}
              </span>
            </div>

            {/* ROL BAZLI SEPETE EKLEME BUTONU */}
            {(role === 'user' || role === 'moderator') && (
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <ShoppingCart size={20} /> Sepete Ekle
              </button>
            )}
          </div>
        </div>

        {/* Alt Kısım: Detaylar ve Yorumlar */}
        <div className="mt-12 border-t pt-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            
            {/* Lojistik Bilgileri */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Lojistik Bilgileri
              </h2>
              <dl className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex justify-between py-2">
                  <dt className="text-sm font-medium text-gray-600">Garanti</dt>
                  <dd className="text-sm text-gray-900">{product.warrantyInformation}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-sm font-medium text-gray-600">Kargo</dt>
                  <dd className="text-sm text-gray-900">{product.shippingInformation}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-sm font-medium text-gray-600">İade Politikası</dt>
                  <dd className="text-sm text-gray-900">{product.returnPolicy}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-sm font-medium text-gray-600">Min. Sipariş</dt>
                  <dd className="text-sm text-gray-900">{product.minimumOrderQuantity}</dd>
                </div>
              </dl>
            </div>

            {/* Yorumlar */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Kullanıcı Yorumları ({product.reviews?.length || 0})
              </h2>
              <div className="max-h-96 space-y-4 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
                {product.reviews?.length > 0 ? (
                  product.reviews.map((r, i) => (
                    <div key={i} className="rounded-md bg-white p-4 shadow">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800">{r.reviewerName}</span>
                        <div className="flex items-center gap-1">
                          <Star size={16} className="fill-yellow-400 text-yellow-500" />
                          <span className="font-medium">{r.rating}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-600">{r.comment}</p>
                      <small className="mt-2 block text-right text-xs text-gray-400">
                        {new Date(r.date).toLocaleString()}
                      </small>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-center text-gray-500">Bu ürün için henüz yorum yok.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}