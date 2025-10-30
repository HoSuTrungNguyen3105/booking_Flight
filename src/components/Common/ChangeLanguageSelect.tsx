import { Box, Typography } from "@mui/material";
import { memo, useCallback } from "react";
import CustomPopover from "../../common/Dropdown/Popover";
import { useChangeLanguage } from "../../context/use[custom]/useChangeLng";
import SelectDropdown from "../../common/Dropdown/SelectDropdown";
import { useTranslation } from "react-i18next";

const LanguageButton = () => {
  const { t } = useTranslation();
  const {
    selectedLang,
    handleLanguageSelect,
    selectedPayMoney,
    handlePayMoneySelect,
    confirmSaveChange,
    pendingLang,
    pendingPayMoney,
    optionLanguage,
    currencyOptions,
  } = useChangeLanguage();

  const handleSaveChange = useCallback(() => {
    confirmSaveChange();
  }, [confirmSaveChange]);

  const renderContent = useCallback(() => {
    return (
      <>
        <Typography variant="h6" fontWeight="600" color="text.primary">
          {t("language")}
        </Typography>
        <SelectDropdown
          options={optionLanguage}
          value={pendingLang?.value || selectedLang?.value}
          onChange={handleLanguageSelect}
          sx={{ minWidth: 700 }}
        />
        <Typography component="p" variant="subtitle1">
          {t("switch_change_currency")}
        </Typography>
        <SelectDropdown
          options={currencyOptions}
          value={pendingPayMoney?.value || selectedPayMoney?.value}
          onChange={handlePayMoneySelect}
        />
      </>
    );
  }, [
    t,
    optionLanguage,
    pendingLang,
    selectedLang,
    handleLanguageSelect,
    currencyOptions,
    pendingPayMoney,
    selectedPayMoney,
    handlePayMoneySelect,
  ]);

  const renderDropdown = useCallback(() => {
    return (
      <Box sx={{ maxWidth: "200px", minWidth: "200px" }}>{renderContent()}</Box>
    );
  }, [renderContent]);

  return (
    <CustomPopover
      text={"Language"}
      handleAction={handleSaveChange}
      option={[renderDropdown()]}
      hideSubmitButton={false}
    />
  );
};
export default memo(LanguageButton);
