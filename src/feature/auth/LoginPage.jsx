import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "./authSlice"; // Redux login action'ı
import Swal from "sweetalert2";
import { motion } from "framer-motion"; // Animasyon için
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  User, 
  Lock,
  Chrome,  // Sosyal medya ikonları
  Facebook,
  Apple 
} from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]); // API’den gelen kullanıcılar
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. API'den Kullanıcıları Çekme ve Rol Atama (Sizin mantığınız)
  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then((res) => res.json())
      .then((data) => {
        // Rol atama mantığınızı koruyoruz
        const updatedUsers = data.users.map((u, i) => ({
          ...u,
          // Admin (0, 3, 6...), Moderator (1, 4, 7...), User (2, 5, 8...)
          role: i % 3 === 0 ? "admin" : (i % 3 === 1 ? "moderator" : "user"),
        }));
        setUsers(updatedUsers);
      })
      .catch((err) => {
          console.error("Kullanıcı çekme hatası:", err);
          Swal.fire("API Hatası!", "Kullanıcı listesi yüklenemedi.", "error");
      });
  }, []);

  // 2. Login Mantığı ve Role Göre Yönlendirme
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setIsLoading(false);
      return Swal.fire({ icon: "error", title: "Hata!", text: "Tüm alanlar zorunludur." });
    }
    if (users.length === 0) {
       setIsLoading(false);
       return Swal.fire("Lütfen Bekleyin", "Kullanıcı veritabanı yükleniyor...", "info");
    }
    
    // Kullanıcıyı bul
    const user = users.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password
    );

    if (user) {
      // Role atamasını kullanıyoruz (API'den gelmese bile biz atadık)
      const finalUser = users.find(u => u.username === user.username);
      
      // REDUX VE LOCALSTORAGE'A KAYDET
      dispatch(login(finalUser)); // authSlice'a rol bilgisiyle birlikte gönder

      // ROLE GÖRE YÖNLENDİRME
      let targetPath = '/products';
      if (finalUser.role === 'admin') {
          targetPath = '/admin';
      } else if (finalUser.role === 'moderator') {
          // Moderator ve User'ı şimdilik /products'a atalım (isteklere göre)
          targetPath = '/products'; 
      }

      Swal.fire({
        icon: "success",
        title: "Giriş Başarılı",
        text: `Hoşgeldiniz, ${user.firstName}!`,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => navigate(targetPath)); // Role göre yönlendir
      
    } else {
      setIsLoading(false);
      Swal.fire({ icon: "error", title: "Hata!", text: "Kullanıcı adı veya şifre yanlış." });
    }
  };

  // 3. JSX (Görsel Tasarım)
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-violet-100 to-pink-100 p-4">
      <motion.div
        className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        
        {/* Sol Sütun: Görsel Alanı */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center bg-white p-12 text-center">
          <img src="/images/elogo.png" alt="NexBuy" className="w-2/3" />
          <h1 className="mt-6 text-3xl font-bold text-purple-700">ONLINE SHOPPING</h1>
          <p className="mt-2 text-gray-500">Aradığınız her şey, bir tık uzağınızda.</p>
        </div>

        {/* Sağ Sütun: Form Alanı */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-pink-50">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">GİRİŞ YAP</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Kullanıcı Adı */}
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User size={18} className="text-gray-400" />
              </span>
              <input
                id="username" type="text" autoComplete="username" required
                value={username} onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md border-gray-300 py-2.5 pl-10 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                placeholder="Username"
              />
            </div>

            {/* Şifre */}
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock size={18} className="text-gray-400" />
              </span>
              <input
                id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-gray-300 py-2.5 pl-10 pr-10 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                placeholder="Password"
              />
              <span
                className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
              </span>
            </div>

            <div className="text-right text-sm">
              <Link to="#" className="font-medium text-purple-600 hover:text-purple-500">Şifrenizi mi unuttunuz?</Link>
            </div>

            {/* Login Butonu */}
            <button
              type="submit"
              disabled={isLoading || users.length === 0}
              className="flex w-full justify-center rounded-md border border-transparent bg-purple-600 py-3 px-4 text-sm font-medium text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:bg-purple-700 hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-purple-300"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : "LOGIN"}
            </button>
            
            {/* Sosyal Medya Butonları */}
            <div className="relative my-5">
              {/* ... (Sosyal Medya Butonları aynı) ... */}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {/* ... (Sosyal Medya Butonları aynı) ... */}
            </div>
            
            {/* Hesap Oluştur Linki */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Üye değil misiniz? <Link to="#" className="font-medium text-purple-600 hover:text-purple-500">Hesap Oluştur</Link>
            </p>

          </form>
        </div>
        
      </motion.div>
    </div>
  );
}