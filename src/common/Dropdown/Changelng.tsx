import { optionLanguage } from "../../i18n/resource";
import { useChangeLanguage } from "../../context/use[custom]/useChangeLng";
import SelectDropdown from "./SelectDropdown";
import { useTranslation } from "react-i18next";

export const LanguageDropdown = () => {
  const { t } = useTranslation();
  const { selectedLang, handleLanguageChange } = useChangeLanguage();

  return (
    <SelectDropdown
      options={optionLanguage}
      value={selectedLang?.value ?? ""}
      onChange={handleLanguageChange}
      placeholder={t("home")}
    />
  );
};
