import type { DropdownOptions } from "../../common/Dropdown/type";
import i18n from "../../i18n";

export const optionLanguage: DropdownOptions[] = [
  { label: "English", value: "en" },
  { label: "日本語", value: "jp" },
  { label: "한국어", value: "kr" },
];

// ✅ Dùng trực tiếp để truyền vào Dropdown
export const handleLanguageChange = (
  event: React.SyntheticEvent,
  newValue: DropdownOptions | DropdownOptions[] | null
) => {
  const selected = Array.isArray(newValue) ? newValue[0] : newValue;
  if (!selected) return;

  const lng = String(selected.value);
  i18n.changeLanguage(lng);
  localStorage.setItem("language", lng);
};
