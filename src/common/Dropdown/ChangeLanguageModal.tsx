import { Box, Button, Typography } from "@mui/material";
import { memo, useCallback } from "react";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import BaseModal from "../Modal/BaseModal";
import { useChangeLanguage } from "../../context/use[custom]/useChangeLng";
import SelectDropdown from "./SelectDropdown";
import { useTranslation } from "react-i18next";
import { Language } from "@mui/icons-material";

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
      <Box display="flex" flexDirection="column">
        {/* Language Selection Box */}
        <Box
          sx={{
            borderRadius: "8px",
            border: "1px solid",
            borderColor: "grey.200",
            backgroundColor: "white",
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5} mb={2.5}>
            <Language
              sx={{
                color: "primary.main",
                fontSize: 24,
              }}
            />
            <Typography variant="h6" fontWeight="600" color="text.primary">
              {t("language")}
            </Typography>
          </Box>
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
            borderRadius: "8px",
            border: "1px solid",
            borderColor: "grey.200",
            backgroundColor: "white",
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
            {t("title")}
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
      sx={{ maxWidth: "50rem" }}
    />
  );
};

export default memo(ChangeLanguageModal);
