import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  bookingModalOpen: boolean;
  bookingPresetServiceId: string | null;
  mobileMenuOpen: boolean;
  hasEnteredSite: boolean;
}

const initialState: UiState = {
  bookingModalOpen: false,
  bookingPresetServiceId: null,
  mobileMenuOpen: false,
  hasEnteredSite: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    bookingModalOpened(state, action: PayloadAction<string | null | undefined>) {
      state.bookingModalOpen = true;
      state.bookingPresetServiceId = action.payload ?? null;
    },
    bookingModalClosed(state) {
      state.bookingModalOpen = false;
      state.bookingPresetServiceId = null;
    },
    mobileMenuToggled(state, action: PayloadAction<boolean | undefined>) {
      state.mobileMenuOpen = action.payload ?? !state.mobileMenuOpen;
    },
    siteEntered(state) {
      state.hasEnteredSite = true;
    },
  },
});

export const { bookingModalOpened, bookingModalClosed, mobileMenuToggled, siteEntered } = uiSlice.actions;
export default uiSlice.reducer;
