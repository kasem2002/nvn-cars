import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import authReducer from "@/store/authSlice";
import languageReducer from "@/store/languageSlice";
import uiReducer from "@/store/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    language: languageReducer,
    ui: uiReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
