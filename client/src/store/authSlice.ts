import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminUser } from "@/types";

const TOKEN_KEY = "nvn-admin-token";

interface AuthState {
  token: string | null;
  admin: AdminUser | null;
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null,
  admin: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    credentialsSet(state, action: PayloadAction<{ token: string; admin: AdminUser }>) {
      state.token = action.payload.token;
      state.admin = action.payload.admin;
      window.localStorage.setItem(TOKEN_KEY, action.payload.token);
    },
    adminLoaded(state, action: PayloadAction<AdminUser>) {
      state.admin = action.payload;
    },
    loggedOut(state) {
      state.token = null;
      state.admin = null;
      window.localStorage.removeItem(TOKEN_KEY);
    },
  },
});

export const { credentialsSet, adminLoaded, loggedOut } = authSlice.actions;
export default authSlice.reducer;
