import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetProductsQuery, useDeleteProductMutation } from '../../products/productsApi'; // productsApi.js yolunu doğrulayın
import Spinner from '../../../components/Spinner';
import Swal from 'sweetalert2';
import { Plus, Edit, Trash2, Search, ArrowUpDown } from 'lucide-react'; // İkonlar

// Basit Sıralama ve Arama için Helper
const sortData = (data, key, direction) => {
  return [...data].sort((a, b) => {
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

const filterData = (data, query) => {
   if (!query) return data;
   return data.filter(item =>
     item.title.toLowerCase().includes(query.toLowerCase()) ||
     item.category.toLowerCase().includes(query.toLowerCase()) ||
     item.brand.toLowerCase().includes(query.toLowerCase())
   );
};

export default function AdminProductsPage() {
  const navigate = useNavigate();
  
  // --- State'ler ---
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' }); // Varsayılan sıralama

  // --- RTK Query ---
  const { data: productsData, isLoading, isError, error } = useGetProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // --- Veri İşleme ---
  const products = useMemo(() => productsData?.products || [], [productsData]);

  // Filtrelenmiş ve Sıralanmış Veri
  const processedProducts = useMemo(() => {
     let filtered = filterData(products, searchTerm);
     return sortData(filtered, sortConfig.key, sortConfig.direction);
  }, [products, searchTerm, sortConfig]);

  // --- Fonksiyonlar ---
  const handleDelete = (id, title) => { // Başlık eklendi (Swal için)
    Swal.fire({
      title: `${title} ürününü silmek istediğinize emin misiniz?`,
      text: "Bu işlem geri alınamaz!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#d33', // Kırmızı
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Evet, Sil!",
      cancelButtonText: "İptal"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduct(id).unwrap();
          Swal.fire("Silindi!", `${title} ürünü başarıyla silindi.`, "success");
        } catch (err) {
          Swal.fire("Hata!", "Ürün silinirken bir hata oluştu.", "error");
          console.error("Silme Hatası:", err);
        }
      }
    });
  };

  // Sıralama Fonksiyonu
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sıralama İkonu Helper
  const getSortIcon = (key) => {
     if (sortConfig.key !== key) return <ArrowUpDown size={14} className="ml-1 opacity-30"/>;
     return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };


  // --- Yükleniyor & Hata ---
  if (isLoading) return <Spinner />;
  if (isError) return <div className="p-6 text-center text-red-600">Hata: {error?.message || "Veriler yüklenemedi"}</div>;

  // --- JSX ---
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Ürün Yönetimi</h1>
        <Link
            to="/add-product"
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 transition"
        >
          <Plus size={18} /> Yeni Ürün Ekle
        </Link>
      </div>

      {/* Arama Çubuğu */}
      <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
              type="text"
              placeholder="Ürün adı, kategori veya markaya göre ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
          />
      </div>


      {/* Ürün Tablosu */}
      <div className="overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Sıralanabilir Başlıklar */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    <button onClick={() => requestSort('id')} className="flex items-center">ID{getSortIcon('id')}</button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Görsel</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                   <button onClick={() => requestSort('title')} className="flex items-center">Başlık{getSortIcon('title')}</button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                   <button onClick={() => requestSort('category')} className="flex items-center">Kategori{getSortIcon('category')}</button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                   <button onClick={() => requestSort('brand')} className="flex items-center">Marka{getSortIcon('brand')}</button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                   <button onClick={() => requestSort('price')} className="flex items-center">Fiyat (₺){getSortIcon('price')}</button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                   <button onClick={() => requestSort('stock')} className="flex items-center">Stok{getSortIcon('stock')}</button>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Eylemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {processedProducts.length > 0 ? (
                 processedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <img src={product.thumbnail} alt={product.title} className="h-10 w-10 rounded-md object-cover"/>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate">{product.title}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <Link
                              to={`/update-product/${product.id}`}
                              className="text-yellow-600 hover:text-yellow-900 inline-flex items-center gap-1 p-1 rounded hover:bg-yellow-100"
                              title="Düzenle"
                          >
                             <Edit size={16} /> <span className="sr-only">Düzenle</span>
                          </Link>
                          <button
                              onClick={() => handleDelete(product.id, product.title)}
                              disabled={isDeleting}
                              className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 p-1 rounded hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Sil"
                          >
                             <Trash2 size={16} /> <span className="sr-only">Sil</span>
                          </button>
                       </td>
                    </tr>
                 ))
              ) : (
                 <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-sm text-gray-500">
                       Arama kriterlerine uygun ürün bulunamadı.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* İsteğe Bağlı: Sayfalama (Pagination) buraya eklenebilir */}
    </div>
  );
}