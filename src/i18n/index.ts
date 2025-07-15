// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";
// import { resources } from "./resource.ts";

// export const locales = {
//   vi: "Vietnam",
//   en: "English",
//   kr: "Korea",
//   jp: "Japan",
// } as const;

// const defaultLng = localStorage.getItem("language") || "en";

// i18n.use(initReactI18next).init({
//   resources,
//   lng: defaultLng,
//   fallbackLng: "en",
//   interpolation: {
//     escapeValue: false,
//   },
// });

// export default i18n;
// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./resource";
import { locales } from "./languageConfig.ts";
const defaultLng = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLng,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export { locales };
export default i18n;
