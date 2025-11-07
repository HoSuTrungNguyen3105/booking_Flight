import type { AxiosRequestConfig } from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import axiosInstance from "../utils/axiosInstance";

export type ApiContextType = {
  get: <T, P>(
    url: string,
    params?: P,
    config?: AxiosRequestConfig
  ) => Promise<T>;
  post: <T, P>(
    url: string,
    data?: AxiosRequestConfig<P>["data"],
    config?: AxiosRequestConfig<P>
  ) => Promise<T>;
  update: <T, P>(
    url: string,
    data?: AxiosRequestConfig<P>["data"],
    config?: AxiosRequestConfig<P>
  ) => Promise<T>;
  delete: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
  loading: boolean;
  error: string | null;
};
const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const handleRequest = useCallback(
    async (
      method: string,
      url: string,
      data?: AxiosRequestConfig["data"],
      config?: AxiosRequestConfig
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance({
          method,
          url,
          data,
          ...config,
          headers: {
            ...(axiosInstance.defaults.headers.common as Record<
              string,
              string
            >),
            ...(config?.headers ?? {}),
          },
        });
        return response.data;
      } catch (error) {
        setError("An error occured");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  const get: ApiContextType["get"] = useCallback(
    (url, params, config) => {
      return handleRequest("get", url, undefined, { ...config, params });
    },
    [handleRequest]
  );

  const post: ApiContextType["post"] = useCallback(
    (url, data, config) => {
      return handleRequest("post", url, data, config);
    },
    [handleRequest]
  );

  const update: ApiContextType["update"] = useCallback(
    (url, data, config) => {
      return handleRequest("put", url, data, config);
    },
    [handleRequest]
  );

  const del: ApiContextType["delete"] = useCallback(
    (url, config) => {
      return handleRequest("delete", url, undefined, config);
    },
    [handleRequest]
  );

  return (
    <ApiContext.Provider
      value={{ get, post, delete: del, update, loading, error }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("No Data ApiProvider");
  }
  return context;
};
