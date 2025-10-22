import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice";
import cartReducer from "../feature/cart/cartSlice";
import { productsApi } from "../feature/products/productsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    
    [productsApi.reducerPath]: productsApi.reducer, 
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware), 
});

export default store;