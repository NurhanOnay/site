import React from 'react';
import { Loader2 } from 'lucide-react';

// Ekranda ortalanmış, dönen bir yüklenme ikonu
export default function Spinner() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 size={48} className="animate-spin text-blue-600" />
    </div>
  );
}