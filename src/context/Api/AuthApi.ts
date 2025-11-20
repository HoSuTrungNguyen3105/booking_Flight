import { MethodType, type ResponseGGAuthenticate } from "../../utils/type";
import { useFetch } from "../use[custom]/useFetch";

const getMethod = {
  method: MethodType.GET,
};

const postMethod = {
  method: MethodType.POST,

  headers: { "Content-Type": "application/json" },
};

export interface MfaRequest {
  email: string;
}

export interface MfaRequestLogin {
  email: string;
  code: string;
  authType: string;
}

export interface MfaCodeRequest {
  email: string;
  code: string;
}
export const useLoginByMfa = () => {
  const { data: setLoginMfa, refetch: refetchSetLoginMfa } = useFetch<
    ResponseGGAuthenticate,
    MfaRequestLogin
  >({
    url: "/auth/loginmfa",
    autoFetch: false,
    config: postMethod,
  });
  return {
    setLoginMfa,
    refetchSetLoginMfa,
  };
};
