import { Box, Button, Typography } from "@mui/material";
import { memo, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import type { UserData } from "../../../utils/type";
import BaseModal from "../../Modal/BaseModal";
import { useToast } from "../../../context/ToastContext";
import { useDisabledMFALogin } from "../../../context/Api/usePostApi";
import { ResponseCode } from "../../../utils/response";

interface IDisableMFALoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: UserData;
}

const DisableMFALoginModal = ({
  open,
  onClose,
  onSuccess,
  user,
}: IDisableMFALoginModalProps) => {
  const isMfaEnabledYn = user?.mfaEnabledYn !== "Y";
  const toast = useToast();
  const { refetchDisabledMFALogin } = useDisabledMFALogin();

  const handleLockAccount = useCallback(async () => {
    if (!user?.id) {
      return toast("No id");
    }
    try {
      const params: { userId: number } = {
        userId: user?.id,
      };

      const result = await refetchDisabledMFALogin(params);

      if (result?.resultCode === ResponseCode.SUCCESS) {
        toast(result.resultMessage, "success");
        onClose();
        onSuccess();
      } else {
        toast(result?.resultMessage || "Error result", "error");
      }
    } catch (error) {
      console.error("Error locking/unlocking account:", error);
    }
  }, [user, onSuccess, onClose]);

  if (isMfaEnabledYn) {
    return <Typography variant="caption">Has not enable mfa</Typography>;
  }

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="outlined" onClick={handleLockAccount}>
          Submit
        </Button>
      </Box>
    );
  }, [handleLockAccount]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={"Disabled MFA Login"}
      Icon={AddIcon}
      slots={{ actions: renderActions() }}
    />
  );
};

export default memo(DisableMFALoginModal);
