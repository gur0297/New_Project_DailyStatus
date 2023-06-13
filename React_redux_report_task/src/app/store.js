import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../actions/authSlice.js";
import userReducer from "../actions/userSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});
