import { Box, Typography } from "@mui/material";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import CustomPopover from "../../common/Dropdown/Popover";
import SelectDropdown from "../../common/Dropdown/SelectDropdown";
import { useChangeLanguage } from "../../context/use[custom]/useChangeOptions";

const LanguageButton = () => {
  const { t } = useTranslation();
  const {
    handleSaveChange,

    selectedLang,
    selectedPayMoney,

    pendingLanguage,
    pendingPayMoney,

    handleLanguageSelect,
    handlePayMoneySelect,

    optionLanguage,
    currencyOptions,

    dataFindLocaleConfig,
  } = useChangeLanguage();

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

  const renderName = useMemo(
    () => (
      <Box
        sx={{
          width: "auto",
          minWidth: "7rem",
          display: "flex",
          alignItems: "center",
          gap: 1, // khoảng cách giữa flag và text
        }}
      >
        <Box
          component="img"
          src={dataFindLocaleConfig?.data?.country.flag}
          alt={`${dataFindLocaleConfig?.data?.country.country} flag`}
          sx={{
            width: 24,
            height: 16, // flag nhìn đúng tỉ lệ hơn
            objectFit: "cover",
            borderRadius: 0.5,
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {dataFindLocaleConfig?.data?.currency.symbol}
          {dataFindLocaleConfig?.data?.country.country}
        </Box>
      </Box>
    ),
    [dataFindLocaleConfig]
  );

  return (
    <CustomPopover
      text={renderName}
      handleAction={handleSaveChange}
      option={[renderDropdown]}
      hideSubmitButton={false}
    />
  );
};

export default memo(LanguageButton);
