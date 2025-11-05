import type { AxiosRequestConfig } from "axios";
import { useApi } from "../../context/ApiContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MethodType } from "../../utils/type";

// type ResponseMessage = {
//   resultCode?: string;
//   resultMessage?: string;
// };

interface AbortError extends Error {
  name: "AbortError";
}

type AppError = Error | AbortError;

type TUseFetch<T, P> = {
  url: string;
  params?: P;
  config?: AxiosRequestConfig;
  defaultValue?: T;
  autoFetch?: boolean;
  onSuccess?: (res?: T) => void;
  onError?: () => void;
  isFullUrl?: boolean;
};

export const useFetch = <T, P>({
  //extends Partial<ResponseMessage>
  url,
  params,
  config,
  defaultValue,
  autoFetch,
  onSuccess,
  onError,
  isFullUrl = false,
}: TUseFetch<T, P>) => {
  const { get, post, delete: del, update } = useApi();
  const [data, setData] = useState<T | undefined>(defaultValue);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [currentParams, setCurrentParams] = useState<P | undefined>(params);
  const abortController = useRef<AbortController | null>(null);

  const finalUrl = useMemo(() => {
    const isHttp = url.startsWith("http://") || url.startsWith("https://");
    if (isFullUrl || isHttp) return url;
    return `http://localhost:3000${url}`;
  }, [url, isFullUrl]);

  const refetch = useCallback(
    async (extra?: P, overrideUrl?: string): Promise<T | undefined> => {
      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();
      setLoading(true);
      const controller = abortController.current;
      const method = config?.method?.toUpperCase();
      const requestUrl = overrideUrl ?? finalUrl;

      const finalConfig = {
        ...config,
        signal: controller?.signal,
      };

      try {
        const fetchMethod =
          method === MethodType.POST
            ? post<T, P>(requestUrl, extra ?? currentParams, finalConfig)
            : method === MethodType.PUT || method === MethodType.PATCH
            ? update<T, P>(requestUrl, extra ?? currentParams, finalConfig)
            : method === MethodType.DELETE
            ? del<T>(requestUrl, finalConfig)
            : get<T, P>(requestUrl, extra ?? currentParams, finalConfig);

        const res = await fetchMethod;
        setData(res);
        setSuccess(true);
        onSuccess?.(res);
        return res;
      } catch (err: AppError | unknown) {
        if ((err as AbortError).name === "AbortError") return;
        setError(true);
        onError?.();
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [
      finalUrl,
      config,
      onSuccess,
      onError,
      currentParams,
      get,
      post,
      del,
      update,
    ]
  );

  useEffect(() => {
    if (autoFetch) refetch();
    return () => {
      abortController.current?.abort();
    };
  }, [autoFetch, refetch]);

  return useMemo(
    () => ({
      data,
      loading,
      success,
      error,
      refetch,
      setParams: setCurrentParams,
    }),
    [data, loading, success, error, refetch]
  );
};
