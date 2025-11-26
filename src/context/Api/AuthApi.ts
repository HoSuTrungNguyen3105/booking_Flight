import {
  MethodType,
  type ChangePasswordProps,
  type CheckMfaProps,
  type DetailResponseMessage,
  type MFAAuthResponse,
  type Passenger,
  type PassengerFormProps,
  type RegisterOTPCodeVerifyResponse,
  type RegisterResponseMessage,
  type ResponseGGAuthenticate,
  type ResponseMessage,
  type VerifyOTPProps,
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

export const useCheckMfaAvailable = () => {
  const { refetch: refetchMfaCheck, loading: loadingMfaCheck } = useFetch<
    ResponseMessage,
    CheckMfaProps
  >({
    url: "/auth/checkMfaSettingYn",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchMfaCheck,
    loadingMfaCheck,
  };
};

export const useVerifyMfa = () => {
  const { refetch: refetchVerifyMfa } = useFetch<
    MFAAuthResponse,
    MfaCodeRequest
  >({
    url: "/auth/verifymfa",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchVerifyMfa,
  };
};

export const useSetUpMfaFromAdmin = () => {
  const { refetch: refetchSetUpMfaFromAdmin } = useFetch<
    MFAAuthResponse,
    MfaRequest
  >({
    url: "/auth/setmfa",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchSetUpMfaFromAdmin,
  };
};

export const useVerifyOTPCode = () => {
  const { refetch: refetchVerifyOTPcode } = useFetch<
    RegisterOTPCodeVerifyResponse,
    VerifyOTPProps
  >({
    url: "/auth/verifyOtp",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchVerifyOTPcode,
  };
};

export const useChangePassword = () => {
  const { data: changePassword, refetch: refetchChangePassword } = useFetch<
    ResponseMessage,
    ChangePasswordProps
  >({
    url: "/auth/change-password",
    autoFetch: false,
    config: postMethod,
  });
  return {
    changePassword,
    refetchChangePassword,
  };
};

export const useSetUpMfa = () => {
  const { refetch: refetchSetUpMfa } = useFetch<MFAAuthResponse, MfaRequest>({
    url: "/auth/setmfa",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchSetUpMfa,
  };
};

export const useRegisterUser = () => {
  const { refetch: refetchRegister } = useFetch<
    RegisterResponseMessage,
    PassengerFormProps
  >({
    url: "/auth/register",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchRegister,
  };
};

export type Action = "VIEW" | "CREATE" | "EDIT" | "DELETE";

export type PermissionItem =
  // Record<"VIEW" | "CREATE" | "EDIT" | "DELETE", string | undefined>;
  Record<string, Record<Action, string>>;

export const useGetPermissionsByRole = (role: string) => {
  const { data: dataPermissionsByRole, refetch: refetchPermissionsByRole } =
    useFetch<DetailResponseMessage<string>, void>({
      url: `/auth/permissions/role/${role}`,
      autoFetch: true,
      config: getMethod,
    });
  return {
    dataPermissionsByRole,
    refetchPermissionsByRole,
  };
};

export const useUpdatePermissions = (role: string) => {
  const { data: updatePermissions, refetch: refetchUpdatePermissions } =
    useFetch<ResponseMessage, { permissions: string[] }>({
      url: `/auth/permissions/role/${role}`,
      autoFetch: false,
      config: postMethod,
    });
  return {
    updatePermissions,
    refetchUpdatePermissions,
  };
};

export const useForgotPassword = () => {
  const { refetch: refetchForgotPassword } = useFetch<
    ResponseMessage,
    { email: string }
  >({
    url: "/auth/forgot-password",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchForgotPassword,
  };
};

export interface ChangePasswordInProfileRequest {
  userId: number;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const useChangePasswordInProfile = () => {
  const {
    data: changePassword,
    refetch: refetchChangePassword,
    error: errorChangePassword,
  } = useFetch<ResponseMessage, ChangePasswordInProfileRequest>({
    url: "/auth/change-password-profile",
    autoFetch: false,
    config: postMethod,
  });
  return {
    changePassword,
    refetchChangePassword,
    errorChangePassword,
  };
};
