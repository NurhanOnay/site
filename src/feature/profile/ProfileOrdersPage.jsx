import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function ProfileOrdersPage() {
  // TODO: Burada 'useGetOrdersQuery()' (API'den) çağrılmalı ve siparişler listelenmeli
  const orders = []; // Sahte veri

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Siparişlerim
      </h2>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <ShoppingBag size={48} className="text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Henüz siparişiniz bulunmuyor
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Sipariş verdiğinizde burada görünecekler.
            </p>
          </div>
        ) : (
          // orders.map(order => (...))
          <p>Sipariş listesi buraya gelecek.</p>
        )}
      </div>
    </div>
  );
}