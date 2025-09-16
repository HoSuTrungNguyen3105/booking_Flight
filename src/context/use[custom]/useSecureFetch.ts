import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../AuthContext";
import { useToast } from "../ToastContext";
import { useFetch } from "./useFetch";
import type { DetailResponseMessage, ResponseMessage } from "../../utils/type";
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
  const { isValid, verifyPassword, resetValidation } = useAuth();
  const toast = useToast();

  const fetch = useFetch<T, P>({
    ...fetchOptions,
    onSuccess: (res) => {
      onSuccess?.(res);
      if (resetAfterSuccess && res?.resultCode === "00") {
        resetValidation();
      }
    },
    onError: () => {
      onError?.();
    },
  });

  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<{
    extra?: P;
    overrideUrl?: string;
  } | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(isValid);
  const isValidRef = useRef(isValid);

  useEffect(() => {
    isValidRef.current = isValid;
    setIsAuthenticated(isValid);
  }, [isValid]);

  const secureRefetch = useCallback(
    async (extra?: P, overrideUrl?: string): Promise<T | undefined> => {
      if (!requirePassword || isValidRef.current) {
        return await fetch.refetch(extra, overrideUrl);
      }
      if (requirePassword && !isValidRef.current) {
        setPendingRequest({ extra, overrideUrl });
        setOpenModalConfirm(true);
        return undefined;
      }
    },
    [requirePassword, fetch.refetch]
  );

  const handlePasswordConfirm = useCallback(
    async (password: string): Promise<DetailResponseMessage<any>> => {
      try {
        const isValidResult = await verifyPassword(password);

        if (isValidResult) {
          isValidRef.current = true;
          setIsAuthenticated(true);
          setOpenModalConfirm(false);
          if (pendingRequest) {
            const result = await fetch.refetch(
              pendingRequest.extra,
              pendingRequest.overrideUrl
            );
            setPendingRequest(null);
            if (result) {
              return result as DetailResponseMessage<any>;
            }
          }

          return { resultCode: "00", resultMessage: "Xác thực thành công" };
        } else {
          return {
            resultCode: "01",
            resultMessage: "Mật khẩu không chính xác",
          };
        }
      } catch (error) {
        console.error("❌ Password verification error:", error);
        return { resultCode: "99", resultMessage: "Lỗi xác thực" };
      }
    },
    [verifyPassword, pendingRequest, fetch.refetch, toast]
  );

  const retryPendingRequest = useCallback(async (): Promise<T | undefined> => {
    if (pendingRequest && isValidRef.current) {
      const result = await fetch.refetch(
        pendingRequest.extra,
        pendingRequest.overrideUrl
      );
      setPendingRequest(null);
      return result;
    }
    return undefined;
  }, [pendingRequest, fetch.refetch]);

  const handleCancelPassword = useCallback(() => {
    setOpenModalConfirm(false);
    setPendingRequest(null);
    toast("Đã hủy xác thực", "info");
  }, [toast]);

  const handleCloseConfirmPassword = useCallback(() => {
    setOpenModalConfirm(false);
    setPendingRequest(null);
  }, []);

  const resetAuthValidation = useCallback(() => {
    resetValidation();
    setIsAuthenticated(false);
    isValidRef.current = false;
  }, [resetValidation]);

  return {
    ...fetch,
    refetch: secureRefetch,
    openModalConfirm,
    handlePasswordConfirm,
    handleCloseConfirmPassword,
    handleCancelPassword,
    resetAuthValidation,
    retryPendingRequest,
    isValid: isAuthenticated,
    hasPendingRequest: !!pendingRequest,
  };
};
