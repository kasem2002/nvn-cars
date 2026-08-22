import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SupportedLanguage } from "@/i18n";

interface LanguageState {
  language: SupportedLanguage;
}

/**
 * First-load language detection.
 * 1. Respect an explicit stored choice (`localStorage['nvn-language']`).
 * 2. Otherwise honor the browser language — Arabic browsers get Arabic
 *    (this is the majority of the Baghdad target audience).
 * 3. Fall back to English.
 *
 * Kept in lock-step with the i18next LanguageDetector config in
 * `src/i18n/index.ts` so both sources of truth agree on first render.
 */
function detectInitialLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem("nvn-language");
  if (stored === "ar" || stored === "en") return stored;
  const navLang = window.navigator.language?.toLowerCase() ?? "";
  if (navLang.startsWith("ar")) return "ar";
  return "en";
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
