import { useCallback, useState } from "react";
import type { UserData } from "../../../utils/type";
import { useToast } from "../../../context/ToastContext";
import { useAccountLock } from "../../../context/Api/usePostApi";
import { useTranslation } from "react-i18next";

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
  const [error, _] = useState("");
  const { refetchAccountLock } = useAccountLock();
  const [formData] = useState<{ id?: number }>({
    id: user?.id,
  });

  const { t } = useTranslation();

  const isLocked = user?.accountLockYn === "Y";

  const title = isLocked ? t("unlockTitle") : t("lockTitle");
  const subtitle = isLocked ? t("unlockSubtitle") : t("lockSubtitle");
  const buttonTitle = isLocked ? t("unlockButton") : t("lockButton");
  const toast = useToast();

  const handleLockAccount = useCallback(async () => {
    try {
      const params: ILockAccountProps = {
        id: user?.id,
        accountLockYn: isLocked ? "N" : "Y",
      };

      const result = await refetchAccountLock(params);

      if (result?.resultCode === "00") {
        toast(result.resultMessage, "success");
        onClose();
        onSuccess();
      } else {
        toast(result?.resultMessage || t("error"), "error");
      }
    } catch (error) {
      console.error("Error locking/unlocking account:", error);
    }
  }, [isLocked, user, onSuccess, onClose, t]);

  return {
    formData,
    handleLockAccount,
    error,
    title,
    buttonTitle,
    subtitle,
  } as const;
};
