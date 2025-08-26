import { defer } from "lodash";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { getMessage, ResponseCode } from "../../../utils/response";
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
  //   const apis = useApis();

  //   const { mutateAsync: updateUserPW, isLoading } = useMutation(
  //     (payload: IUpdUserPwReq) => apis.common.updateUserPW(payload),
  //   );

  const toast = useToast();
  // const { refetchLogin } = useLoginUser();
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const { refetchChangePassword } = useChangePassword();
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        const result = await refetchChangePassword({
          userId,
          newPassword: formData.password,
        });

        switch (result) {
          case ResponseCode.SUCCESS:
            toast(successMessage, "success");
            onSuccess();
            break;
          case ResponseCode.INVALID_PASSWORD_FORMAT:
            handleUpdateError(
              "비밀번호 설정 규칙에 맞지 않습니다.",
              "password"
            );
            break;
          case ResponseCode.LOGIN_FAILED_ACCOUNT_LOCKED:
            handleUpdateError(
              "비밀번호 값이 동일하지 않습니다.",
              "confirmPassword"
            );
            break;
          case ResponseCode.UNKNOWN:
            handleUpdateError(
              "현재 또는 직전에 사용한 패스워드는 다시 사용할 수 없습니다.",
              "password"
            );
            break;
          default:
            handleUpdateError(
              getMessage(result?.resultMessage as string),
              "password"
            );
            break;
        }
      } catch (err) {
        handleUpdateError(getMessage(ResponseCode.UNKNOWN), "password");
      }
    },
    [formData, handleUpdateError, onSuccess, successMessage, userId]
  );

  return {
    formData,
    errorPassword,
    errorConfirmPassword,
    passwordRef,
    confirmPasswordRef,
    enabledBtn,
    onChangeFormData: handleChangeFormData,
    onSubmit: handleSubmit,
  } as const;
};
