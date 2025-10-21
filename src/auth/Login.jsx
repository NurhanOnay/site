import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import "./styles/Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]); // API’den gelen kullanıcılar
  const navigate = useNavigate();

  // Dummy JSON’den kullanıcıları çek
  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then((res) => res.json())
      .then((data) => {
        // Kullanıcılara rol ekle
        const updatedUsers = data.users.map((u, i) => ({
          ...u,
          role: i % 2 === 0 ? "admin" : "moderator", // örnek: çift index admin, tek index moderator
        }));
        setUsers(updatedUsers);
      })
      .catch((err) => console.error("Kullanıcı çekme hatası:", err));
  }, []);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      return Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Kullanıcı adı ve şifre girin",
      });
    }

    const user = users.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password
    );

    if (user) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", user.username);
      localStorage.setItem("role", user.role); // admin veya moderator

      Swal.fire({
        icon: "success",
        title: "Giriş Başarılı",
        text: `Hoşgeldiniz, ${user.username}!`,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => navigate("/products"));
    } else {
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Kullanıcı adı veya şifre yanlış",
      });
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <img src="/images/elogo.png" alt="NexGen Logo" className="login-logo" />
        <h2>Giriş Yap</h2>

        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <button onClick={handleLogin}>Giriş</button>
      </div>
    </div>
  );
}
