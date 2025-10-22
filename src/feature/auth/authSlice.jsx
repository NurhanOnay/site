import { createSlice } from "@reduxjs/toolkit";

// Helper: Sayfa yenilendiğinde localStorage'dan state'i yükle
const initialState = {
  // Giriş durumunu al (true/false)
  isAuthenticated: localStorage.getItem("isLoggedIn") === "true",
  
  // ROLÜ AL (admin, moderator, user)
  role: localStorage.getItem("role") || null,
  
  // Kullanıcı bilgilerini al (kullanıcı adı vb.)
  user: localStorage.getItem("user") 
    ? JSON.parse(localStorage.getItem("user")) 
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    
    /**
     * Login olduğunda artık bir payload (kullanıcı verisi) bekliyoruz.
     * Örn: dispatch(login({ username: 'admin', role: 'admin' }))
     */
    login: (state, action) => {
      const { role, ...user } = action.payload;

      // 1. Redux State'ini Güncelle
      state.isAuthenticated = true;
      state.role = role;
      state.user = user;

      // 2. localStorage'ı Güncelle (Sayfa yenilemeleri için)
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));
    },
    
    /**
     * Logout olduğunda tüm state'i ve localStorage'ı temizle
     */
    logout: (state) => {
      // 1. Redux State'ini Temizle
      state.isAuthenticated = false;
      state.role = null;
      state.user = null;

      // 2. localStorage'ı Temizle
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    },
  },
});

// Action'ları dışa aktar
export const { login, logout } = authSlice.actions;

// Selector'lar (Bileşenlerin state'e kolayca erişmesi için)
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.role;
export const selectUser = (state) => state.auth.user;

// Reducer'ı dışa aktar
export default authSlice.reducer;