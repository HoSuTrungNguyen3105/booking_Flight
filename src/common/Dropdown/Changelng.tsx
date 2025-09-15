import { Box, Button, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import CustomPopover from "../Button/Popover";
import { useChangeLanguage } from "../../context/use[custom]/useChangeLng";
import SelectDropdown from "./SelectDropdown";
import { useTranslation } from "react-i18next";

export const LanguageButton = () => {
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

  const renderActions = useCallback(() => {
    return (
      <Box mr={2} display="flex" justifyContent="flex-end" alignItems="center">
        <Button variant="contained" onClick={handleSaveChange}>
          {t("submit")}
        </Button>
      </Box>
    );
  }, [handleSaveChange, t]);

  const renderDropdown = useCallback(() => {
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
        {renderActions()}
      </>
    );
  }, []);

  return (
    <>
      <CustomPopover
        icon="Icon"
        handleAction={() => {}}
        option={[renderDropdown()]}
      />
    </>
  );
};
