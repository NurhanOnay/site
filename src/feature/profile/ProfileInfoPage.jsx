import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../auth/authSlice';
import Swal from 'sweetalert2';

export default function ProfileInfoPage() {
  const user = useSelector(selectUser);

  // Form state'lerini mevcut kullanıcı bilgileriyle doldur
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const handleInfoChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Bilgi Güncelleme Formu Gönderimi
  const handleInfoSubmit = (e) => {
    e.preventDefault();
    // TODO: Burada bir 'useUpdateUserMutation' (API'den) çağrılmalı
    console.log('Güncellenen Bilgiler:', formData);
    Swal.fire('Başarılı!', 'Bilgileriniz güncellendi.', 'success');
  };

  // Şifre Değiştirme Formu Gönderimi
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // TODO: Burada bir 'useChangePasswordMutation' (API'den) çağrılmalı
    console.log('Yeni Şifre Bilgisi:', passwordData);
    Swal.fire('Başarılı!', 'Şifreniz değiştirildi.', 'success');
    setPasswordData({ currentPassword: '', newPassword: '' });
  };

  return (
    <div className="space-y-8">
      {/* 1. Kısım: Hesap Bilgileri */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Hesap Bilgileri
        </h2>
        <form onSubmit={handleInfoSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Ad</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Soyad</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleInfoChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-posta</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInfoChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Bilgileri Güncelle
            </button>
          </div>
        </form>
      </div>

      {/* 2. Kısım: Şifre Değiştirme */}
      <div className="border-t pt-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Şifre Değiştir
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Mevcut Şifre</label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Yeni Şifre</label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Şifreyi Değiştir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}