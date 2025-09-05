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
    optionPayMoney,
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
      <Box display="flex" flexDirection="column" gap={3} maxHeight="30rem">
        <Box>
          <Typography component="p" variant="body2" fontWeight="bold" mb={1}>
            {t("language")}
          </Typography>
          <SelectDropdown
            options={optionLanguage}
            value={pendingLang?.value || selectedLang?.value}
            onChange={handleLanguageSelect}
          />
        </Box>

        <Box>
          <Typography component="p" variant="body2" fontWeight="bold" mb={1}>
            {t("description")}
          </Typography>
          <SelectDropdown
            options={optionPayMoney}
            value={pendingPayMoney?.value || selectedPayMoney?.value}
            onChange={handlePayMoneySelect}
          />
        </Box>
      </Box>
    );
  }, [
    selectedLang,
    optionPayMoney,
    selectedPayMoney,
    optionLanguage,
    handlePayMoneySelect,
    handleLanguageSelect,
  ]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={"Language & Payment Setup"}
      subtitle="-"
      Icon={PrivacyTipIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(ChangeLanguageModal);
