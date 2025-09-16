import { Box, Button, Typography } from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import InputTextField from "../../common/Input/InputTextField";
import BaseModal from "../../common/Modal/BaseModal";
import type { DetailResponseMessage, ResponseMessage } from "../../utils/type";

interface ConfirmPasswordToCallApiProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (password: string) => Promise<DetailResponseMessage>;
  onValidPassword?: () => void; // Đổi thành optional
  isLoading?: boolean;
  hasPendingRequest?: boolean; // Thêm prop mới để biết có pending request
}

const ConfirmPasswordToCallApiModal = ({
  open,
  onClose,
  onSuccess,
  onValidPassword,
  isLoading: externalLoading = false,
  hasPendingRequest = false, // Nhận thông tin về pending request
}: ConfirmPasswordToCallApiProps) => {
  const [passwordPrompt, setPasswordPrompt] = useState("");
  const [error, setError] = useState("");
  const [internalLoading, setInternalLoading] = useState(false);

  // Kết hợp internal và external loading
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
      console.log("Modal response:", response);

      if (response.resultCode === "00") {
        // PHÂN BIỆT BẰNG CÁCH KIỂM TRA CÓ DATA HAY KHÔNG
        if (response.data) {
          // Có data -> đây là kết quả từ API search
          console.log("✅ API result with data, calling onValidPassword");
          onValidPassword?.();
        } else {
          // Không có data -> đây là response xác thực thành công
          console.log("✅ Auth success, closing modal");
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
  }, [passwordPrompt, onSuccess, onValidPassword, onClose]);

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
        <Button variant="outlined" onClick={handleClose} disabled={isLoading}>
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
