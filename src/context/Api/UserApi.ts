import type { UserFormConfig } from "../../common/Setting/hooks/useDataSection.ts";
import type { SearchEmailFromSidebarMessageRes } from "../../components/Chat/SearchUserFromMessage.tsx";
import type { UserWithRelationsData } from "../../components/Sample/type.ts";
import {
  MethodType,
  type DetailResponseMessage,
  type TransferAdmin,
  type Passenger,
  type UserListManageResponse,
  type UserData,
  type LeaveRequest,
  type UserUpdateProps,
  type AttendanceResponseMessage,
  // type UserWithRelationsData,
  type ResponseMessage,
  type RequestSendEmailResponse,
  type PasswordProps,
  // type SearchEmailFromSidebarMessageRes,
  type LoginDataResponse,
  type UserSession,
  type UserIdResponse,
  type EmailUserProps,
  type ChangeEmailPassengerProps,
  // type UpdatePassengerDto,
} from "../../utils/type.ts";
import { useFetch } from "../use[custom]/useFetch.ts";

const getMethod = {
  method: MethodType.GET,
};

const postMethod = {
  method: MethodType.POST,
  headers: { "Content-Type": "application/json" },
};

export const useRandomPassword = () => {
  const {
    data: fetchUserPw,
    refetch: refetchUserPw,
    loading: loadingUser,
  } = useFetch<DetailResponseMessage<string>, null>({
    url: "/sys/users/getRandomPw",
    autoFetch: false,
    config: getMethod,
  });
  return {
    fetchUserPw,
    refetchUserPw,
    loadingUser,
  };
};

