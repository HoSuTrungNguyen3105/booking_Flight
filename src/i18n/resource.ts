import { locales } from "./languageConfig";
import type { DropdownOptions } from "../common/Dropdown/type";
import { en } from "./en";
import { jp } from "./jp";
import { kr } from "./kr";
import { vi } from "./vi";

export const resources = {
  vi,
  en,
  jp,
  kr,
};
export const optionLanguage: DropdownOptions[] = Object.entries(locales).map(
  ([value, label]) => ({
    value,
    label,
  })
);
