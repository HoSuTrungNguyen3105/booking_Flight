import { defer } from "lodash";
import { useCallback, useMemo, useRef, useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { useChangePassword } from "../../Api/usePostApi";

interface IUseSettingPasswordProps {
  userId: number;
  successMessage: string;
  onSuccess: () => void;
}

export const useSettingPassword = ({
  userId,
  successMessage,
  onSuccess,
}: IUseSettingPasswordProps) => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>("");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const enabledBtn = useMemo(
    () =>
      Object.values(formData).every(Boolean) &&
      !errorPassword &&
      !errorConfirmPassword,
    [formData, errorPassword, errorConfirmPassword]
  );

  const handleChangeFormData = useCallback(
    (key: keyof typeof formData, val: string) => {
      setFormData((prev) => ({ ...prev, [key]: val }));
      setErrorPassword("");
      setErrorConfirmPassword("");
    },
    []
  );

  const handleUpdateError = useCallback(
    (error: string, focusField: "password" | "confirmPassword") => {
      if (focusField === "password") {
        setErrorPassword(error);
        defer(() => passwordRef.current?.focus());
      } else {
        setErrorConfirmPassword(error);
        defer(() => confirmPasswordRef.current?.focus());
      }
    },
    []
  );

  [formData, handleUpdateError, onSuccess, successMessage, userId];

  return {
    formData,
    errorPassword,
    errorConfirmPassword,
    passwordRef,
    confirmPasswordRef,
    enabledBtn,
    onChangeFormData: handleChangeFormData,
  } as const;
};
