import {
  type FlightListApiResponse,
  type FlightDetailApiResponse,
  type CodeItem,
  type AircraftList,
  type AvailableAircraft,
  type ResponseMessage,
  // type UserListResponse,
  type UserCreateResponse,
  type DetailResponseMessage,
  type UserCreateProps,
  // type DataResponseId,
  type RegisterResponseMessage,
  type RegisterOTPCodeVerifyResponse,
  type UserUpdateProps,
  type LeaveRequest,
  type ReqUserIDProps,
  type SearchFlightResponse,
  MethodType,
  type MealResponse,
  type FlightAircraftResponse,
  type MFAAuthResponse,
  type FlightBookingTicketDetailApiResponse,
  type PassengerResponseMessage,
  type Aircraft,
  type PasswordProps,
  type CreateAirportReq,
  type AirportCreateResponseMessage,
  type RequestSendEmailResponse,
  type UpdateAirportReq,
  type CreateMealDto,
  type CreateTerminalDto,
  type UserIdResponse,
  type EmailUserProps,
  type CreateGateProps,
  type ChangePasswordInProfile,
  type ResetPasswordByMfa,
  type SeatUpdateProps,
  type CheckMfaProps,
  type ChangePasswordProps,
  type GeneratePayroll,
  type ResponseGGAuthenticate,
  type LoginDataResponse,
  type UserData,
  type Ticket,
  type Passenger,
  type UserSession,
  type VerifyOTPProps,
  type ChangeEmailPassengerProps,
  type VerifyOtpFromEmailChangeProps,
  type CreateHotelDto,
  type TypeWithErrorResponse,
  type LocaleConfig,
  type CreateFlightMealProps,
} from "../../utils/type.ts";
import type { DropdownOptions } from "../../common/Dropdown/type.ts";
import { useFetch } from "../use[custom]/useFetch.ts";
import type { FlightFormData } from "../../components/Admin/component/Flight/FlightManagementModal.tsx";
import type { SearchFlightDto } from "./../../components/Admin/component/Flight/Search_layout.tsx";
import { useSecureFetch } from "../use[custom]/useSecureFetch.ts";
import type { UserFormConfig } from "../../common/Setting/hooks/useDataSection.ts";

const postMethod = {
  method: MethodType.POST,
  headers: { "Content-Type": "application/json" },
};

export const mapToDropdown = (
  list: CodeItem[],
  key: keyof CodeItem,
  valueKey: keyof CodeItem = "code"
): DropdownOptions[] => {
  return list.map((item) => ({
    label: item[key] || "",
    value: item[valueKey] || "",
  }));
};

