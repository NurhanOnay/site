import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useAddProductMutation,
  useUpdateProductMutation,
  useGetProductByIdQuery,
} from './productsApi.jsx'; // Gerekli tüm RTK Query hook'ları
import Spinner from '../../components/Spinner'; // Yükleniyor ikonu
import Swal from 'sweetalert2';

// Başlangıç için boş form state'i
const initialState = {
  title: '',
  price: '',
  category: '',
  description: '',
  thumbnail: '',
};

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // URL'den :id parametresini alır
  const isEditMode = Boolean(id); // ID varsa, bu bir 'Güncelleme' modudur

  const [formState, setFormState] = useState(initialState);

  // --- RTK Query Hook'ları ---

  // 1. GÜNCELLEME MODU: Mevcut ürün verisini çeker
  const {
    data: existingProduct,
    isLoading: isFetching,
    isError: isFetchError,
  } = useGetProductByIdQuery(id, {
    skip: !isEditMode, // 'Ekleme' modundaysa (ID yoksa) bu sorguyu atla
  });

  // 2. EKLEME MODU: Yeni ürün ekleme fonksiyonu
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();

  // 3. GÜNCELLEME MODU: Ürün güncelleme fonksiyonu
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // --- Effect'ler ---

  // Güncelleme modundaysa ve veri başarıyla çekildiyse, formu doldur
  useEffect(() => {
    if (isEditMode && existingProduct) {
      setFormState(existingProduct);
    }
  }, [isEditMode, existingProduct]);

  // --- Fonksiyonlar ---

  // Formdaki herhangi bir input değiştiğinde state'i günceller
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form gönderildiğinde (Kaydet/Ekle butonu)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isLoading = isAdding || isUpdating;
    if (isLoading) return; // Buton zaten kilitli ama ekstra kontrol

    try {
      if (isEditMode) {
        // GÜNCELLEME MODU
        await updateProduct({ id, ...formState }).unwrap();
        Swal.fire('Güncellendi!', 'Ürün başarıyla güncellendi.', 'success');
      } else {
        // EKLEME MODU
        await addProduct(formState).unwrap();
        Swal.fire('Eklendi!', 'Yeni ürün başarıyla eklendi.', 'success');
      }
      navigate('/products'); // Başarılıysa ürünler sayfasına dön
    } catch (err) {
      Swal.fire('Hata!', 'İşlem sırasında bir hata oluştu.', 'error');
      console.error(err);
    }
  };

  // --- Render ---

  // Güncelleme modu için veri çekiliyorsa...
  if (isFetching) {
    return <Spinner />;
  }

  // Veri çekme hatası (güncelleme modunda)
  if (isFetchError) {
    return <div className="p-8 text-center text-red-600">Ürün verisi yüklenemedi.</div>;
  }

  const isLoading = isAdding || isUpdating;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg bg-white p-6 shadow-lg sm:p-8">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">
          {isEditMode ? 'Ürünü Güncelle' : 'Yeni Ürün Ekle'}
        </h2>

        {/* Tailwind ile stillendirilmiş form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Ürün Adı
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formState.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Fiyat (₺)
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={formState.price}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Kategori
              </label>
              <input
                type="text"
                name="category"
                id="category"
                value={formState.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
              Resim URL
            </label>
            <input
              type="text"
              name="thumbnail"
              id="thumbnail"
              value={formState.thumbnail}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Açıklama
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              value={formState.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {/* Form Butonları */}
          <div className="flex justify-end gap-4 border-t pt-4">
            <button
              type="button" // Submit olmasını engelle
              onClick={() => navigate('/products')}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading
                ? (isEditMode ? 'Kaydediliyor...' : 'Ekleniyor...')
                : (isEditMode ? 'Güncelle' : 'Ekle')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}