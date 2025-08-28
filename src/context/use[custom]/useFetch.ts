import type { AxiosRequestConfig } from "axios";
import { useApi } from "../../context/ApiContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { MethodType } from "../../hooks/type";
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
  onSuccess?: (res?: T) => void;
  onError?: () => void;
};
export const useFetch = <T extends Partial<ResponseMessage>, P>({
  url,
  params,
  config,
  defaultValue,
  autoFetch,
  onSuccess,
  onError,
}: TUseFetch<T, P>) => {
  const { get, post, delete: del, update } = useApi();
  const [data, setData] = useState<T | undefined>(defaultValue);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [currentParams, setCurrentParams] = useState<P | undefined>(params);
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
