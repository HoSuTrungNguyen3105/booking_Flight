import { useState } from "react";
import { Dropdown } from "../../common/Dropdown/Dropdown";
import type { DropdownOptions } from "../../common/Dropdown/type";
import i18n from "../../i18n";
import { optionLanguage } from "../../i18n/resource";

// // Danh sách ngôn ngữ
// const optionLanguage: DropdownOptions[] = [
//   { label: "English", value: "en" },
//   { label: "日本語", value: "jp" },
//   { label: "한국어", value: "kr" },
// ];

export const LanguageDropdown = () => {
  // State giữ ngôn ngữ đang chọn
  const [selectedLang, setSelectedLang] = useState<DropdownOptions | null>(
    optionLanguage.find((o) => o.value === localStorage.getItem("language")) ||
      null
  );

  // Đổi ngôn ngữ + set localStorage
  const handleLanguageChange = (
    _: React.SyntheticEvent,
    newValue: DropdownOptions | DropdownOptions[] | null
  ) => {
    const selected = Array.isArray(newValue) ? newValue[0] : newValue;
    if (!selected) return;

    setSelectedLang(selected);
    const lng = String(selected.value);
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  return (
    <Dropdown
      options={optionLanguage}
      value={selectedLang}
      onChange={handleLanguageChange}
      label="Language"
    />
  );
};
