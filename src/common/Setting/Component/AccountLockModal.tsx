import { Box, Button, CircularProgress } from "@mui/material";
import { memo, useCallback, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useToast } from "../../../context/ToastContext";
import { useTranslation } from "react-i18next";
import type { UserData } from "../../../utils/type";
import BaseModal from "../../Modal/BaseModal";
import { ResponseCode } from "../../../utils/response";
import {
  useAccountLock,
  type ILockAccountProps,
} from "../../../context/Api/UserApi";

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
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const isLocked = user?.accountLockYn === "Y";
  const title = isLocked ? t("unlockTitle") : t("lockTitle");
  const subtitle = isLocked ? t("unlockSubtitle") : t("lockSubtitle");
  const buttonTitle = isLocked ? t("unlockButton") : t("lockButton");

  const handleLockAccount = useCallback(async () => {
    try {
      setLoading(true);
      const params: ILockAccountProps = {
        id: user?.id,
        accountLockYn: isLocked ? "N" : "Y",
      };

      const result = await refetchAccountLock(params);

      if (result?.resultCode === ResponseCode.SUCCESS) {
        toast(result.resultMessage, "success");
        onClose();
        onSuccess();
      } else {
        toast(result?.resultMessage || t("error"), "error");
      }
    } catch (error) {
      console.error("Error locking/unlocking account:", error);
      toast(t("error"), "error");
    } finally {
      setLoading(false);
    }
  }, [isLocked, user, onSuccess, onClose, t]);

  const renderActions = useCallback(() => {
    return (
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        gap={1.5}
        sx={{ mt: 1 }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 2.5,
            "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
          }}
        >
          {t("cancel")}
        </Button>

        <Button
          onClick={handleLockAccount}
          variant="contained"
          color={isLocked ? "success" : "error"}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 2.5,
            fontWeight: 600,
            transition: "all 0.25s ease",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: 4,
            },
          }}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <AddIcon />
            )
          }
        >
          {buttonTitle}
        </Button>
      </Box>
    );
  }, [buttonTitle, handleLockAccount, isLocked, loading, onClose, t]);

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
