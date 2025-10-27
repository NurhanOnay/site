import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom"; // Link eklendi
import { addToCart } from "../cart/cartSlice";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "./productsApi"; // API hook'ları (doğru yolu kontrol edin '.js' olmalı)
import ProductCard from "./ProductCard";
import Spinner from "../../components/Spinner";
import Swal from "sweetalert2";
import { Plus, Filter, X, Trash2, Zap, Truck, Percent, Star, ChevronsDown } from "lucide-react";

// Stil sabitleri (Tailwind sınıfları - isteğe bağlı)
const filterLabelStyle = "block text-sm font-medium text-gray-700 mb-1";
const selectInputStyle = "mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-9 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm shadow-sm";
const priceInputStyle = "block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm";

const ITEMS_PER_PAGE = 12; // Başlangıçta ve her yüklemede kaç ürün gösterilecek

export default function ProductsPage() {
  // --- State'ler ---
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [showFilters, setShowFilters] = useState(false); // Mobil filtre görünürlüğü
  const [itemsToShow, setItemsToShow] = useState(ITEMS_PER_PAGE); // Gösterilecek ürün sayısı

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- RTK Query Hook'ları ---
  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useGetProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // --- Veri İşleme (Memoized) ---
  const products = useMemo(() => productsData?.products || [], [productsData]);
  const categories = useMemo(() => ["all", ...new Set(products.map((p) => p.category))], [products]);
  const brands = useMemo(() => ["all", ...new Set(products.map((p) => p.brand))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
      const minPriceMatch = minPrice === '' || product.price >= parseFloat(minPrice || 0);
      const maxPriceMatch = maxPrice === '' || product.price <= parseFloat(maxPrice || Infinity);
      const brandMatch = selectedBrand === 'all' || product.brand === selectedBrand;
      return categoryMatch && minPriceMatch && maxPriceMatch && brandMatch;
    });
  }, [products, selectedCategory, minPrice, maxPrice, selectedBrand]);

  // Gösterilecek ürünleri belirle
  const productsToShow = useMemo(() => {
      return filteredProducts.slice(0, itemsToShow);
  }, [filteredProducts, itemsToShow]);


  // --- Rol & Login Kontrolü ---
  const role = localStorage.getItem("role") || "user";
  const isLoggedIn = () => localStorage.getItem("isLoggedIn") === "true";

  const requireLogin = () => {
    if (!isLoggedIn()) {
      Swal.fire({
        icon: "warning", title: "Giriş Yapmalısınız",
        text: "Sepete eklemek için giriş yapmanız gerekli.",
        confirmButtonText: "Giriş Yap", showCancelButton: true, cancelButtonText: "İptal",
      }).then((result) => { if (result.isConfirmed) navigate("/login"); });
      return false;
    }
    return true;
  };

  const handleAddToCart = (product) => {
    if (!requireLogin()) return;
    dispatch(addToCart({ ...product, quantity: 1 }));
    Swal.fire({ icon: "success", title: "Sepete Eklendi!", text: `${product.title} sepete eklendi.`, timer: 1200, showConfirmButton: false });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Emin misiniz?", text: "Bu ürünü kalıcı olarak sileceksiniz!", icon: "warning",
      showCancelButton: true, confirmButtonText: "Evet, Sil", cancelButtonText: "İptal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduct(id).unwrap();
          Swal.fire("Silindi!", "Ürün başarıyla silindi.", "success");
        } catch (err) {
          Swal.fire("Hata!", "Ürün silinirken bir hata oluştu.", "error");
          console.error("Silme Hatası:", err);
        }
      }
    });
  };

  const clearFilters = () => {
    setItemsToShow(ITEMS_PER_PAGE); // Gösterilen ürün sayısını sıfırla
    setSelectedCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrand('all');
    setShowFilters(false);
  };

  // "Daha Fazla Yükle" fonksiyonu
  const loadMore = () => {
      setItemsToShow(prev => prev + ITEMS_PER_PAGE);
  };

  // --- Yükleniyor & Hata Durumları ---
  if (isLoading) return <Spinner />;
  if (isError) return <div className="p-8 text-center text-red-600">Hata: {error?.message || "Veriler yüklenemedi"}</div>;

  // --- Tekrar Kullanılabilir Filtre JSX Fonksiyonu ---
  const renderFilters = (isMobile = false) => (
    <div className={`space-y-6 ${isMobile ? 'p-4' : ''}`}>
       {isMobile && <h3 className="text-lg font-semibold text-gray-900 border-b pb-3 mb-4">Filtreler</h3>}
       {/* Kategori */}
       <div className="border-b border-gray-200 pb-6">
         <label htmlFor={`category-${isMobile ? 'mobile' : 'desktop'}`} className={filterLabelStyle}>Kategori</label>
         <select
             id={`category-${isMobile ? 'mobile' : 'desktop'}`}
             value={selectedCategory}
             onChange={(e) => setSelectedCategory(e.target.value)}
             className={selectInputStyle}
         >
           {categories.map((cat) => ( <option key={cat} value={cat}>{cat === 'all' ? 'Tümü' : cat.charAt(0).toUpperCase() + cat.slice(1)}</option>))}
         </select>
       </div>
       {/* Marka */}
       <div className="border-b border-gray-200 pb-6">
         <label htmlFor={`brand-${isMobile ? 'mobile' : 'desktop'}`} className={filterLabelStyle}>Marka</label>
         <select
             id={`brand-${isMobile ? 'mobile' : 'desktop'}`}
             value={selectedBrand}
             onChange={(e) => setSelectedBrand(e.target.value)}
             className={selectInputStyle}
         >
           {brands.map((brand) => ( <option key={brand} value={brand}>{brand === 'all' ? 'Tümü' : brand}</option> ))}
         </select>
       </div>
       {/* Fiyat (Dikey) */}
       <div className="border-b border-gray-200 pb-6 space-y-3">
          <label className={filterLabelStyle}>Fiyat Aralığı (₺)</label>
          <div>
             <label htmlFor={`minPrice-${isMobile ? 'mobile' : 'desktop'}`} className="sr-only">Min Fiyat</label>
             <input
                 type="number"
                 id={`minPrice-${isMobile ? 'mobile' : 'desktop'}`}
                 value={minPrice}
                 onChange={(e) => setMinPrice(e.target.value)}
                 min="0"
                 placeholder="Min Fiyat"
                 className={priceInputStyle}
             />
          </div>
          <div>
             <label htmlFor={`maxPrice-${isMobile ? 'mobile' : 'desktop'}`} className="sr-only">Max Fiyat</label>
             <input
                 type="number"
                 id={`maxPrice-${isMobile ? 'mobile' : 'desktop'}`}
                 value={maxPrice}
                 onChange={(e) => setMaxPrice(e.target.value)}
                 min="0"
                 placeholder="Max Fiyat"
                 className={priceInputStyle}
             />
          </div>
       </div>
       {/* Temizle Butonu */}
       <button
           onClick={clearFilters}
           className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-red-600"
       >
          <Trash2 size={16} /> Filtreleri Temizle
       </button>
       {/* Mobil Uygula Butonu */}
       {isMobile && (
         <button
             onClick={() => setShowFilters(false)}
             className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-purple-600 py-2 px-3 text-sm font-medium text-white shadow-sm hover:bg-purple-700"
         >
             Filtreleri Uygula
         </button>
       )}
    </div>
  );

  // --- ANA JSX ---
  return (
    // Ana container hala tam genişlikte, sadece yan padding'leri var
    <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8">

      {/* --- KÜÇÜK, YUVARLAK VE MOBİLDE YAN YANA PROMOSYON ALANI --- */}
      <div className="mb-8 grid grid-cols-4 gap-2 md:gap-4"> {/* Mobil için grid-cols-4 */}
        {/* Öğe 1: İndirim */}
        <Link to="/kampanyalar/indirim" className="group flex flex-col items-center rounded-lg bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 p-3 text-center shadow-sm transition hover:shadow-md hover:scale-105">
          <div className="mb-1 rounded-full bg-purple-600 p-2 text-white shadow"> {/* p-2, mb-1 */}
            <Percent size={20} /> {/* size=20 */}
          </div>
          <h4 className="text-xs font-semibold text-purple-800">İndirimler</h4>
          <p className="text-[11px] text-purple-600">Fırsatlar</p> {/* text-[11px] */}
        </Link>
        {/* Öğe 2: Yeni Gelenler */}
        <Link to="/yeni-gelenler" className="group flex flex-col items-center rounded-lg bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 p-3 text-center shadow-sm transition hover:shadow-md hover:scale-105">
          <div className="mb-1 rounded-full bg-pink-600 p-2 text-white shadow">
            <Zap size={20} />
          </div>
          <h4 className="text-xs font-semibold text-pink-800">Yeni Sezon</h4>
          <p className="text-[11px] text-pink-600">Keşfet</p>
        </Link>
        {/* Öğe 3: Ücretsiz Kargo */}
        <Link to="/kargo-bilgisi" className="group flex flex-col items-center rounded-lg bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-3 text-center shadow-sm transition hover:shadow-md hover:scale-105">
          <div className="mb-1 rounded-full bg-amber-600 p-2 text-white shadow">
            <Truck size={20} />
          </div>
          <h4 className="text-xs font-semibold text-amber-800">Ücretsiz Kargo</h4>
          <p className="text-[11px] text-amber-600">100 TL+</p>
        </Link>
        {/* Öğe 4: Çok Satanlar */}
        <Link to="/cok-satanlar" className="group flex flex-col items-center rounded-lg bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 p-3 text-center shadow-sm transition hover:shadow-md hover:scale-105">
          <div className="mb-1 rounded-full bg-teal-600 p-2 text-white shadow">
            <Star size={20} />
          </div>
          <h4 className="text-xs font-semibold text-teal-800">Çok Satanlar</h4>
          <p className="text-[11px] text-teal-600">Popüler</p>
        </Link>
      </div>
      {/* --- PROMOSYON ALANI SONU --- */}


      {/* --- İç Container (max-w-7xl) --- */}
      <div className="mx-auto max-w-7xl">
         {/* --- Mobil Filtre Butonu & Admin Ekle Butonu --- */}
         <div className="mb-6 flex flex-wrap items-center justify-end gap-4 border-b border-gray-200 pb-4">
           {role === "admin" && (
               <button
                   onClick={() => navigate("/add-product")}
                   className="flex items-center gap-2 rounded-md bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700"
               >
                 <Plus size={18} /> Yeni Ekle
               </button>
             )}
           {/* Mobil Filtre Butonu */}
           <button
             onClick={() => setShowFilters(!showFilters)}
             className="flex items-center gap-2 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 md:hidden"
           >
             {showFilters ? <X size={18} /> : <Filter size={18} />} Filtrele
           </button>
         </div>

         {/* --- Ana İçerik Alanı: Grid (Sidebar + Ürünler) --- */}
         <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5"> {/* 5 sütun */}

           {/* --- 1. SOL KENAR ÇUBUĞU (Filtreler - lg:col-span-1) --- */}
           <aside className="hidden lg:block lg:col-span-1">
             <div className="sticky top-20 rounded-lg bg-gradient-to-b from-violet-50 to-pink-50 p-6 shadow-md border border-purple-100">
               <h2 className="mb-6 text-xl font-semibold text-purple-700 border-b border-purple-200 pb-3">
                 Filtrele & Sırala
               </h2>
               {renderFilters(false)} {/* Masaüstü filtrelerini render et */}
             </div>
           </aside>

           {/* --- 2. SAĞ TARAF (Ürün Grid'i - lg:col-span-4) --- */}
           <div className="lg:col-span-4"> {/* 4 sütun kaplayacak */}

             {/* --- Mobil Filtreler Panel --- */}
             <div className={`mb-6 lg:hidden ${showFilters ? 'block' : 'hidden'}`}>
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    {renderFilters(true)} {/* Mobil filtrelerini render et */}
                </div>
             </div>

             {/* --- ÜRÜN IZGARASI (4 SÜTUNLU - xl:grid-cols-4) --- */}
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
               {productsToShow.length > 0 ? (
                 productsToShow.map((product) => ( // filteredProducts yerine productsToShow kullanılıyor
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
                 // Ürün bulunamadı mesajı
                 <div className="col-span-full rounded-lg border-2 border-dashed border-gray-300 bg-white py-12 text-center">
                    <Filter size={48} className="mx-auto text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Ürün Bulunamadı</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Seçtiğiniz filtrelere uygun ürün yok. Filtreleri temizlemeyi deneyin.
                    </p>
                 </div>
               )}
             </div>

             {/* --- "DAHA FAZLA YÜKLE" BUTONU --- */}
             {filteredProducts.length > itemsToShow && ( // Eğer gösterilecek daha fazla ürün varsa
                <div className="mt-10 text-center">
                    <button
                        onClick={loadMore}
                        className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
                    >
                        <ChevronsDown size={18} /> Daha Fazla Göster ({filteredProducts.length - itemsToShow} ürün daha)
                    </button>
                </div>
             )}

           </div> {/* Sağ Taraf Kapanışı */}
         </div> {/* Ana Grid Kapanışı */}
      </div> {/* İç Container Kapanışı */}
    </div> // Ana Sayfa Container Kapanışı
  );
}