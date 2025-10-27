import React, { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useGetCommentsQuery, useGetProductsQuery } from '../../products/productsApi'; 
import Spinner from '../../../components/Spinner';
import { Search, ArrowUpDown, MessageSquare, User, Star, ThumbsUp, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../auth/authSlice'; 

// --- HELPER FONKSİYONLARI ---
// NOT: Bu fonksiyonlar, AdminCommentsPage'in çalışması için zorunludur.

// Sıralama Helper
const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
        const aValue = a[key] || '';
        const bValue = b[key] || '';

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });
};

// Filtreleme Helper
const filterData = (data, query) => {
    if (!query) return data;
    return data.filter(item =>
        item.body?.toLowerCase().includes(query.toLowerCase()) ||
        item.user?.username?.toLowerCase().includes(query.toLowerCase()) ||
        item.productTitle?.toLowerCase().includes(query.toLowerCase())
    );
};
// --- HELPER FONKSİYONLARININ SONU ---


export default function AdminCommentsPage() {
    // --- Hook'lar ve State'ler ---
    const userRole = useSelector(selectUserRole); 
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });

    // RTK Query - Veri Çekme
    const { data: commentsData, isLoading: commentsLoading, isError: commentsError, error: commentsApiError } = useGetCommentsQuery(); 
    const { data: productsData, isLoading: productsLoading, isError: productsError, error: productsApiError } = useGetProductsQuery(); 

    // Veri İşleme (Güvenli Başlatma)
    const comments = useMemo(() => commentsData?.comments || [], [commentsData]);
    const products = useMemo(() => productsData?.products || [], [productsData]);

    // Yorumları ürün bilgileriyle birleştir
    const enrichedComments = useMemo(() => {
        // Yorumlar veya ürünler henüz gelmediyse boş dizi döndür
        if (comments.length === 0 || products.length === 0) return [];
        
        return comments.map((comment, index) => {
            // Rastgele puan oluştur (1-5 arası)
            const rating = Math.floor((comment.id * 7 + comment.likes) % 5) + 1;
            
            // Yorumları ürünlere rastgele ama tutarlı şekilde dağıtma
            const productIndex = comment.id % products.length;
            const product = products[productIndex];
            
            return {
                ...comment,
                productId: product?.id,
                productTitle: product?.title || 'Ürün Bulunamadı',
                productImage: product?.thumbnail || '/images/elogo.png',
                rating: rating,
            };
        });
    }, [comments, products]);

    // Filtrelenmiş ve Sıralanmış Veri
    const processedComments = useMemo(() => {
        if (enrichedComments.length === 0) return []; 
        
        let filtered = filterData(enrichedComments, searchTerm);
        return sortData(filtered, sortConfig.key, sortConfig.direction);
    }, [enrichedComments, searchTerm, sortConfig]);

    // --- GÜVENLİK VE YÜKLENME KONTROLÜ ---
    if (userRole !== 'admin') { return <Navigate to="/products" replace />; }

    // Yüklenme ve Hata Kontrolü
    if (commentsLoading || productsLoading) return <Spinner />;
    if (commentsError || productsError) return <div className="p-6 text-center text-red-600">Hata: Yorumlar veya ürünler yüklenirken bir sorun oluştu.</div>;
    
    // --- Fonksiyonlar ve Helperlar ---
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <ArrowUpDown size={14} className="ml-1 opacity-30" />;
        return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    };

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                ))}
            </div>
        );
    };


    // --- JSX (Görünüm) ---
    return (
        <div className="space-y-6">
            {/* Başlık ve Toplam Yorum Sayısı */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <MessageSquare className="text-purple-600" size={32} />
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Yorum Yönetimi</h1>
                </div>
                <div className="rounded-lg bg-purple-100 px-4 py-2">
                    <span className="text-sm font-medium text-purple-700">
                        Toplam: {processedComments.length} Yorum
                    </span>
                </div>
            </div>

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="overflow-hidden rounded-xl bg-white p-5 shadow-lg border-l-4 border-blue-600">
                    <dt className="flex items-center text-sm font-medium text-blue-600 truncate">
                        <MessageSquare className="mr-2" size={18} /> Toplam Yorum
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{comments.length}</dd>
                </div>
                <div className="overflow-hidden rounded-xl bg-white p-5 shadow-lg border-l-4 border-green-600">
                    <dt className="flex items-center text-sm font-medium text-green-600 truncate">
                        <Star className="mr-2" size={18} /> Ortalama Puan
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {enrichedComments.length > 0 ? (enrichedComments.reduce((acc, c) => acc + (c.rating || 0), 0) / enrichedComments.length).toFixed(1) : '0.0'}
                    </dd>
                </div>
                <div className="overflow-hidden rounded-xl bg-white p-5 shadow-lg border-l-4 border-pink-600">
                    <dt className="flex items-center text-sm font-medium text-pink-600 truncate">
                        ❤️ Toplam Beğeni
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {comments.reduce((acc, c) => acc + (c.likes || 0), 0)}
                    </dd>
                </div>
            </div>


            {/* Arama Çubuğu */}
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    type="text"
                    placeholder="Yorum içeriği, kullanıcı veya ürün adına göre ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                />
            </div>

            {/* --- YORUM KARTLARI LİSTESİ --- */}
            <div className="space-y-4">
                {processedComments.length > 0 ? (
                    processedComments.map((comment) => (
                        <div key={comment.id} className="rounded-xl bg-white p-4 sm:p-6 shadow-md transition hover:shadow-lg duration-200 border-l-4 border-purple-400">
                            
                            {/* Üst Bilgi: Kullanıcı, Puan ve Aksiyonlar */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 mb-3">
                                {/* Kullanıcı */}
                                <div className="flex items-center gap-2">
                                    <User size={16} className="text-purple-500" />
                                    <span className="text-base font-semibold text-gray-900">{comment.user?.username || 'Anonim'}</span>
                                    <span className="text-xs text-gray-400 ml-2 hidden sm:block">ID: {comment.id}</span>
                                </div>

                                {/* Puan ve Beğeni */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        {renderStars(comment.rating)}
                                    </div>
                                    <span className="text-sm text-blue-600 flex items-center gap-1">
                                        <ThumbsUp size={16} /> {comment.likes || 0}
                                    </span>
                                </div>
                                
                                {/* AKSİYONLAR (Sil) */}
                                <button 
                                    onClick={() => alert(`Yorum ID ${comment.id} siliniyor (Mock)`)}
                                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                                    title="Yorumu Sil"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            {/* Yorum İçeriği */}
                            <p className="text-gray-700 italic mb-4 text-base">
                                "{comment.body}"
                            </p>

                            {/* Alt Bilgi: Ürün Detayı */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t">
                                {comment.productId ? (
                                    <Link 
                                        to={`/product/${comment.productId}`}
                                        className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 transition"
                                        title={comment.productTitle}
                                    >
                                        <img src={comment.productImage} alt={comment.productTitle} className="h-8 w-8 rounded object-cover shadow"/>
                                        <span className="max-w-[200px] truncate font-medium">Ürün: {comment.productTitle}</span>
                                    </Link>
                                ) : (
                                    <span className="text-sm text-gray-400">Ürün bilgisi yok.</span>
                                )}
                            </div>

                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 rounded-lg bg-white shadow-lg">
                        <p className="text-gray-500">Arama kriterlerine uygun yorum bulunamadı.</p>
                    </div>
                )}
            </div>
            {/* --- YORUM KARTLARI SONU --- */}
        </div>
    );
}