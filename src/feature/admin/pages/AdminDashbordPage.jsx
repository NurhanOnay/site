import React, { useMemo } from 'react';
import { useGetProductsQuery } from '../../products/productsApi'; // productsApi.js yolunu doğrulayın
import Spinner from '../../../components/Spinner';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Package, Shapes, DollarSign, Users, TrendingUp } from 'lucide-react'; // İkonlar

// Chart.js'i başlat
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// Stat Card Bileşeni
const StatCard = ({ title, value, icon, colorClass, hoverBorderClass }) => (
  <div className={`overflow-hidden rounded-xl bg-white p-5 shadow-lg transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border-l-4 border-transparent ${hoverBorderClass}`}>
    <dt className={`flex items-center text-sm font-medium text-gray-500 truncate ${colorClass}`}>
      {icon} {title}
    </dt>
    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{value}</dd>
  </div>
);

// Chart Card Bileşeni
const ChartCard = ({ title, children, className = "" }) => (
   <div className={`overflow-hidden rounded-xl bg-white p-6 shadow-lg ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">{title}</h3>
      {children}
   </div>
);

export default function AdminDashboardPage() {
  // 1. Ürün Verisini Çek
  const { data: productsData, isLoading, isError, error } = useGetProductsQuery();

  // 2. İstatistikleri ve Grafik Verisini Hesapla
  const stats = useMemo(() => {
    if (!productsData?.products) return { totalProducts: 0, totalCategories: 0, averagePrice: 0, categoryCounts: {}, brandCounts: {} };
    const products = productsData.products;
    const totalProducts = products.length;
    const categories = [...new Set(products.map(p => p.category))];
    const totalCategories = categories.length;
    const averagePrice = products.length > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / totalProducts) : 0;
    const categoryCounts = products.reduce((acc, { category }) => { acc[category] = (acc[category] || 0) + 1; return acc; }, {});
    const brandCounts = products.reduce((acc, { brand }) => { acc[brand] = (acc[brand] || 0) + 1; return acc; }, {});
    return {
      totalProducts, totalCategories,
      averagePrice: averagePrice.toFixed(2),
      categoryCounts, brandCounts
    };
  }, [productsData]);

  // 3. Pasta Grafik Verisi ve Renkleri
  const categoryLabels = useMemo(() => Object.keys(stats.categoryCounts), [stats.categoryCounts]);
  const categoryValues = useMemo(() => Object.values(stats.categoryCounts), [stats.categoryCounts]);
  // Daha fazla renk gerekirse ekleyin veya dinamik oluşturun
  const pieColors = useMemo(() => [
        '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
        '#8b5cf6', '#d946ef', '#2563eb', '#059669', '#d97706', '#dc2626',
        '#7c3aed', '#c026d3', '#1d4ed8', '#047857', '#b45309', '#b91c1c'
  ], []);
  const pieChartData = {
    labels: categoryLabels.map(l => l.charAt(0).toUpperCase() + l.slice(1)), // Baş harfi büyük
    datasets: [{
        label: '# Ürün',
        data: categoryValues,
        backgroundColor: pieColors.slice(0, categoryLabels.length).map(color => `${color}B3`), // %70 opacity
        borderColor: pieColors.slice(0, categoryLabels.length),
        borderWidth: 1,
    }],
  };
  const pieOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels:{ padding:15 } }}};

  // 4. Çubuk Grafik Verisi
   const popularBrands = useMemo(() => Object.entries(stats.brandCounts).sort(([, a], [, b]) => b - a).slice(0, 10), [stats.brandCounts]); // İlk 10 marka
   const barChartData = {
     labels: popularBrands.map(([brand]) => brand),
     datasets: [{
         label: 'Ürün Sayısı',
         data: popularBrands.map(([, count]) => count),
         backgroundColor: 'rgba(139, 92, 246, 0.6)', // Mor tonu
         borderColor: 'rgba(139, 92, 246, 1)',
         borderWidth: 1,
         borderRadius: 5,
     }],
   };
   const barOptions = {
      responsive: true, maintainAspectRatio: false, indexAxis: 'y', // Yatay çubuk
      plugins: { legend: { display: false }, title: { display: true, text: 'En Popüler 10 Marka' } },
      scales: { x: { beginAtZero: true }, y: { ticks: { autoSkip: false } } }
   };

  // --- Yükleniyor & Hata ---
  if (isLoading) return <Spinner />;
  if (isError) return <div className="p-6 text-center text-red-600">Hata: {error?.message || "Veriler yüklenemedi"}</div>;

  // --- JSX ---
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Yönetim Paneli</h1>
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Toplam Ürün" value={stats.totalProducts} icon={<Package size={20} className="mr-2"/>} colorClass="text-purple-600" hoverBorderClass="hover:border-purple-600" />
        <StatCard title="Toplam Kategori" value={stats.totalCategories} icon={<Shapes size={20} className="mr-2"/>} colorClass="text-pink-600" hoverBorderClass="hover:border-pink-600" />
        <StatCard title="Ortalama Fiyat" value={`${stats.averagePrice} ₺`} icon={<DollarSign size={20} className="mr-2"/>} colorClass="text-blue-600" hoverBorderClass="hover:border-blue-600" />
        <StatCard title="Toplam Kullanıcı" value="3" icon={<Users size={20} className="mr-2"/>} colorClass="text-green-600" hoverBorderClass="hover:border-green-600" />
      </div>
      {/* Grafik Alanı */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
         <ChartCard title="Kategori Dağılımı" className="lg:col-span-2">
            <div className="relative h-72 w-full sm:h-80 lg:h-96">
               <Pie data={pieChartData} options={pieOptions} />
            </div>
         </ChartCard>
         <ChartCard title="Marka Popülerliği" className="lg:col-span-3">
             <div className="relative h-72 w-full sm:h-80 lg:h-96">
                <Bar options={barOptions} data={barChartData} />
             </div>
         </ChartCard>
      </div>
    </div>
  );
}