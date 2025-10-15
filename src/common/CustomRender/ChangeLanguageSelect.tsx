import { Box, Stack, Typography } from "@mui/material";
import { memo, useCallback } from "react";
import CustomPopover from "../Button/Popover";
import { useChangeLanguage } from "../../context/use[custom]/useChangeLng";
import SelectDropdown from "../Dropdown/SelectDropdown";
import { useTranslation } from "react-i18next";
import LanguageIcon from "../../svgs/network-2-svgrepo-com.svg";

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
      <Box sx={{ maxWidth: "200px", minWidth: "200px" }}>
        {renderContent()}
        {/* {renderActions()} */}
      </Box>
    );
  }, [renderContent]);

  const renderIconLabel = useCallback(() => {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {/* <Box
          component="img"
          src={LanguageIcon}
          alt="language"
          sx={{ width: 16, height: 16 }}
        /> */}
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          Language
        </Typography>
      </Box>
    );
  }, []);

  return (
    <CustomPopover
      // icon={renderIconLabel()}
      icon={"Language"}
      handleAction={handleSaveChange}
      option={[renderDropdown()]}
      hideSubmitButton={false}
    />
  );
};
export default memo(LanguageButton);
