import { Box, Button, Divider, Typography } from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import LockResetIcon from "@mui/icons-material/LockReset";
import type { UserData } from "../../../utils/type";
import BaseModal from "../../Modal/BaseModal";
import theme from "../../../scss/theme";
import { useResetPassword } from "../../../context/Api/usePostApi";
import { useRandomPassword } from "../../../context/Api/useGetApi";
import InputTextField from "../../Input/InputTextField";
import { useToast } from "../../../context/ToastContext";

interface IResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: UserData;
}

const ResetPasswordModal = ({
  open,
  onClose,
  onSuccess,
  user,
}: IResetPasswordModalProps) => {
  const { refetchResetPassword } = useResetPassword();
  const [newPassword, setNewPassword] = useState<string>("");
  //   const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { refetchUserPw } = useRandomPassword();
  const toast = useToast();

  useEffect(() => {
    const generatePassword = async () => {
      const password = await refetchUserPw();
      if (password?.resultCode === "00" && password?.data) {
        setNewPassword(password?.data);
      }
    };

    generatePassword();
  }, []);

  const onResetPassword = useCallback(async () => {
    if (user?.id) {
      const res = await await refetchResetPassword({
        userId: user.id,
        tempPassword: newPassword,
      });
      toast(res?.resultMessage || "Reset password thành công!", "success");
      onSuccess();
      onClose();
      setNewPassword("");
    }
  }, [user?.id, newPassword, onSuccess, onClose, refetchResetPassword, toast]);

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button
          variant="contained"
          sx={{ backgroundColor: theme.palette.primary.main }}
          onClick={onResetPassword}
        >
          Reset
        </Button>
      </Box>
    );
  }, [onResetPassword]);

  const renderContent = useCallback(() => {
    return (
      <>
        <Typography>Temp password</Typography>
        <Divider sx={{ mb: 2, marginTop: 0, marginBottom: "22px" }} />
        <Typography variant="body1" sx={{ mb: 2 }}>
          Nhập mật khẩu mới cho tài khoản <strong>{user?.employeeNo}</strong>.
        </Typography>
        <InputTextField
          type="password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e)}
          sx={{ mb: 2 }}
          canCopy
          readOnly
          showEyeIcon
        />
      </>
    );
  }, [newPassword, user?.id]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Reset Password"
      Icon={LockResetIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(ResetPasswordModal);
