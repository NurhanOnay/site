import React, { useState, useMemo } from 'react'; // useMemo ve useState'i kontrol edin
import { Users, Search, Ban, Trash2, CheckCircle, RotateCcw } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../auth/authSlice'; 
import { useGetUsersQuery } from '../../products/productsApi'; 
import Spinner from '../../../components/Spinner';

export default function AdminUsersPage() {
    // --- 1. TÜM HOOK'LAR VE STATE'ler (KOŞULSUZ ALAN) ---
    const userRole = useSelector(selectUserRole); 
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]); 

    const [loading, setLoading] = useState(false); // Simülasyon işlemleri için
    const [error, setError] = useState(null); 
    
    // RTK Query Hook'u - Veri Çekme (Koşulsuz Çağrılmalı)
    const { 
        data: apiUsers, 
        isLoading: isFetching, 
        isError, 
        error: apiError 
    } = useGetUsersQuery(); // error'ı apiError olarak yeniden adlandırdık.

    // Kullanıcı verisi API'den geldiğinde yerel state'e yükle (useEffect Hook'u)
    React.useEffect(() => {
        if (apiUsers) {
            setUsers(apiUsers);
        }
    }, [apiUsers]);

    // --- 2. VERİ İŞLEME (Hook'lar hemen ardından) ---
    const filteredUsers = useMemo(() => { // 👈 Hata veren Hook artık burada
        const lowerCaseSearch = searchTerm.toLowerCase();
        return users.filter(user => 
            user.firstName?.toLowerCase().includes(lowerCaseSearch) ||
            user.lastName?.toLowerCase().includes(lowerCaseSearch) ||
            user.email?.toLowerCase().includes(lowerCaseSearch) ||
            user.username?.toLowerCase().includes(lowerCaseSearch)
        );
    }, [users, searchTerm]);


    // --- 3. GÜVENLİK VE YÜKLEME KONTROLLERİ (Koşullu Return'ler) ---
    
    // Kullanıcı rolü yüklenene kadar bekle (null ise)
    if (userRole === null) {
        return <div className="p-6 text-center text-purple-600">Yetki Kontrolü Yapılıyor...</div>;
    }

    // GÜVENLİK KONTROLÜ: Admin değilse at
    if (userRole !== 'admin') {
        return <Navigate to="/products" replace />; 
    }
    
    // Yüklenme Kontrolü (Sadece Admin yetkisi onaylandıktan sonra)
    if (isFetching && !users.length) return <Spinner />;
    if (isError) return <div className="p-6 text-center text-red-600">Hata: {apiError?.message || "Kullanıcılar yüklenemedi."}</div>; // apiError kullanıldı


    // --- 4. FONKSİYONLAR (Hook'lardan sonra tanımlanır) ---
    const handleToggleBlock = (userId) => {
        setUsers(prevUsers => prevUsers.map(user => 
            user.id === userId ? { ...user, isBlocked: !user.isBlocked } : user
        ));
    };

    const handleDeleteUser = (userId) => {
        if (!window.confirm("Bu kullanıcıyı kalıcı olarak silmek istediğinizden emin misiniz?")) return;
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    };

    // JSX Başlangıcı
    return (
        <div className="space-y-6">
            <header className="flex items-center gap-3">
                <Users size={28} className="text-purple-600" />
                <h1 className="text-2xl font-bold text-gray-800">Kullanıcı Yönetimi ({users.length})</h1>
            </header>
            <p className="text-gray-600">Sistemdeki kullanıcılar API'den çekilmiştir. Engelleme ve silme işlemleri görsel simülasyondur.</p>

            {/* ... (Geri kalan JSX kodu) ... */}
            <div className="overflow-x-auto rounded-lg bg-white shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {filteredUsers.length === 0 ? (
                            <tr><td colSpan="7" className="py-8 text-center text-gray-500">Eşleşen kullanıcı bulunamadı.</td></tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className={user.isBlocked ? 'bg-red-50 opacity-70' : 'hover:bg-gray-50'}>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{user.id}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{user.firstName} {user.lastName}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        <span className={`inline-flex rounded-full px-3 text-xs font-semibold leading-5 ${ user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800' }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-center">
                                        {user.isBlocked ? (<span className="flex items-center justify-center gap-1 text-red-600"> <Ban size={16} /> Engelli </span>) : (<span className="flex items-center justify-center gap-1 text-green-600"> <CheckCircle size={16} /> Aktif </span>)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 text-center">{user.createdAt}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                                        <button onClick={() => handleToggleBlock(user.id)} className={`rounded-full p-2 transition-colors duration-150 mr-2 ${user.isBlocked ? 'text-green-600 hover:bg-green-100' : 'text-red-600 hover:bg-red-100'}`} title={user.isBlocked ? "Engeli Kaldır" : "Kullanıcıyı Engelle"}>
                                            {user.isBlocked ? <RotateCcw size={18} /> : <Ban size={18} />}
                                        </button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="rounded-full p-2 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors duration-150" title="Kullanıcıyı Sil">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* İstatistik Kartı */}
            <div className="flex justify-start">
                <div className="rounded-lg bg-white p-4 shadow-md">
                    <h3 className="text-lg font-medium text-gray-700">Genel İstatistikler</h3>
                    <p className="mt-1 text-2xl font-bold text-purple-600">{users.length} <span className="text-sm font-medium text-gray-500">Kullanıcı</span></p>
                    <p className="text-sm text-gray-500">{users.filter(u => u.isBlocked).length} Engelli, {users.filter(u => u.role === 'admin').length} Yönetici</p>
                </div>
            </div>
        </div>
    );
}