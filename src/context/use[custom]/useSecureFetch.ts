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

            if (result) {
              return result as DetailResponseMessage<any>;
            }
          }

          return { resultCode: "00", resultMessage: "Xác thực thành công" };
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

  // const handlePasswordConfirm = useCallback(
  //   async (password: string): Promise<DetailResponseMessage<any>> => {
  //     console.log("🔐 Verifying password:", password);

  //     try {
  //       const isValid = await verifyPassword(password);
  //       console.log("✅ Password verification result:", isValid);

  //       if (isValid) {
  //         setRefreshFlag((prev) => prev + 1);
  //         setOpenModalConfirm(false);

  //         if (pendingRequest) {
  //           console.log(
  //             "🚀 Calling pending API after successful authentication"
  //           );
  //           console.log("📦 Pending request:", pendingRequest);

  //           // GỌI API VÀ TRẢ VỀ RESPONSE TRỰC TIẾP, KHÔNG WRAP LẠI
  //           const result = await fetch.refetch(
  //             pendingRequest.extra,
  //             pendingRequest.overrideUrl
  //           );

  //           console.log("📊 API Result:", result); // DEBUG: xem result có gì

  //           setPendingRequest(null);
  //           toast("Xác thực thành công", "success");

  //           // TRẢ VỀ RESPONSE TỪ API GỐC, KHÔNG TẠO RESPONSE MỚI
  //           if (result) {
  //             console.log("✅ Returning API result with data:", result);
  //             return result as DetailResponseMessage<any>;
  //           } else {
  //             console.warn("⚠️ API result is null or undefined");
  //           }
  //         }

  //         return { resultCode: "00", resultMessage: "Xác thực thành công" };
  //       } else {
  //         toast("Mật khẩu không chính xác", "error");
  //         return {
  //           resultCode: "01",
  //           resultMessage: "Mật khẩu không chính xác",
  //         };
  //       }
  //     } catch (error) {
  //       console.error("❌ Password verification error:", error);
  //       toast("Lỗi xác thực", "error");
  //       return { resultCode: "99", resultMessage: "Lỗi xác thực" };
  //     }
  //   },
  //   [verifyPassword, pendingRequest, fetch.refetch, toast]
  // );

  // const handlePasswordConfirm = useCallback(
  //   async (password: string): Promise<DetailResponseMessage<any>> => {
  //     console.log("🔐 Verifying password:", password);

  //     try {
  //       const isValid = await verifyPassword(password);
  //       console.log("✅ Password verification result:", isValid);

  //       if (isValid) {
  //         // CẬP NHẬT QUAN TRỌNG: Trigger re-render
  //         setRefreshFlag((prev) => prev + 1);

  //         setOpenModalConfirm(false);

  //         if (pendingRequest) {
  //           console.log(
  //             "🚀 Calling pending API after successful authentication"
  //           );
  //           const result = await fetch.refetch(
  //             pendingRequest.extra,
  //             pendingRequest.overrideUrl
  //           );

  //           setPendingRequest(null);
  //           toast("Xác thực thành công", "success");

  //           return {
  //             resultCode: "00",
  //             resultMessage: "Xác thực thành công",
  //             data: result,
  //           };
  //         }

  //         return { resultCode: "00", resultMessage: "Xác thực thành công" };
  //       } else {
  //         toast("Mật khẩu không chính xác", "error");
  //         return {
  //           resultCode: "01",
  //           resultMessage: "Mật khẩu không chính xác",
  //         };
  //       }
  //     } catch (error) {
  //       console.error("❌ Password verification error:", error);
  //       toast("Lỗi xác thực", "error");
  //       return { resultCode: "99", resultMessage: "Lỗi xác thực" };
  //     }
  //   },
  //   [verifyPassword, pendingRequest, fetch.refetch, toast]
  // );

  // useSecureFetch hook - sửa phần handlePasswordConfirm
  // const handlePasswordConfirm = useCallback(
  //   async (password: string): Promise<DetailResponseMessage<any>> => {
  //     console.log("🔐 Verifying password:", password);

  //     try {
  //       const isValid = await verifyPassword(password);
  //       console.log("✅ Password verification result:", isValid);

  //       if (isValid) {
  //         setRefreshFlag((prev) => prev + 1);
  //         setOpenModalConfirm(false);

  //         if (pendingRequest) {
  //           console.log(
  //             "🚀 Calling pending API after successful authentication"
  //           );

  //           // GỌI API VÀ TRẢ VỀ RESPONSE TRỰC TIẾP, KHÔNG WRAP LẠI
  //           const result = await fetch.refetch(
  //             pendingRequest.extra,
  //             pendingRequest.overrideUrl
  //           );

  //           setPendingRequest(null);
  //           toast("Xác thực thành công", "success");

  //           // TRẢ VỀ RESPONSE TỪ API GỐC, KHÔNG TẠO RESPONSE MỚI
  //           if (result) {
  //             return result as DetailResponseMessage<any>;
  //           }
  //         }

  //         return { resultCode: "00", resultMessage: "Xác thực thành công" };
  //       } else {
  //         toast("Mật khẩu không chính xác", "error");
  //         return {
  //           resultCode: "01",
  //           resultMessage: "Mật khẩu không chính xác",
  //         };
  //       }
  //     } catch (error) {
  //       console.error("❌ Password verification error:", error);
  //       toast("Lỗi xác thực", "error");
  //       return { resultCode: "99", resultMessage: "Lỗi xác thực" };
  //     }
  //   },
  //   [verifyPassword, pendingRequest, fetch.refetch, toast]
  // );

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
