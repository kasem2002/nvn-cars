import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminUser } from "@/types";

const TOKEN_KEY = "nvn-admin-token";

interface AuthState {
  token: string | null;
  admin: AdminUser | null;
}

function readInitialToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY) || window.sessionStorage.getItem(TOKEN_KEY);
}

function persistToken(token: string, remember: boolean) {
  const store = remember ? window.localStorage : window.sessionStorage;
  const other = remember ? window.sessionStorage : window.localStorage;
  store.setItem(TOKEN_KEY, token);
  other.removeItem(TOKEN_KEY);
}

function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
}

const initialState: AuthState = {
  token: readInitialToken(),
  admin: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    credentialsSet(
      state,
      action: PayloadAction<{ token: string; admin: AdminUser; remember?: boolean }>
    ) {
      state.token = action.payload.token;
      state.admin = action.payload.admin;
      persistToken(action.payload.token, action.payload.remember ?? true);
    },
    adminLoaded(state, action: PayloadAction<AdminUser>) {
      state.admin = action.payload;
    },
    loggedOut(state) {
      state.token = null;
      state.admin = null;
      clearToken();
    },
  },
});

export const { credentialsSet, adminLoaded, loggedOut } = authSlice.actions;
export default authSlice.reducer;
