import { Box, Button, Typography } from "@mui/material";
import { memo, useCallback } from "react";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import BaseModal from "../Modal/BaseModal";
import { useChangeLanguage } from "../../context/use[custom]/useChangeLng";
import SelectDropdown from "./SelectDropdown";
import { useTranslation } from "react-i18next";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ChangeLanguageModal = ({
  open,
  onClose,
  onSuccess,
}: IModalStatisticalDataLearningProps) => {
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
    onSuccess();
  }, [confirmSaveChange, onSuccess]);

  const renderActions = useCallback(() => {
    return (
      <Box mr={2} display="flex" justifyContent="flex-end" alignItems="center">
        <Button variant="contained" onClick={handleSaveChange}>
          {t("submit")}
        </Button>
      </Box>
    );
  }, [handleSaveChange, t]);

  const renderContent = useCallback(() => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        maxHeight="30rem"
        sx={{
          padding: 2,
          borderRadius: "12px",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#c1c1c1",
            borderRadius: "3px",
            "&:hover": {
              background: "#a8a8a8",
            },
          },
        }}
      >
        {/* Language Selection Box */}
        <Box
          sx={{
            padding: 2,
            borderRadius: "8px",
            border: "1px solid",
            borderColor: "grey.200",
            backgroundColor: "white",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              transform: "translateY(-1px)",
            },
          }}
        >
          <Typography
            component="p"
            variant="subtitle1"
            fontWeight="600"
            mb={1.5}
            color="primary.main"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {t("language")}
          </Typography>
          <SelectDropdown
            options={optionLanguage}
            value={pendingLang?.value || selectedLang?.value}
            onChange={handleLanguageSelect}
            sx={{ minWidth: 700 }}
          />
        </Box>

        {/* Currency Selection Box */}
        <Box
          sx={{
            padding: 2,
            borderRadius: "8px",
            border: "1px solid",
            borderColor: "grey.200",
            backgroundColor: "white",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              transform: "translateY(-1px)",
            },
          }}
        >
          <Typography
            component="p"
            variant="subtitle1"
            fontWeight="600"
            mb={1.5}
            color="primary.main"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {t("description")}
          </Typography>
          <SelectDropdown
            options={currencyOptions}
            value={pendingPayMoney?.value || selectedPayMoney?.value}
            onChange={handlePayMoneySelect}
          />
        </Box>

        {/* Visual Separator với hiệu ứng gradient */}
        <Box
          sx={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, grey.300, transparent)",
            my: 1,
            opacity: 0.6,
          }}
        />

        {/* Status Indicator */}
        <Box
          sx={{
            padding: 1.5,
            borderRadius: "6px",
            backgroundColor: "grey.50",
            border: "1px dashed",
            borderColor: "grey.300",
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              fontStyle: "italic",
            }}
          >
            {t("settingsWillApplyImmediately")}
          </Typography>
        </Box>
      </Box>
    );
  }, [
    selectedLang,
    currencyOptions,
    selectedPayMoney,
    optionLanguage,
    handlePayMoneySelect,
    handleLanguageSelect,
    t,
  ]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={"Language & Payment Setup"}
      Icon={PrivacyTipIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
      sx={{ maxWidth: "xs", width: "lg" }}
    />
  );
};

export default memo(ChangeLanguageModal);
