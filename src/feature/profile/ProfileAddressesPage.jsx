import React from 'react';
import { MapPin, Plus } from 'lucide-react';

export default function ProfileAddressesPage() {
  // TODO: Burada 'useGetAddressesQuery()' (API'den) çağrılmalı ve adresler listelenmeli
  const addresses = []; // Sahte veri

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Adreslerim
        </h2>
        <button className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
          <Plus size={18} /> Yeni Adres Ekle
        </button>
      </div>
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <MapPin size={48} className="text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Kayıtlı adresiniz bulunmuyor
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Yeni adres eklediğinizde burada görünecekler.
            </p>
          </div>
        ) : (
          // addresses.map(address => (...))
          <p>Adres listesi buraya gelecek.</p>
        )}
      </div>
    </div>
  );
}