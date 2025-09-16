import { Box, Button, Typography } from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import InputTextField from "../../common/Input/InputTextField";
import BaseModal from "../../common/Modal/BaseModal";
import type { DetailResponseMessage } from "../../utils/type";

interface ConfirmPasswordToCallApiProps {
  open: boolean;
  onClose: () => void;
  onCancel: () => void;
  onSuccess: (password: string) => Promise<DetailResponseMessage<any>>;
  onValidPassword?: () => void;
  isLoading?: boolean;
  hasPendingRequest?: boolean;
}

const ConfirmPasswordToCallApiModal = ({
  open,
  onClose,
  onSuccess,
  onValidPassword,
  onCancel,
  isLoading: externalLoading = false,
  hasPendingRequest = false,
}: ConfirmPasswordToCallApiProps) => {
  const [passwordPrompt, setPasswordPrompt] = useState("");
  const [error, setError] = useState("");
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = internalLoading || externalLoading;

  useEffect(() => {
    if (open) {
      setPasswordPrompt("");
      setError("");
      setInternalLoading(false);
    }
  }, [open]);

  const handleInputChange = useCallback((value: string) => {
    setPasswordPrompt(value);
    setError("");
  }, []);

  const handleSubmitPassword = useCallback(async () => {
    if (!passwordPrompt) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }
    setInternalLoading(true);
    try {
      const response = await onSuccess(passwordPrompt);
      if (response.resultCode === "00") {
        if (hasPendingRequest) {
          onValidPassword?.();
        } else {
          onClose();
        }
      } else {
        setError(response.resultMessage || "Mật khẩu không chính xác");
      }
    } catch (error) {
      console.error("Password verification error:", error);
      setError("Đã xảy ra lỗi khi xác thực");
    } finally {
      setInternalLoading(false);
    }
  }, [passwordPrompt, onSuccess, onValidPassword, onClose, hasPendingRequest]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      onClose();
    }
  }, [isLoading, onClose]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && !isLoading && passwordPrompt) {
        handleSubmitPassword();
      }
    },
    [handleSubmitPassword, isLoading, passwordPrompt]
  );

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="outlined" onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmitPassword}
          disabled={isLoading || !passwordPrompt}
        >
          {isLoading ? "Đang xác thực..." : "Xác nhận"}
        </Button>
      </Box>
    );
  }, [handleSubmitPassword, isLoading, passwordPrompt, handleClose]);

  const renderContent = useCallback(() => {
    return (
      <Box maxHeight="30rem" onKeyPress={handleKeyPress}>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Vui lòng nhập mật khẩu để xác thực
        </Typography>
        <InputTextField
          onChange={handleInputChange}
          value={passwordPrompt}
          type="password"
          placeholder="Nhập mật khẩu"
          error={!!error}
          disabled={isLoading}
        />
        {isLoading && (
          <Typography
            variant="caption"
            sx={{ mt: 1, display: "block", color: "text.secondary" }}
          >
            Đang xác thực...
          </Typography>
        )}
        {hasPendingRequest && (
          <Typography
            variant="caption"
            sx={{ mt: 1, display: "block", color: "info.main" }}
          >
            Đang chờ xác thực để tiếp tục thao tác...
          </Typography>
        )}
      </Box>
    );
  }, [
    passwordPrompt,
    error,
    handleInputChange,
    isLoading,
    handleKeyPress,
    hasPendingRequest,
  ]);

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Xác thực mật khẩu"
      subtitle="Vui lòng nhập mật khẩu để tiếp tục"
      Icon={PrivacyTipIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(ConfirmPasswordToCallApiModal);
