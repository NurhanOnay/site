import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";
import cartReducer from "../feature/cart/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});
