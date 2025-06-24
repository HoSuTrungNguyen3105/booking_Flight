import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./resource.ts";
export const locales = {
  en: "English",
  kr: "Korea",
  jp: "Japan",
};
i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
