import type { AxiosRequestConfig } from "axios";
import { useApi } from "../context/ApiContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MethodType } from "./type";
import { useToast } from "../context/ToastContext";
// import { toast } from "react-toastify";
type ToastMessage = {
  success?: string;
  error?: string;
};
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
  showToast?: boolean;
  message?: ToastMessage;
  onSuccess?: (res?: T) => void;
  onError?: () => void;
};
export const useFetch = <T extends Partial<ResponseMessage>, P>({
  url,
  params,
  config,
  defaultValue,
  autoFetch,
  message,
  onSuccess,
  onError,
  showToast = true,
}: TUseFetch<T, P>) => {
  const { get, post, delete: del, update } = useApi();
  const [data, setData] = useState<T | undefined>(defaultValue);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const toast = useToast();
  const abortController = useRef<AbortController | null>(null);
  const refetch = useCallback(
    async (extra?: P, overrideUrl?: string): Promise<T | undefined> => {
      if (abortController.current) {
        abortController.current.abort();
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
            ? post<T, P>(finalUrl, extra ?? params, finalConfig)
            : method === MethodType.PUT || method === MethodType.PATCH
            ? update<T, P>(finalUrl, extra ?? params, finalConfig)
            : method === MethodType.DELETE
            ? del<T>(finalUrl, extra ?? finalConfig)
            : get<T, P>(finalUrl, extra ?? params, finalConfig);

        const res = await fetchMethod;
        setData(res);
        setSuccess(true);
        if (showToast) {
          if (res?.resultMessage) {
            toast(res.resultMessage, "success");
          } else if (message?.success) {
            toast(message.success, "success");
          }
        }
        onSuccess?.(res);
        return res;
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(true);
        const backendMessage = err?.response?.data?.resultMessage;
        if (showToast) {
          if (backendMessage) {
            toast(backendMessage, "error");
          } else if (message?.error) {
            toast(message.error, "error");
          }
        }

        onError?.();
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [url, params, config, showToast, message, onSuccess, onError]
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
    () => ({ data, loading, success, error, refetch }),
    [data, loading, success, error, refetch]
  );
  return state;
};