export const useCreateFlight = () => {
  const { data: createFlightData, refetch: refetchCreateFlightData } = useFetch<
    FlightListApiResponse,
    Partial<FlightFormData>
  >({
    url: "/sys/flights",
    autoFetch: false,
    config: postMethod,
  });
  return {
    createFlightData,
    refetchCreateFlightData,
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

export const useCreateAircraftBatchFlight = () => {
  const { refetch: refetchCreateAircraftBatchFlightData } = useFetch<
    FlightAircraftResponse,
    Aircraft[]
  >({
    url: "/sys/flights/aircraft/batch",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchCreateAircraftBatchFlightData,
  };
};

export const useDeleteAircraftFlight = (code: string) => {
  const {
    refetch: refetchDeleteAircraftFlight,
    loading: loadingDeleteAircraftFlight,
  } = useFetch<ResponseMessage, void>({
    url: `/sys/flights/aircraft/remove/${code}`,
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchDeleteAircraftFlight,
    loadingDeleteAircraftFlight,
  };
};
export const useGetFlightNo = () => {
  const { data: getFlightNoData, refetch: refetchGetFlightNoData } = useFetch<
    ResponseMessage,
    any
  >({
    url: "/sys/flights/generateNewFlightCode",
    defaultValue: { resultCode: "", resultMessage: "" },
    autoFetch: false,
    config: postMethod,
  });
  return {
    getFlightNoData,
    refetchGetFlightNoData,
  };
};

export const useCreateTerminalBulk = () => {
  const { refetch: refetchCreateTerminalBulk } = useFetch<
    ResponseMessage,
    CreateTerminalDto[]
  >({
    url: "/sys/flights/createTerminal/bulk",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchCreateTerminalBulk,
  };
};

export const useDeleteManyFlightIds = () => {
  const { refetch: refetchDeleteManyFlightIds } = useFetch<
    ResponseMessage,
    number[]
  >({
    url: "/sys/flights/flightIds/delete",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchDeleteManyFlightIds,
  };
};

export const useCreateRandomFlight = () => {
  const {
    refetch: refetchCreateRandomFlight,
    loading: loadingCreateRandomFlight,
  } = useFetch<ResponseMessage, void>({
    url: "/sys/airport/flight/random",
    autoFetch: true,
    config: postMethod,
  });

  return {
    refetchCreateRandomFlight,
    loadingCreateRandomFlight,
  };
};

export const useCreateFlightMeal = () => {
  const { refetch: refetchAddMealToFlight, loading: loadingAddMealToFlight } =
    useFetch<ResponseMessage, CreateFlightMealProps>({
      url: "/sys/flight-meals",
      autoFetch: false,
      config: postMethod,
    });
  return {
    refetchAddMealToFlight,
    loadingAddMealToFlight,
  };
};

export const useVerifyPw = ({ id }: ReqUserIDProps) => {
  const { refetch: fetchVerifyPassword } = useFetch<
    DetailResponseMessage<{ isValid: boolean }>,
    PasswordProps
  >({
    url: `/auth/verify-password/${id}`, // Điều chỉnh endpoint theo API của bạn
    config: postMethod,
    autoFetch: false,
  });
  return {
    fetchVerifyPassword,
  };
};
export const useSearchFlight = () => {
  const {
    data: searchFlightList,
    refetch: refetchSearchFlightList,
    openModalConfirm,
    handlePasswordConfirm,
    handleCloseConfirmPassword,
    handleCancelPassword,
    loading,
    isValid,
    hasPendingRequest,
    resetAuthValidation,
  } = useSecureFetch<SearchFlightResponse, SearchFlightDto>({
    url: "/sys/flights/search",
    requirePassword: true,
    autoFetch: false,
    config: postMethod,
    resetAfterSuccess: false,
  });
  return {
    searchFlightList,
    refetchSearchFlightList,
    openModalConfirm,
    handlePasswordConfirm,
    handleCloseConfirmPassword,
    handleCancelPassword,
    hasPendingRequest,
    resetAuthValidation,
    loading,
    isValid,
  };
};

export const useFlightUpdate = ({ id }: ReqUserIDProps) => {
  const { data: updateFlightId, refetch: refetchUpdateFlightId } = useFetch<
    FlightDetailApiResponse,
    Partial<FlightFormData>
  >({
    url: `/sys/flights/updateFlight/${id}`,
    autoFetch: false,
    config: postMethod,
  });
  return {
    updateFlightId,
    refetchUpdateFlightId,
  };
};

// export const useUpdateSeatsByIds = ({ id }: ReqUserIDProps) => {
//   const { refetch: refetchUpdateSeatsByIds } = useFetch<
//     FlightDetailApiResponse,
//   >({
//     url: "/sys/seats/updateSeatsByIds",
//     autoFetch: false,
//     config: postMethod,
//   });
//   return {
//     refetchUpdateSeatsByIds,
//   };
// };
// export const SeatType = {
//   VIP: "VIP",
//   BUSINESS: "BUSINESS",
//   ECONOMY: "ECONOMY",
// };

export const useSeatUpdateByIds = () => {
  const { refetch: refetchUpdateSeatByIds } = useFetch<
    FlightDetailApiResponse,
    SeatUpdateProps
  >({
    url: "/sys/seats/updateSeatsByIds",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchUpdateSeatByIds,
  };
};

export const useDeleteSeatInFlightByIds = () => {
  const { refetch: refetchDeleteSeatInFlightByIds } = useFetch<
    ResponseMessage,
    { flightId: number }
  >({
    url: "/sys/seats/flight/seats/delete",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchDeleteSeatInFlightByIds,
  };
};

export const useUpdatePriceSeatInFlightByIds = () => {
  const { refetch: refetchUpdatePriceSeatInFlightByIds } = useFetch<
    ResponseMessage,
    { price: number; flightId: number }
  >({
    url: "/sys/seats/update/price-multi",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchUpdatePriceSeatInFlightByIds,
  };
};

export const useSearchBooking = () => {
  const { refetch: refetchSearchBooking } = useFetch<
    FlightBookingTicketDetailApiResponse,
    Partial<SearchFlightDto>
  >({
    url: "sys/bookings/search",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchSearchBooking,
  };
};

export const useFindPassengerFromBooking = () => {
  const {
    data: dataPassengerFromBooking,
    refetch: refetchPassengerFromBooking,
  } = useFetch<PassengerResponseMessage, { id: string }>({
    url: "sys/bookings/find-passenger-from-booking",
    autoFetch: true,
    config: postMethod,
  });
  return { dataPassengerFromBooking, refetchPassengerFromBooking };
};

export type SearchEmailFromSidebarMessageReq = {
  email: string;
  id: number;
};

export type SearchEmailFromSidebarMessageRes = {
  userId: number;
  name: string;
  email: string;
  employeeNo: string;
  role: string;
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

export const useApproveUnlock = () => {
  const { data: dataApproveUnlock, refetch: refetchApproveUnlock } = useFetch<
    ResponseMessage,
    { id: number }
  >({
    url: "sys/users/approve-unlock",
    autoFetch: false, // chỉ gọi khi cần
    config: postMethod,
  });

  return { dataApproveUnlock, refetchApproveUnlock };
};

export const useRejectUnlock = () => {
  const { data: dataRejectUnlock, refetch: refetchRejectUnlock } = useFetch<
    ResponseMessage,
    { id: number }
  >({
    url: "sys/users/reject-unlock",
    autoFetch: false, // chỉ gọi khi cần
    config: postMethod,
  });

  return { dataRejectUnlock, refetchRejectUnlock };
};

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
    autoFetch: false, // Không tự động gọi, phải gọi thủ công
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

interface RequestUnlock {
  userId: number;
  reason: string;
}

export const useRequestUnlockAccount = () => {
  const { data: requestUnlockAccount, refetch: refetchRequestUnlockAccount } =
    useFetch<ResponseMessage, RequestUnlock>({
      url: "/sys/users/request-unlock",
      defaultValue: { resultCode: "", resultMessage: "" },
      autoFetch: false,
      config: postMethod,
    });
  return {
    requestUnlockAccount,
    refetchRequestUnlockAccount,
  };
};

export const useFindPassengerTicket = () => {
  const { data: dataFindPassengerTicket, refetch: refetchFindPassengerTicket } =
    useFetch<DetailResponseMessage<Ticket>, { id: string }>({
      url: "/sys/flights/find-passenger-ticket",
      autoFetch: true,
      config: postMethod,
    });
  return {
    dataFindPassengerTicket,
    refetchFindPassengerTicket,
  };
};

export type GetReqponseOneTicket = { id: string; ticketNo: string };

export const useFindOnePassengerTicket = () => {
  const { data: dataFindPassengerTicket, refetch: refetchFindPassengerTicket } =
    useFetch<DetailResponseMessage<Ticket>, GetReqponseOneTicket>({
      url: "/sys/flights/find-one-passenger-ticket",
      autoFetch: false,
      config: postMethod,
    });
  return {
    dataFindPassengerTicket,
    refetchFindPassengerTicket,
  };
};

export type LocaleTypeProps = {
  language: string;
  currency: string;
};

export const useFindLocaleConfig = () => {
  const { data: dataFindLocaleConfig, refetch: refetchFindLocaleConfig } =
    useFetch<DetailResponseMessage<LocaleConfig>, LocaleTypeProps>({
      url: "/sys/locale/config",
      autoFetch: true,
      config: postMethod,
    });
  return {
    dataFindLocaleConfig,
    refetchFindLocaleConfig,
  };
};

export const useDeleteRequestUnlockById = () => {
  const { data: requestUnlockAccount, refetch: refetchRequestUnlockAccount } =
    useFetch<ResponseMessage, { id: number }>({
      url: "/sys/users/request-unlock/delete",
      autoFetch: false,
      config: postMethod,
    });
  return {
    requestUnlockAccount,
    refetchRequestUnlockAccount,
  };
};

export type UpdatePassengerDto = {
  fullName?: string;
  phone?: string;
  passport?: string;
};

export const useUpdatePassengerInProfile = (id: string) => {
  const { refetch: refetchUpdatePassengerInProfile } = useFetch<
    ResponseMessage,
    UpdatePassengerDto
  >({
    url: `/sys/users/passenger/update/profile/${id}`,
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchUpdatePassengerInProfile,
  };
};

export const useAirCraftList = (craftParams: AvailableAircraft) => {
  const { data: aircraftList, refetch: refetchAircraftList } = useFetch<
    AircraftList,
    AvailableAircraft
  >({
    url: "/sys/flights/available-aircrafts",
    params: {
      ...craftParams,
    },
    defaultValue: {
      aircraftList: [],
      resultCode: "",
      resultMessage: "",
    },
    autoFetch: false,
    config: postMethod,
  });
  return {
    aircraftList,
    refetchAircraftList,
  };
};

// export const useFlightList = () => {
//   const { data: flightList, refetch: refetchFlightList } = useFetch<
//     FlightListApiResponse,
//     null
//   >({
//     url: "/sys/flights",
//     defaultValue: { resultCode: "", resultMessage: "" },
//     autoFetch: true,
//     config: getMethod,
//   });
//   return {
//     flightList,
//     refetchFlightList,
//   };
// };

interface UpdateUserRankProps {
  userId: number;
}
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

export const useSelectIdFlight = (id: string | number | undefined) => {
  const { data: selectIdFlight, refetch: refetchSelectIdFlight } = useFetch<
    FlightDetailApiResponse,
    boolean
  >({
    url: `/sys/flights/selectFlightById/${id}`,
    defaultValue: { resultCode: "", resultMessage: "" },
    autoFetch: true,
    config: postMethod,
  });
  return {
    selectIdFlight,
    refetchSelectIdFlight,
  };
};

export interface CreateSeatDto {
  flightId: number;
  seatRow?: string;
  seatNumber?: number;
  isBooked?: boolean;
  size?: number;
}
export const useSeatCreate = () => {
  const { refetch: refetchSeatCreate, loading: loadingCreateSeat } = useFetch<
    ResponseMessage,
    CreateSeatDto
  >({
    url: "/sys/seats",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchSeatCreate,
    loadingCreateSeat,
  };
};

export const useCreateMultiMeal = () => {
  const { refetch: refetchCreateMultiMeal, loading: loadingCreateMultiMeal } =
    useFetch<MealResponse, CreateMealDto[]>({
      url: "/sys/meals/create-many",
      autoFetch: false,
      config: postMethod,
    });
  return {
    loadingCreateMultiMeal,
    refetchCreateMultiMeal,
  };
};

export const useCreateBatchAirport = () => {
  const {
    refetch: refetchCreateBatchAirport,
    loading: loadingCreateBatchAirport,
  } = useFetch<AirportCreateResponseMessage, CreateAirportReq[]>({
    url: "/sys/flights/airport/batch",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchCreateBatchAirport,
    loadingCreateBatchAirport,
  };
};

export interface CreateManyFlightResultItem {
  code?: string;
  error?: boolean;
  resultCode?: string;
  resultMessage?: string;
  errorCode?: string;
  errorMessage?: string;
}

export const useCreateMultiFlight = () => {
  const { refetch: refetchCreateMultiFlight } = useFetch<
    DetailResponseMessage<CreateManyFlightResultItem>,
    FlightFormData[]
  >({
    url: "/sys/flights/bulk-create",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchCreateMultiFlight,
  };
};

export const useCreateFlightStatus = () => {
  const {
    refetch: refetchCreateFlightStatus,
    loading: loadingCreateFlightStatus,
  } = useFetch<
    ResponseMessage,
    { flightId: number; status: string; description?: string }
  >({
    url: "/sys/flights/flight-status/add",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchCreateFlightStatus,
    loadingCreateFlightStatus,
  };
};

export const useUpdateFlightStatus = () => {
  const {
    refetch: refetchUpdateFlightStatus,
    loading: loadingUpdateFlightStatus,
  } = useFetch<ResponseMessage, { id: number; status: string }>({
    url: "/sys/flights/flight-status/update",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchUpdateFlightStatus,
    loadingUpdateFlightStatus,
  };
};

export const useUpdateAirportById = (code: number) => {
  const { refetch: refetchUpdateAirport, loading: loadingUpdateAirport } =
    useFetch<ResponseMessage, UpdateAirportReq>({
      url: `/sys/flights/airports/update/${String(code)}`,
      autoFetch: false,
      config: postMethod,
    });
  return {
    refetchUpdateAirport,
    loadingUpdateAirport,
  };
};

type DeleteAirportProps = { code: string };

export const useDeleteAirportById = () => {
  const { refetch: refetchDeleteAirport, loading: loadingDeleteAirport } =
    useFetch<ResponseMessage, DeleteAirportProps>({
      url: "/sys/flights/airports/delete",
      autoFetch: false,
      config: postMethod,
    });
  return {
    refetchDeleteAirport,
    loadingDeleteAirport,
  };
};

export const useCreateAirport = () => {
  const { refetch: refetchUpdateAirport, loading: loadingUpdateAirport } =
    useFetch<ResponseMessage, CreateAirportReq>({
      url: "/sys/flights/airports",
      autoFetch: false,
      config: postMethod,
    });
  return {
    refetchUpdateAirport,
    loadingUpdateAirport,
  };
};

export const useCreateBatchGate = () => {
  const { refetch, data, loading } = useFetch<
    ResponseMessage,
    CreateGateProps[]
  >({
    url: "/sys/gates/batch-create",
    config: postMethod,
    autoFetch: false,
  });

  return { refetchCreateBatchGate: refetch, data, loading };
};

// export const useTicketById = (flightParams: UserSearchType) => {
//   const { data: flightBookingData, refetch: refetchFlightBookingDataData } =
//     useFetch<FlightDetailResponse, UserSearchType>({
//       url: "/ticket/getTicket",
//       params: {
//         ...flightParams,
//       },
//       defaultValue: { resultCode: "", resultMessage: "" },
//       autoFetch: false,
//       config: postMethod,
//     });
//   return {
//     flightBookingData,
//     refetchFlightBookingDataData,
//   };
// };

interface MfaRequest {
  email: string;
}

interface MfaRequestLogin {
  email: string;
  code: string;
  authType: string;
}

interface MfaCodeRequest {
  email: string;
  code: string;
}

export const useSetUpMfa = () => {
  const { data: setUpMfa, refetch: refetchSetUpMfa } = useFetch<
    MFAAuthResponse,
    MfaRequest
  >({
    url: "/auth/setmfa",
    autoFetch: false,
    config: postMethod,
  });
  return {
    setUpMfa,
    refetchSetUpMfa,
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

export const useCreateBulkHotels = () => {
  const { refetch: refetchCreateBulkHotels } = useFetch<
    DetailResponseMessage<TypeWithErrorResponse>,
    CreateHotelDto[]
  >({
    url: "sys/hotels/bulk",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchCreateBulkHotels,
  };
};

export const useResetPassword = () => {
  const { refetch: refetchResetPassword } = useFetch<
    ResponseMessage,
    { userId: number; tempPassword: string }
  >({
    url: "/auth/resetTempPassword",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchResetPassword,
  };
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

export type RequestChangeRoleProps = {
  userId: number;
  fromUserId: number;
  employeeNo: string;
};

export const useRequestChangeRole = () => {
  const {
    refetch: refetchRequestChangeRole,
    error: errorRequestChangeRole,
    loading: loadingRequestChangeRole,
  } = useFetch<ResponseMessage, RequestChangeRoleProps>({
    url: "/sys/users/request-change-role",
    autoFetch: false,
    config: postMethod,
  });
  return {
    errorRequestChangeRole,
    refetchRequestChangeRole,
    loadingRequestChangeRole,
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

export interface FacilityFormProps {
  id: string;
  name: string;
  type: string;
  description: string;
  terminalId?: string;
  location: string;
  openingHours: string;
}

export const useCreateGate = () => {
  const { refetch: refetchCreateGate } = useFetch<
    ResponseMessage,
    CreateGateProps
  >({
    url: "/sys/gates",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchCreateGate,
  };
};

export const useCreateFacilities = () => {
  const { refetch: refetchCreateFacilities } = useFetch<
    ResponseMessage,
    FacilityFormProps
  >({
    url: "/sys/gates/facilities",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchCreateFacilities,
  };
};

export const useUpdateGate = ({ id }: { id: string }) => {
  const { refetch: refetchUpdateGate } = useFetch<
    ResponseMessage,
    Omit<CreateGateProps, "terminalId">
  >({
    url: `/sys/gates/update/${id}`,
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchUpdateGate,
  };
};

// export const useCreateFacilities = () => {
//   const { refetch: refetchCreateFacilities } = useFetch<
//     ResponseMessage,
//     FacilityFormProps
//   >({
//     url: "/sys/flights/facilities",
//     autoFetch: false,
//     config: postMethod,
//   });
//   return {
//     refetchCreateFacilities,
//   };
// };

export const useUpdateFacilities = (id: string) => {
  const { refetch: refetchUpdateFacilities } = useFetch<
    ResponseMessage,
    FacilityFormProps
  >({
    url: `/sys/flights/facilities/update/${id}`,
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchUpdateFacilities,
  };
};

export const useDeletePayroll = () => {
  const { refetch, loading } = useFetch<ResponseMessage, { id: number }>({
    url: "/sys/payrolls/delete",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchDeletePayroll: refetch,
    loadingDeletePayroll: loading,
  };
};

export const useGeneratePayroll = () => {
  const { refetch, loading } = useFetch<ResponseMessage, GeneratePayroll>({
    url: "/sys/payrolls/generate",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchGeneratePayroll: refetch,
    loadingGeneratePayroll: loading,
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

// export const useDeleteMyAccount = ( id: number , token: string) => {
//  const { refetch, loading, data } = useFetch({
//     url: `/user/deleteMyAccount/${userId}`,
//     config: postMethod,
//     autoFetch: false,
//   });
// };

export const useDeleteMyAccount = () => {
  const { refetch, loading } = useFetch<ResponseMessage, { id: number }>({
    url: "/sys/users/deleteMyAccount",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchDeleteMyAccount: refetch,
    loadingDeleteMyAccount: loading,
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

type SendManyDto = {
  toList: string[];
  subject: string;
  text: string;
  html?: string;
};

// Kiểu dữ liệu gửi email có CC/BCC
type SendCcBccDto = {
  toList: string[];
  subject: string;
  text: string;
  html?: string;
  ccList?: string[];
  bccList?: string[];
};

export const useSendMail = () => {
  // send-one
  // const { data: sendOneRes, refetch: sendOne } = useFetch<MailResponse, SendOneDto>({
  //   url: "/service/mail/send-one",
  //   autoFetch: false,
  //   config: postMethod,
  // });

  // send-many
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
    // sendOneRes,
    sendManyRes,
    sendCcBccRes,
    // sendOne,
    sendMany,
    sendCcBcc,
  };
};

export const useChangePasswordInProfile = () => {
  const {
    data: changePassword,
    refetch: refetchChangePassword,
    error: errorChangePassword,
  } = useFetch<ResponseMessage, ChangePasswordInProfile>({
    url: "/auth/change-password-in-profile",
    defaultValue: { resultCode: "", resultMessage: "" },
    autoFetch: false,
    config: postMethod,
  });
  return {
    changePassword,
    refetchChangePassword,
    errorChangePassword,
  };
};

export const useResetPasswordByMfa = () => {
  const { refetch: refetchChangePassword } = useFetch<
    ResponseMessage,
    ResetPasswordByMfa
  >({
    url: "/auth/forgot-password-with-mfa",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchChangePassword,
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

export const useForgotPassword = () => {
  const { refetch: refetchForgotPassword } = useFetch<
    DetailResponseMessage<{ userId: number }>,
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

export type PassengerFormData = {
  name: string;
  email: string;
  role: string;
  password: string;
  phone: string;
};

export const useRegisterUser = () => {
  const { refetch: refetchRegister } = useFetch<
    RegisterResponseMessage,
    PassengerFormData
  >({
    url: "/auth/register",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchRegister,
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

export const useVerifyOtpToAccessEmail = () => {
  const { refetch: refetchVerifyOtp } = useFetch<
    ResponseMessage,
    VerifyOtpFromEmailChangeProps
  >({
    url: "/auth/passenger/verify-otp",
    autoFetch: false,
    config: postMethod,
  });

  return { refetchVerifyOtp };
};

export const useVerifyMfa = () => {
  const { data: verifyMfa, refetch: refetchVerifyMfa } = useFetch<
    MFAAuthResponse,
    MfaCodeRequest
  >({
    url: "/auth/verifymfa",
    autoFetch: false,
    config: postMethod,
  });
  return {
    verifyMfa,
    refetchVerifyMfa,
  };
};

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

export const useCreateUserByAdmin = () => {
  // const isValid = !!id;
  const {
    data: fetchCreateUser,
    refetch: refetchCreateUser,
    loading: loadingUser,
    setParams: setParamsUser,
  } = useFetch<UserCreateResponse, UserCreateProps>({
    url: "/sys/users/createUserByAdmin",
    autoFetch: false,
    config: postMethod,
  });
  return {
    fetchCreateUser,
    refetchCreateUser,
    loadingUser,
    setParamsUser,
  };
};
interface ResAdminUpdateUserProps {
  userId: number;
}
export const useUpdateUserFromAdmin = () => {
  // const isValid = !!id;
  const { refetch: refetchUpdateUserFromAdmin, loading: loadingUser } =
    useFetch<
      DetailResponseMessage<ResAdminUpdateUserProps>,
      Partial<UserFormConfig>
    >({
      url: "/sys/users/updateUserFromAdmin",
      autoFetch: false,
      config: postMethod,
    });
  return {
    refetchUpdateUserFromAdmin,
    loadingUser,
  };
};

export interface BatchUpdateEmployeesDto {
  updates: BatchEmployeeNoReq[];
}

export type BatchEmployeeNoReq = {
  userId: number;
  employeeNo: string;
};

export type BatchEmployeeNoRes = {
  message: string;
  userId: number;
  employeeNo: string;
};

export const useUpdateBatchEmployeeNo = () => {
  // const isValid = !!id;
  const { refetch, loading } = useFetch<
    DetailResponseMessage<BatchEmployeeNoRes>,
    BatchUpdateEmployeesDto
  >({
    url: "/sys/users/employee-no/batch",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchUpdateBatchEmployeeNo: refetch,
    loadingUpdateBatchEmployeeNo: loading,
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

export enum LeaveType {
  ANNUAL = "ANNUAL",
  SICK = "SICK",
  UNPAID = "UNPAID",
}

export type CreateLeaveRequestDto = {
  employeeId: number;
  leaveType: LeaveType;
  startDate: number;
  endDate: number;
  days: number;
  reason?: string;
};

export const useCreateLeaveRequest = () => {
  const {
    data: dataGetLeaveRequest,
    refetch: refetchGetLeaveRequest,
    loading: loadingGetLeaveRequest,
  } = useFetch<DetailResponseMessage<LeaveRequest>, CreateLeaveRequestDto>({
    url: "/sys/users/leave-requests",
    autoFetch: false,
    config: postMethod,
  });
  return {
    dataGetLeaveRequest,
    loadingGetLeaveRequest,
    refetchGetLeaveRequest,
  };
};

export const useDeleteLeaveRequest = () => {
  const {
    data: dataDeleteLeaveRequest,
    refetch: refetchDeleteLeaveRequest,
    loading: loadingDeleteLeaveRequest,
  } = useFetch<DetailResponseMessage<LeaveRequest>, { id: number }>({
    url: "/sys/users/leave-requests/delete",
    autoFetch: false,
    config: postMethod,
  });
  return {
    dataDeleteLeaveRequest,
    refetchDeleteLeaveRequest,
    loadingDeleteLeaveRequest,
  };
};

export type SendRequestProps = {
  requestId: number;
  approverId: number;
  note?: string;
};

export const useApproveLeaveRequest = (id: number) => {
  const {
    refetch: fetchApproveLeaveRequest,
    loading: loadingApproveLeaveRequest,
  } = useFetch<ResponseMessage, SendRequestProps>({
    url: `/sys/users/leave-requests/approve/${id}`,
    autoFetch: false,
    config: postMethod,
  });
  return {
    fetchApproveLeaveRequest,
    loadingApproveLeaveRequest,
  };
};

export const useRejectLeaveRequest = (id: number) => {
  const {
    refetch: fetchRejectLeaveRequest,
    loading: loadingRejectLeaveRequest,
  } = useFetch<ResponseMessage, SendRequestProps>({
    url: `/sys/users/leave-requests/reject/${id}`,
    autoFetch: false,
    config: postMethod,
  });
  return {
    fetchRejectLeaveRequest,
    loadingRejectLeaveRequest,
  };
};

export interface ILockAccountProps {
  id?: number;
  accountLockYn: string;
}

export const useAccountLock = () => {
  const {
    data: fetchAccountLock,
    refetch: refetchAccountLock,
    loading: loadingAccountLock,
    setParams: setParamsUser,
  } = useFetch<ResponseMessage, ILockAccountProps>({
    url: "/sys/users/setAccountLock",
    // params: ,
    autoFetch: false,
    config: postMethod,
  });
  return {
    loadingAccountLock,
    fetchAccountLock,
    refetchAccountLock,
    setParamsUser,
  };
};
