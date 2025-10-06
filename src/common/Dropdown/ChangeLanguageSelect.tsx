import { Box, Typography } from "@mui/material";
import { memo, useCallback } from "react";
import CustomPopover from "../Button/Popover";
import { useChangeLanguage } from "../../context/use[custom]/useChangeLng";
import SelectDropdown from "./SelectDropdown";
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
          {t("description")}
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
      <Box sx={{ maxWidth: "200px", minWidth: "200px" }}>
        {renderContent()}
        {/* {renderActions()} */}
      </Box>
    );
  }, [renderContent]);

  return (
    <CustomPopover
      icon="Icon"
      handleAction={handleSaveChange}
      option={[renderDropdown()]}
      hideSubmitButton={false}
    />
  );
};
export default memo(LanguageButton);
