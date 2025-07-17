import { useState } from "react";
import type { DropdownOptions } from "../../common/Dropdown/type";
import i18n from "../../i18n";
import { optionLanguage } from "../../i18n/resource";

export const useChangeLanguage = () => {
  const [selectedLang, setSelectedLang] = useState<DropdownOptions | null>(
    optionLanguage.find((o) => o.value === localStorage.getItem("language")) ||
      null
  );

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

  return {
    selectedLang,
    handleLanguageChange,
  };
};
