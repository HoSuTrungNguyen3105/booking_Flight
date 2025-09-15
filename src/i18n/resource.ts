import { locales } from "./languageConfig";
import type { DropdownOptions } from "../common/Dropdown/type";
import { en } from "./en";
import { jp } from "./jp";
import { vi } from "./vi";
import { ko } from "./ko";

export const resources = {
  vi,
  en,
  jp,
  ko,
};

export const optionLanguage: DropdownOptions[] = Object.entries(locales).map(
  ([value, label]) => ({
    value,
    label,
  })
);
