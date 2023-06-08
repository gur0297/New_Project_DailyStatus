import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../actions/authSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
