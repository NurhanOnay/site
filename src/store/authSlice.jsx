import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: localStorage.getItem("isLoggedIn") === "true" || false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
      localStorage.setItem("isLoggedIn", "true");
    },
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem("isLoggedIn");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
