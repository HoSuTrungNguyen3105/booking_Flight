import React, { useCallback, useState } from "react";
import InputTextField from "../../common/Input/InputTextField";
import { Button } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const ConfirmPasswordToCallApi = () => {
  const { user, verifyPassword } = useAuth();
  const toast = useToast();
  const [passwordPrompt, setPasswordPrompt] = useState("");

  const [error, setError] = useState(false);
  //   const promptForPassword = useCallback((): Promise<string | null> => {
  //     return new Promise((resolve) => {
  //       // Hiển thị dialog nhập mật khẩu (có thể implement bằng modal)
  //       const password = prompt("Vui lòng nhập mật khẩu của bạn để xác thực:");
  //       resolve(password);
  //     });
  //   }, []);
  const handleConfirm = useCallback(async () => {
    // const password = await promptForPassword();
    // if (!password) {
    //   setError(true);
    //   return undefined;
    // }

    // Verify password
    const isValid = await verifyPassword(passwordPrompt);
    console.log("res", isValid);
    if (isValid) {
      setError(true);
      toast("Mật khẩu không chính xác", "error");
      return undefined;
    }
  }, []);
  return (
    <>
      <InputTextField value={passwordPrompt} />
      <Button onClick={handleConfirm} />
    </>
  );
};

export default ConfirmPasswordToCallApi;
