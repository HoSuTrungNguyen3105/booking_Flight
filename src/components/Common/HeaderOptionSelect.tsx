import { Box, Typography } from "@mui/material";
import { memo, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import CustomPopover from "../../common/Dropdown/Popover";
import SelectDropdown from "../../common/Dropdown/SelectDropdown";
import { useChangeLanguage } from "../../context/use[custom]/useChangeOptions";

const LanguageButton = () => {
  const { t } = useTranslation();
  const {
    selectedLang,
    handleLanguageSelect,
    selectedPayMoney,
    handlePayMoneySelect,
    confirmSaveChange,
    pendingLanguage,
    pendingPayMoney,
    optionLanguage,
    currencyOptions,
  } = useChangeLanguage();

  const handleSaveChange = useCallback(() => {
    confirmSaveChange();
  }, [confirmSaveChange]);

  const renderContent = useMemo(
    () => (
      <Box gap={1}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          color="text.primary"
          gutterBottom
        >
          {t("language")}
        </Typography>
        <SelectDropdown
          options={optionLanguage}
          value={pendingLanguage?.value || selectedLang?.value}
          onChange={handleLanguageSelect}
          sx={{ minWidth: 200, mb: 2 }}
        />

        <Typography
          variant="subtitle1"
          fontWeight={600}
          color="text.primary"
          gutterBottom
        >
          {t("switch_change_currency")}
        </Typography>
        <SelectDropdown
          options={currencyOptions}
          value={pendingPayMoney?.value || selectedPayMoney?.value}
          onChange={handlePayMoneySelect}
          sx={{ minWidth: 200 }}
        />
      </Box>
    ),
    [
      t,
      optionLanguage,
      currencyOptions,
      pendingLanguage,
      selectedLang,
      handleLanguageSelect,
      pendingPayMoney,
      selectedPayMoney,
      handlePayMoneySelect,
    ]
  );

  const renderDropdown = useMemo(
    () => <Box sx={{ maxWidth: 240, minWidth: 240 }}>{renderContent}</Box>,
    [renderContent]
  );

  return (
    <CustomPopover
      text={t("language_settings") || "Language"}
      handleAction={handleSaveChange}
      option={[renderDropdown]}
      hideSubmitButton={false}
    />
  );
};

export default memo(LanguageButton);