export const usefindAllTransferRequests = () => {
  const {
    data: dataFindAllTransferRequests,
    refetch: refetchFindAllTransferRequests,
    loading: loadingFindAllTransferRequests,
  } = useFetch<DetailResponseMessage<TransferAdmin>, void>({
    url: "/sys/users/view/all-transfer-requests",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataFindAllTransferRequests,
    refetchFindAllTransferRequests,
    loadingFindAllTransferRequests,
  };
};

export const useUpdateUserInfo = (id: number) => {
  // const isValid = !!id;
  const { refetch: refetchUpdateUserInfo, loading: loadingUpdateUserInfo } =
    useFetch<ResponseMessage, UserUpdateProps>({
      url: `/sys/users/updateMyInfo/${id}`,
      autoFetch: false,
      config: postMethod,
    });
  return {
    refetchUpdateUserInfo,
    loadingUpdateUserInfo,
  };
};

export const useDeleteAttendance = () => {
  const { refetch, loading } = useFetch<ResponseMessage, { id: number }>({
    url: "/sys/users/attendance/delete",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchDeleteAttendance: refetch,
    loadingDeleteAttendance: loading,
  };
};

export const useFindAllPassenger = () => {
  const {
    data: dataAllPassenger,
    refetch: refetchAllPassenger,
    loading: loadingAllPassenger,
  } = useFetch<DetailResponseMessage<Passenger>, null>({
    url: "/sys/bookings/findAllPassenger",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataAllPassenger,
    refetchAllPassenger,
    loadingAllPassenger,
  };
};

export const useGetUserWithRelations = ({ id }: { id: string | number }) => {
  const {
    refetch: refetchGetUserWithRelations,
    data: dataGetUserWithRelations,
  } = useFetch<DetailResponseMessage<UserWithRelationsData>, void>({
    url: `/auth/getUserWithRelations/${id as string}`,
    autoFetch: !!id,
    config: getMethod,
  });
  return {
    dataGetUserWithRelations,
    refetchGetUserWithRelations,
  };
};

export const useGetUserList = () => {
  const { data, refetch, loading } = useFetch<UserListManageResponse, UserData>(
    {
      url: "/sys/users",
      autoFetch: true,
      config: getMethod,
    }
  );
  return {
    fetchUserList: data,
    refetchUser: refetch,
    loadingUser: loading,
  };
};

export const useGetLeaveRequest = () => {
  const {
    data: dataGetLeaveRequest,
    refetch: refetchGetLeaveRequest,
    loading: loadingGetLeaveRequest,
  } = useFetch<DetailResponseMessage<LeaveRequest>, UserUpdateProps>({
    url: "/sys/users/leave-requests/all",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataGetLeaveRequest,
    loadingGetLeaveRequest,
    refetchGetLeaveRequest,
  };
};

export const useGetAllAttendance = () => {
  const { refetch, loading, data } = useFetch<AttendanceResponseMessage, void>({
    url: "/sys/users/attendance/all",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataAllAttendance: data,
    refetchAllAttendance: refetch,
    loadingAllAttendance: loading,
  };
};

export const useGetUserById = (id: number) => {
  const { data: fetchUserById, refetch: refetchUserById } = useFetch<
    UserListManageResponse,
    null
  >({
    url: `/sys/users/${id}`,
    autoFetch: false,
    config: getMethod,
  });
  return {
    fetchUserById,
    refetchUserById,
  };
};

export const useFindUserFromMessage = () => {
  const { data: dataUserFromMessage, refetch: refetchUserFromMessage } =
    useFetch<
      DetailResponseMessage<SearchEmailFromSidebarMessageRes>,
      SearchEmailFromSidebarMessageReq
    >({
      url: "sys/users/findUserFromMessage",
      autoFetch: false, // thường search thì gọi khi cần
      config: postMethod,
    });

  return { dataUserFromMessage, refetchUserFromMessage };
};

export const useUpdateUserFromAdmin = () => {
  // const isValid = !!id;
  const { refetch: refetchUpdateUserFromAdmin, loading: loadingUser } =
    useFetch<DetailResponseMessage<UserIdResponse>, Partial<UserFormConfig>>({
      url: "/sys/users/updateUserFromAdmin",
      autoFetch: false,
      config: postMethod,
    });
  return {
    refetchUpdateUserFromAdmin,
    loadingUser,
  };
};

export const useApproveOrRejectTransfer = () => {
  const {
    refetch: refetchApproveOrRejectTransfer,
    loading: loadingApproveOrRejectTransfer,
  } = useFetch<ResponseMessage, { userId: number; mode: "approve" | "reject" }>(
    {
      url: "/sys/users/modeTransfer",
      autoFetch: false,
      config: postMethod,
    }
  );
  return {
    refetchApproveOrRejectTransfer,
    loadingApproveOrRejectTransfer,
  };
};

export const useDisabledMFALogin = () => {
  const { refetch: refetchDisabledMFALogin } = useFetch<
    ResponseMessage,
    { userId: number }
  >({
    url: "/auth/disabledmfa",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchDisabledMFALogin,
  };
};

export const useSendEmailToVerification = () => {
  const { refetch: refetchSendEmailToVerification } = useFetch<
    RequestSendEmailResponse,
    { id: number }
  >({
    url: "/auth/sendEmailToVerification",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchSendEmailToVerification,
  };
};

export type ReqUserIDProps = {
  id?: number;
};

export const useVerifyPw = ({ id }: ReqUserIDProps) => {
  const { refetch: fetchVerifyPassword } = useFetch<
    DetailResponseMessage<{ isValid: boolean }>,
    PasswordProps
  >({
    url: `/auth/verify-password/${id}`,
    config: postMethod,
    autoFetch: false,
  });
  return {
    fetchVerifyPassword,
  };
};

export type SearchEmailFromSidebarMessageReq = {
  email: string;
  id: number;
};

// export const useFindUserFromMessage = () => {
//   const { data: dataUserFromMessage, refetch: refetchUserFromMessage } =
//     useFetch<
//       DetailResponseMessage<SearchEmailFromSidebarMessageRes>,
//       SearchEmailFromSidebarMessageReq
//     >({
//       url: "sys/users/findUserFromMessage",
//       autoFetch: false,
//       config: postMethod,
//     });

//   return { dataUserFromMessage, refetchUserFromMessage };
// };

export type LoginReqProps = {
  email: string;
  password: string;
  authType: string;
  userAgent: string;
  ipAddress: string;
  location: string;
};

export const useLoginAdmin = () => {
  const { refetch: refetchAdminLogin } = useFetch<
    LoginDataResponse<UserData>,
    LoginReqProps
  >({
    url: "/auth/login-admin",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchAdminLogin,
  };
};

export const useLogoutAllSessions = () => {
  const { refetch } = useFetch<ResponseMessage, undefined>({
    url: "/auth/logoutAllOtherSessions",
    config: postMethod,
    autoFetch: false,
  });
  return {
    refetchLogoutAllSessions: refetch,
  };
};

export const useGetMyUserInfo = () => {
  const { data, refetch } = useFetch<
    DetailResponseMessage<Passenger>,
    { id: string }
  >({
    url: "/auth/find-passenger-info",
    autoFetch: false,
    config: postMethod,
  });

  return {
    getMyInfo: data,
    refetchGetMyUserInfo: refetch,
  };
};

export const useGetMyAdminInfo = () => {
  const { data, refetch } = useFetch<
    DetailResponseMessage<UserData>,
    { id: number }
  >({
    url: "/sys/users/get-user-info",
    autoFetch: false,
    config: postMethod,
  });

  return {
    getMyInfo: data,
    refetchGetMyAdminInfo: refetch,
  };
};

export const useLoginUser = () => {
  const { data: loginUserData, refetch: refetchLogin } = useFetch<
    LoginDataResponse<Passenger>,
    LoginReqProps
  >({
    url: "/auth/login",
    autoFetch: false,
    config: postMethod,
  });
  return {
    loginUserData,
    refetchLogin,
  };
};

export const useAdminSessions = () => {
  const { refetch, data } = useFetch<
    DetailResponseMessage<UserSession>,
    { userId: number }
  >({
    url: "/auth/get-admin-sessions",
    config: postMethod,
    autoFetch: false,
  });
  return {
    dataSessions: data,
    refetchUserSessions: refetch,
  };
};

export const usePassengerSessions = () => {
  const { refetch, data } = useFetch<
    DetailResponseMessage<UserSession>,
    { passengerId: string }
  >({
    url: "/auth/get-passenger-sessions",
    config: postMethod,
    autoFetch: false,
  });
  return {
    dataSessions: data,
    refetchPassengerSessions: refetch,
  };
};

export const useDeleteSessionsFromID = () => {
  const { refetch, data } = useFetch<
    ResponseMessage,
    { sessionId: number; userId: number | null; passengerId: string | null }
  >({
    url: `/auth/logoutSession`,
    config: postMethod,
    autoFetch: false,
  });
  return {
    dataSessions: data,
    refetchDeleteSessions: refetch,
  };
};

export const useGetSessionsByID = () => {
  const { refetch } = useFetch<
    DetailResponseMessage<{ requireLogout: boolean }>,
    { userId: number | null; passengerId: string | null; token: string }
  >({
    url: `/auth/get-sessions-by-id`,
    config: postMethod,
    autoFetch: false,
  });
  return {
    refetchGetSessionByID: refetch,
  };
};

export const useLogoutSessionFromPassenger = () => {
  const { refetch: refetchLogoutSession } = useFetch<ResponseMessage, void>({
    url: "/auth/logout",
    autoFetch: false,
    config: postMethod,
  });
  return { refetchLogoutSession };
};

// export const useUpdatePassengerInProfile = (id: string) => {
//   const { refetch: refetchUpdatePassengerInProfile } = useFetch<
//     ResponseMessage,
//     UpdatePassenger
//   >({
//     url: `/sys/users/passenger/update/profile/${id}`,
//     autoFetch: false,
//     config: postMethod,
//   });
//   return {
//     refetchUpdatePassengerInProfile,
//   };
// };

interface UpdateUserRankProps {
  userId: number;
}

export type SendManyDto = {
  toList: string[];
  subject: string;
  text: string;
  html?: string;
};

export type SendCcBccDto = {
  toList: string[];
  subject: string;
  text: string;
  html?: string;
  ccList?: string[];
  bccList?: string[];
};

export const useSendMail = () => {
  const { data: sendManyRes, refetch: sendMany } = useFetch<
    ResponseMessage,
    SendManyDto
  >({
    url: "/service/mail/send-many",
    autoFetch: false,
    config: postMethod,
  });

  // send-cc-bcc
  const { data: sendCcBccRes, refetch: sendCcBcc } = useFetch<
    ResponseMessage,
    SendCcBccDto
  >({
    url: "/service/mail/send-cc-bcc",
    autoFetch: false,
    config: postMethod,
  });

  return {
    sendManyRes,
    sendCcBccRes,
    sendMany,
    sendCcBcc,
  };
};

export type RequestChangeRoleProps = {
  userId: number;
  fromUserId: number;
  employeeNo: string;
};

export const useRequestChangeRole = () => {
  const { refetch: refetchRequestChangeRole, error: errorRequestChangeRole } =
    useFetch<ResponseMessage, RequestChangeRoleProps>({
      url: "/sys/users/request-change-role",
      autoFetch: false,
      config: postMethod,
    });
  return {
    errorRequestChangeRole,
    refetchRequestChangeRole,
  };
};

export const usePermissionChangeRole = () => {
  const {
    refetch: refetchPermissionChangeRole,
    error: errorPermissionChangeRole,
    loading: loadingPermissionChangeRole,
  } = useFetch<ResponseMessage, { id: number; employeeNo: string }>({
    url: "/sys/users/permission-change-role",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchPermissionChangeRole,
    errorPermissionChangeRole,
    loadingPermissionChangeRole,
  };
};

export const useDeleteUserById = () => {
  const { refetch: refetchDeleteUser } = useFetch<
    ResponseMessage,
    ReqUserIDProps
  >({
    url: "/sys/users/deleteUser",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchDeleteUser,
  };
};

export interface ILockAccountProps {
  id?: number;
  accountLockYn: string;
}

export const useAccountLock = () => {
  const { refetch: refetchAccountLock, loading: loadingAccountLock } = useFetch<
    ResponseMessage,
    ILockAccountProps
  >({
    url: "/sys/users/setAccountLock",
    // params: ,
    autoFetch: false,
    config: postMethod,
  });
  return {
    loadingAccountLock,
    refetchAccountLock,
  };
};

export const useChangeEmailPassenger = () => {
  const { refetch: refetchChangeEmailPassenger } = useFetch<
    DetailResponseMessage<{ requireVerified: true }>,
    ChangeEmailPassengerProps
  >({
    url: "/auth/passenger/change-email",
    autoFetch: false,
    config: postMethod,
  });

  return { refetchChangeEmailPassenger };
};

export const getUserIdByEmail = () => {
  const { refetch: refetchUserEmailData } = useFetch<
    DetailResponseMessage<UserIdResponse>,
    EmailUserProps
  >({
    url: "/sys/users/getUserIdByEmail",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchUserEmailData,
  };
};

export type UpdatePassengerProps = {
  fullName?: string;
  phone?: string;
  passport?: string;
};

export const useUpdatePassengerInProfile = (id: string) => {
  const { refetch: refetchUpdatePassengerInProfile } = useFetch<
    ResponseMessage,
    UpdatePassengerProps
  >({
    url: `/sys/users/passenger/update/profile/${id}`,
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchUpdatePassengerInProfile,
  };
};

export const useUpdateUserRank = () => {
  const { refetch: refetchUpdateUserRank } = useFetch<
    ResponseMessage,
    UpdateUserRankProps
  >({
    url: "/sys/users/promoteRank",
    defaultValue: { resultCode: "", resultMessage: "" },
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchUpdateUserRank,
  };
};

export const useDeleteMyAccount = () => {
  const { refetch: refetchDeleteMyAccount } = useFetch<
    ResponseMessage,
    { id: number }
  >({
    url: "/sys/users/delete-my-account",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchDeleteMyAccount,
  };
};

export type BatchUpdateEmployeesDto = {
  updates: { userId: number; employeeNo: string; name?: string }[];
};

export const useUpdateBatchEmployeeNo = () => {
  const { refetch: refetchUpdateBatchEmployeeNo } = useFetch<
    ResponseMessage,
    BatchUpdateEmployeesDto
  >({
    url: "/sys/users/batch-update-employee-no",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchUpdateBatchEmployeeNo,
  };
};
