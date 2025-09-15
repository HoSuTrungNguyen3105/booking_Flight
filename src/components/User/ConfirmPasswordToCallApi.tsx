import { Box, Button, Grid, Typography } from "@mui/material";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import InputTextField from "../../common/Input/InputTextField";
import BaseModal from "../../common/Modal/BaseModal";

interface ConfirmPasswordToCallApiProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (password: string, isValid: boolean) => void;
  responseCode: string; // Nhận response code từ bên ngoài
}

const ConfirmPasswordToCallApiModal = ({
  open,
  onClose,
  onSuccess,
  responseCode,
}: ConfirmPasswordToCallApiProps) => {
  const [passwordPrompt, setPasswordPrompt] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Theo dõi responseCode và cập nhật isValid
  useEffect(() => {
    if (responseCode === "00") {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [responseCode]);

  useEffect(() => {
    if (open) {
      setPasswordPrompt("");
      setError("");
    }
  }, [open]);

  const handleInputChange = useCallback((value: string) => {
    setPasswordPrompt(value);
    setError(""); // Clear error khi user bắt đầu nhập
  }, []);

  const handleSubmitPassword = useCallback(() => {
    // Truyền cả password và isValid ra ngoài
    onSuccess(passwordPrompt, isValid);
  }, [passwordPrompt, isValid, onSuccess]);

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="contained" onClick={handleSubmitPassword}>
          Submit
        </Button>
      </Box>
    );
  }, [handleSubmitPassword]);

  const renderContent = useCallback(() => {
    return (
      <Box maxHeight="30rem">
        <InputTextField
          onChange={handleInputChange}
          value={passwordPrompt}
          type="password"
          placeholder="Nhập mật khẩu"
          error={!!error}
        />
        {/* Hiển thị thông báo nếu mật khẩu hợp lệ */}
        {isValid && (
          <Typography color="success.main" sx={{ mt: 1 }}>
            Mật khẩu chính xác!
          </Typography>
        )}
      </Box>
    );
  }, [passwordPrompt, error, handleInputChange, isValid]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`원본 데이터, 통계 데이터 학습 Seq 상세 정보`}
      subtitle="-선택된 원본 데이터의 상세 정보를 확인합니다.-"
      Icon={PrivacyTipIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(ConfirmPasswordToCallApiModal);
