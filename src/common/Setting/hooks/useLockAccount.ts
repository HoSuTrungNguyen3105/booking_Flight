import { useCallback, useState } from "react";
import type { UserData } from "../../../utils/type";
import { useToast } from "../../../context/ToastContext";
import { useAccountLock } from "../../../components/Api/usePostApi";

interface ILockAccountModalProps {
  onClose: () => void;
  onSuccess: () => void;
  user?: UserData;
}
interface ILockAccountProps {
  id?: number;
  accountLockYn: string;
}

export const useLockAccount = ({
  onClose,
  onSuccess,
  user,
}: ILockAccountModalProps) => {
  //   const api = useApis();
  const [error, _] = useState("");
  const { refetchAccountLock } = useAccountLock();
  const [formData, setFormData] = useState<{ id?: number }>({
    id: user?.id,
  });

  const isLocked = user?.accountLockYn === "Y";
  const title = isLocked ? "계정 잠금 해제" : "계정 잠금";
  const subtitle = isLocked
    ? "아래의 사용자의 계정의 잠금 상태를 해제합니다."
    : "아래의 사용자의 계정을 잠금 상태로 만듭니다.";
  const buttonTitle = isLocked ? "해제" : "잠금";
  const toast = useToast();

  const handleLockAccount = useCallback(async () => {
    try {
      const params: ILockAccountProps = {
        id: user?.id,
        accountLockYn: isLocked ? "N" : "Y",
      };

      const result = await refetchAccountLock(params);

      if (result?.resultCode === "00") {
        const message = isLocked
          ? "사용자 잠금해제가 정상적으로 완료되었습니다."
          : "사용자 잠금이 정상적으로 완료되었습니다.";
        toast(`${message}`, "success");
        onClose();
        onSuccess();
      } else {
        toast(`${result?.resultMessage}`, "error");
      }
    } catch (error) {
      console.error("Error locking/unlocking account:", error);
    }
  }, [isLocked, user, onSuccess, onClose]);

  return {
    formData,
    handleLockAccount,
    error,
    title,
    buttonTitle,
    subtitle,
  } as const;
};
