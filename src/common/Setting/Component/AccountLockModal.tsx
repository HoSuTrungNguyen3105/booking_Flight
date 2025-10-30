import { Box, Button } from "@mui/material";
import { memo, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useToast } from "../../../context/ToastContext";
import {
  useAccountLock,
  type ILockAccountProps,
} from "../../../context/Api/usePostApi";
import { useTranslation } from "react-i18next";
import type { UserData } from "../../../utils/type";
import BaseModal from "../../Modal/BaseModal";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: UserData;
}

const AccountLockModal = ({
  open,
  onClose,
  onSuccess,
  user,
}: IModalStatisticalDataLearningProps) => {
  const { refetchAccountLock } = useAccountLock();

  const { t } = useTranslation();

  const isLocked = user?.accountLockYn === "Y";

  const title = isLocked ? t("unlockTitle") : t("lockTitle");
  const subtitle = isLocked ? t("unlockSubtitle") : t("lockSubtitle");
  const buttonTitle = isLocked ? t("unlockButton") : t("lockButton");
  const toast = useToast();

  const handleLockAccount = useCallback(async () => {
    try {
      const params: ILockAccountProps = {
        id: user?.id,
        accountLockYn: isLocked ? "N" : "Y",
      };

      const result = await refetchAccountLock(params);

      if (result?.resultCode === "00") {
        toast(result.resultMessage, "success");
        onClose();
        onSuccess();
      } else {
        toast(result?.resultMessage || t("error"), "error");
      }
    } catch (error) {
      console.error("Error locking/unlocking account:", error);
    }
  }, [isLocked, user, onSuccess, onClose, t]);

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="outlined" onClick={handleLockAccount}>
          {buttonTitle}
        </Button>
      </Box>
    );
  }, [buttonTitle, handleLockAccount]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      Icon={AddIcon}
      slots={{ actions: renderActions() }}
    />
  );
};

export default memo(AccountLockModal);
