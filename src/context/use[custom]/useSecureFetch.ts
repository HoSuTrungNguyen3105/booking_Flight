import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../AuthContext";
import { useToast } from "../ToastContext";
import { useFetch } from "./useFetch";
import type { ResponseMessage } from "../../utils/type";
import type { AxiosRequestConfig } from "axios";

type TUseSecureFetch<T, P> = {
  url: string;
  params?: P;
  config?: AxiosRequestConfig;
  defaultValue?: T;
  autoFetch?: boolean;
  onSuccess?: (res?: T) => void;
  onError?: () => void;
  requirePassword?: boolean;
  resetAfterSuccess?: boolean;
};

export const useSecureFetch = <T extends Partial<ResponseMessage>, P>({
  requirePassword,
  resetAfterSuccess = true,
  onSuccess,
  onError,
  ...fetchOptions
}: TUseSecureFetch<T, P>) => {
  const fetch = useFetch<T, P>({
    ...fetchOptions,
    onSuccess: (res) => {
      // Gọi onSuccess original
      onSuccess?.(res);

      // Reset validation nếu thành công và có flag
      if (resetAfterSuccess && res?.resultCode === "00") {
        resetValidation();
      }
    },
    onError: () => {
      onError?.();
    },
  });

  const { isValid, verifyPassword, resetValidation } = useAuth();
  const toast = useToast();
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<{
    extra?: P;
    overrideUrl?: string;
  } | null>(null);

  const isValidRef = useRef(isValid);

  // useEffect(() => {
  //   isValidRef.current = isValid;
  //   console.log("🔄 isValid updated in ref:", isValid);
  // }, [isValid]);

  const secureRefetch = useCallback(
    async (extra?: P, overrideUrl?: string): Promise<T | undefined> => {
      console.log("📞 secureRefetch called, isValid:", isValid);

      if (isValidRef.current) {
        console.log("✅ Đã xác thực, gọi API trực tiếp");
        return fetch.refetch(extra, overrideUrl);
      }

      if (requirePassword && !isValid) {
        console.log("🔐 Yêu cầu xác thực, mở modal");
        setPendingRequest({ extra, overrideUrl });
        setOpenModalConfirm(true);
        return undefined;
      }

      return fetch.refetch(extra, overrideUrl);
    },
    [requirePassword, isValid, fetch.refetch] // Giữ nguyên dependencies
  );

  const handlePasswordConfirm = useCallback(
    async (password: string) => {
      console.log("logpasw", password);
      const isValid = await verifyPassword(password);
      console.log("isValid", isValid);
      if (isValid) {
        setOpenModalConfirm(false);
      }
      if (isValid && pendingRequest) {
        // Gọi API sau khi xác thực thành công
        await fetch.refetch(pendingRequest.extra, pendingRequest.overrideUrl);
        // toast(res?.resultMessage as string, "info");
        // setOpenModalConfirm(false);
        setPendingRequest(null);
      }
    },
    [verifyPassword, pendingRequest, fetch.refetch]
  );

  const handleCancelPassword = useCallback(() => {
    setOpenModalConfirm(false);
    setPendingRequest(null);
    toast("Đã hủy xác thực", "info");
  }, [toast]);

  const resetAuthValidation = useCallback(() => {
    resetValidation();
  }, [resetValidation]);

  return {
    ...fetch,
    refetch: secureRefetch,
    openModalConfirm,
    handlePasswordConfirm,
    handleCancelPassword,
    resetAuthValidation,
    isValid,
    // loading: fetch.loading || authLoading,
  };
};
