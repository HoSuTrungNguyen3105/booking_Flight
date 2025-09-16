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

  const { isValid, verifyPassword, resetValidation } = useAuth();
  const toast = useToast();
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<{
    extra?: P;
    overrideUrl?: string;
  } | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [latestData, setLatestData] = useState<T | null>(null);
  const isValidRef = useRef(isValid);

  useEffect(() => {
    isValidRef.current = isValid;
  }, [isValid]);

  const secureRefetch = useCallback(
    async (extra?: P, overrideUrl?: string): Promise<T | undefined> => {
      console.log("📞 secureRefetch called, isValid:", isValidRef.current);

      if (!requirePassword || isValidRef.current) {
        const result = await fetch.refetch(extra, overrideUrl);
        setLatestData(result || null); // Lưu data mới
        return result;
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
        const isValid = await verifyPassword(password);

        if (isValid) {
          setRefreshFlag((prev) => prev + 1);
          setOpenModalConfirm(false);

          if (pendingRequest) {
            const result = await fetch.refetch(
              pendingRequest.extra,
              pendingRequest.overrideUrl
            );

            setPendingRequest(null);
            setLatestData(result || null); // QUAN TRỌNG: Lưu data mới
            toast("Xác thực thành công", "success");
            return result as DetailResponseMessage<any>;
          }

          return {
            resultCode: "00",
            resultMessage: "Xác thực thành công",
            data: pendingRequest,
          };
        } else {
          toast("Mật khẩu không chính xác", "error");
          return {
            resultCode: "01",
            resultMessage: "Mật khẩu không chính xác",
          };
        }
      } catch (error) {
        console.error("❌ Password verification error:", error);
        toast("Lỗi xác thực", "error");
        return { resultCode: "99", resultMessage: "Lỗi xác thực" };
      }
    },
    [verifyPassword, pendingRequest, fetch.refetch, toast]
  );

  return {
    ...fetch,
    data: latestData || fetch.data, // Ưu tiên dùng latestData
    refetch: secureRefetch,
    openModalConfirm,
    handlePasswordConfirm,
    refreshFlag,
    isValid,
    latestData,
  };
};
