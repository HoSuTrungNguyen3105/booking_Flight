// import React, { useCallback, useState } from "react";
// import InputTextField from "../../common/Input/InputTextField";
// import { Button } from "@mui/material";
// import { useAuth } from "../../context/AuthContext";
// import { useToast } from "../../context/ToastContext";

// const ConfirmPasswordToCallApi = () => {
//   const { user, verifyPassword } = useAuth();
//   const toast = useToast();
//   const [passwordPrompt, setPasswordPrompt] = useState("");

//   const [error, setError] = useState(false);
//   //   const promptForPassword = useCallback((): Promise<string | null> => {
//   //     return new Promise((resolve) => {
//   //       // Hiển thị dialog nhập mật khẩu (có thể implement bằng modal)
//   //       const password = prompt("Vui lòng nhập mật khẩu của bạn để xác thực:");
//   //       resolve(password);
//   //     });
//   //   }, []);
//   const handleConfirm = useCallback(async () => {
//     // const password = await promptForPassword();
//     // if (!password) {
//     //   setError(true);
//     //   return undefined;
//     // }

//     // Verify password
//     const isValid = await verifyPassword(passwordPrompt);
//     console.log("res", isValid);
//     if (isValid) {
//       setError(true);
//       toast("Mật khẩu không chính xác", "error");
//       return undefined;
//     }
//   }, []);
//   return (
//     <>
//       <InputTextField value={passwordPrompt} />
//       <Button onClick={handleConfirm} />
//     </>
//   );
// };

// export default ConfirmPasswordToCallApi;

import { Box, Button, Grid, Typography } from "@mui/material";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import { useAuth } from "../../context/AuthContext";
import InputTextField from "../../common/Input/InputTextField";
import BaseModal from "../../common/Modal/BaseModal";

interface ConfirmPasswordToCallApiProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (password: string) => void;
}

const ConfirmPasswordToCallApiModal = ({
  open,
  onClose,
  onSuccess,
}: ConfirmPasswordToCallApiProps) => {
  const [passwordPrompt, setPasswordPrompt] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setPasswordPrompt("");
    }
  }, [open]);

  const handleInputChange = useCallback((value: string) => {
    setPasswordPrompt(value);
    setError(""); // Clear error khi user bắt đầu nhập
  }, []);

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="contained" onClick={() => onSuccess(passwordPrompt)}>
          Submit
        </Button>
      </Box>
    );
  }, []);

  const renderContent = useCallback(() => {
    return (
      <Box maxHeight="30rem">
        <InputTextField
          onChange={handleInputChange} // Đúng cách: truyền hàm, không gọi hàm
          value={passwordPrompt}
          type="password"
          placeholder="Nhập mật khẩu"
          error={!!error}
        />
      </Box>
    );
  }, [passwordPrompt, error, handleInputChange]);

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
