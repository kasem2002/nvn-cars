import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SupportedLanguage } from "@/i18n";

interface LanguageState {
  language: SupportedLanguage;
}

function detectInitialLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem("nvn-language");
  return stored === "ar" ? "ar" : "en";
}

const initialState: LanguageState = {
  language: detectInitialLanguage(),
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    languageSet(state, action: PayloadAction<SupportedLanguage>) {
      state.language = action.payload;
    },
  },
});

export const { languageSet } = languageSlice.actions;
export default languageSlice.reducer;
