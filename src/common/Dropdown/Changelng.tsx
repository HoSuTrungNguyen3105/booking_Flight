import { Dropdown } from "../../common/Dropdown/Dropdown";
import { optionLanguage } from "../../i18n/resource";
import { useChangeLanguage } from "../../context/use[custom]/useChangeLng";

export const LanguageDropdown = () => {
  const { selectedLang, handleLanguageChange } = useChangeLanguage();

  return (
    <Dropdown
      options={optionLanguage}
      value={selectedLang}
      onChange={handleLanguageChange}
      label="Language"
    />
  );
};
