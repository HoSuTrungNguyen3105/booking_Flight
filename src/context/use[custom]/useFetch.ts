import type { AxiosRequestConfig } from "axios";
import { useApi } from "../../context/ApiContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MethodType } from "../../utils/type";
import { useAuth } from "../AuthContext";
import { useToast } from "../ToastContext";

type ResponseMessage = {
  resultCode?: string;
  resultMessage?: string;
};

type TUseFetch<T, P> = {
  url: string;
  params?: P;
  config?: AxiosRequestConfig;
  defaultValue?: T;
  autoFetch?: boolean;
  onSuccess?: (res?: T) => void;
  onError?: () => void;
  requirePassword?: boolean;
};

export const useFetch = <T extends Partial<ResponseMessage>, P>({
  url,
  params,
  config,
  defaultValue,
  autoFetch,
  requirePassword,
  onSuccess,
  onError,
}: TUseFetch<T, P>) => {
  const { get, post, delete: del, update } = useApi();
  // const { user, verifyPassword } = useAuth();
  const toast = useToast();
  const [data, setData] = useState<T | undefined>(defaultValue);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [currentParams, setCurrentParams] = useState<P | undefined>(params);
  const abortController = useRef<AbortController | null>(null);

  const promptForPassword = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      // Hiển thị dialog nhập mật khẩu (có thể implement bằng modal)
      const password = prompt("Vui lòng nhập mật khẩu của bạn để xác thực:");
      resolve(password);
    });
  }, []);

  const refetch = useCallback(
    async (extra?: P, overrideUrl?: string): Promise<T | undefined> => {
      if (abortController.current) {
        abortController.current.abort();
      }
      // Xác thực mật khẩu nếu required
      if (requirePassword) {
        // const password = await promptForPassword();
        // if (!password) {
        //   setError(true);
        //   onError?.();
        //   return undefined;
        // }

        // // Verify password
        // const isValid = await verifyPassword(password);
        // if (!isValid) {
        //   setError(true);
        //   alert("Mật khẩu không chính xác");
        //   onError?.();
        //   return undefined;
        // }
        toast("Mật khẩu không chính xác", "error");
        return undefined;
      }
      abortController.current = new AbortController();
      setLoading(true);
      const finalUrl = overrideUrl ?? url;
      const method = config?.method?.toUpperCase();
      const controller = abortController.current;
      const finalConfig = {
        ...config,
        signal: controller?.signal,
      };
      try {
        const fetchMethod =
          method === MethodType.POST
            ? post<T, P>(finalUrl, extra ?? currentParams, finalConfig)
            : method === MethodType.PUT || method === MethodType.PATCH
            ? update<T, P>(finalUrl, extra ?? currentParams, finalConfig)
            : method === MethodType.DELETE
            ? del<T>(finalUrl, extra ?? finalConfig)
            : get<T, P>(finalUrl, extra ?? currentParams, finalConfig);

        const res = await fetchMethod;
        setData(res);
        setSuccess(true);
        onSuccess?.(res);
        return res;
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(true);
        onError?.();
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [url, params, config, onSuccess, onError]
  );

  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [fetch, autoFetch]);

  const state = useMemo(
    () => ({
      data,
      loading,
      success,
      error,
      refetch,
      setParams: setCurrentParams,
    }),
    [data, loading, success, error, refetch, setCurrentParams]
  );
  return state;
};
