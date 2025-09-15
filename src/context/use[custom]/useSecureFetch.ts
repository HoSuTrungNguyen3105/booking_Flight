import { useCallback, useState } from "react";
import { useAuth } from "../AuthContext";
import { useToast } from "../ToastContext";
import { useFetch } from "./useFetch";
import type { ResponseMessage } from "../../utils/type";

export const useSecureFetch = <T extends Partial<ResponseMessage>, P>(
  options: any
) => {
  const { requirePassword, ...fetchOptions } = options;
  const fetch = useFetch<T, P>(fetchOptions);
  const toast = useToast();
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<{
    extra?: P;
    overrideUrl?: string;
  } | null>(null);

  const secureRefetch = useCallback(
    async (extra?: P, overrideUrl?: string): Promise<T | undefined> => {
      if (requirePassword) {
        setPendingRequest({ extra, overrideUrl });
        setOpenModalConfirm(true);
        return undefined;
      }
      return fetch.refetch(extra, overrideUrl);
    },
    [requirePassword, fetch.refetch]
  );

  const handlePasswordConfirm = useCallback(
    async (password: string) => {
      try {
        const isValid = await verifyPassword(password);
        if (isValid && pendingRequest) {
          await fetch.refetch(pendingRequest.extra, pendingRequest.overrideUrl);
        }
        setOpenModalConfirm(false);
        setPendingRequest(null);
      } catch (err) {
        toast("Mật khẩu không chính xác");
      }
    },
    [verifyPassword, pendingRequest, fetch.refetch, toast]
  );

  const handleCancelPassword = useCallback(() => {
    setOpenModalConfirm(false);
    setPendingRequest(null);
  }, []);

  return {
    ...fetch,
    refetch: secureRefetch,
    openModalConfirm,
    handlePasswordConfirm,
    handleCancelPassword,
  };
};
