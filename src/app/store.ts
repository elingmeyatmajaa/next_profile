// app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "./login/redux/login_slice";

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
  },
});

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
