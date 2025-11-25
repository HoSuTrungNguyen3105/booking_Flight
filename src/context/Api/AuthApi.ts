import {
  MethodType,
  type ResponseGGAuthenticate,
  type ResponseMessage,
} from "../../utils/type";
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

export const useSeedPermissions = () => {
  const { data: setSeedPermissions, refetch: refetchSetSeedPermissions } =
    useFetch<ResponseMessage, void>({
      url: "/auth/seed-permissions",
      autoFetch: false,
      config: postMethod,
    });
  return {
    setSeedPermissions,
    refetchSetSeedPermissions,
  };
};

export const useGetPermissionsByRole = (role: string) => {
  const { data: dataPermissionsByRole, refetch: refetchPermissionsByRole } =
    useFetch<ResponseMessage, void>({
      url: `/auth/permissions/role/${role}`,
      autoFetch: false,
      config: postMethod,
    });
  return {
    dataPermissionsByRole,
    refetchPermissionsByRole,
  };
};
