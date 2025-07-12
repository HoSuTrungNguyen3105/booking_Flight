import type { DropdownOptions } from "../../common/Dropdown/type";
import i18n from "../../i18n";

export const optionLanguage: DropdownOptions[] = [
  { label: "English", value: "en" },
  { label: "日本語", value: "jp" },
  { label: "한국어", value: "kr" },
];
export const changeLanguage = ({ value }: DropdownOptions) => {
  const lng = String(value);
  i18n.changeLanguage(lng);
  localStorage.setItem("language", lng);
};

// ✅ Adapter khớp kiểu Dropdown onChange
export const handleDropdownChange = (
  event: React.SyntheticEvent,
  newValue: DropdownOptions | DropdownOptions[] | null
) => {
  if (!newValue) return;

  // Trường hợp multiple
  if (Array.isArray(newValue)) {
    // Nếu cần dùng nhiều giá trị, lặp qua đây
    changeLanguage(newValue[0]); // hoặc xử lý theo logic riêng
  } else {
    changeLanguage(newValue);
  }
};
