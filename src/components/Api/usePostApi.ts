import {
  type FlightListApiResponse,
  type FlightDetailApiResponse,
  type CodeItem,
  type AircraftList,
  type AvailableAircraft,
  type ResponseMessage,
  type UserListResponse,
  type UserCreateResponse,
  type DetailResponseMessage,
  type UserCreateProps,
  type DataResponseId,
  type RegisterResponseMessage,
  type RegisterOTPCodeVerifyResponse,
  type UserUpdateProps,
  type AdminUpdateUserForm,
  type LeaveRequest,
  type ReqUserIDProps,
  type Seat,
  type SearchFlightResponse,
  MethodType,
  type MealResponse,
  type FlightAircraftResponse,
  type GateStatus,
  type MFAAuthResponse,
  type TerminalResponse,
  type FlightBookingTicketDetailApiResponse,
  type PassengerResponseMessage,
  type Aircraft,
  type PasswordProps,
  type CreateAirportReq,
  type AirportResponseMessage,
} from "../../utils/type.ts";
import type { DropdownOptions } from "../../common/Dropdown/type.ts";
import { useFetch } from "../../context/use[custom]/useFetch.ts";
import type { FlightFormData } from "../../common/Sample/FlightUpdateModal.tsx";
import type { SearchFlightDto } from "../Admin/Search_layout.tsx";
import { useSecureFetch } from "../../context/use[custom]/useSecureFetch.ts";
import type { CreateMealDto } from "../Admin/component/BulkMealCreator.tsx";
import type {
  GeneratePayroll,
  Payroll,
} from "../../common/Sample/PayrollManagement.tsx";

const postMethod = {
  method: MethodType.POST,
  headers: { "Content-Type": "application/json" },
};
const getMethod = {
  method: MethodType.GET,
  headers: { "Content-Type": "application/json" },
};
const deleteMethod = {
  method: MethodType.DELETE,
  headers: { "Content-Type": "application/json" },
};

type FlightId = {
  id?: number;
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
export type TerminalType = "INTERNATIONAL" | "DOMESTIC" | "BUSINESS";

export type CreateTerminalDto = {
  code: string;
  name: string;
  description?: string;
  type: TerminalType;
  airportId: string;
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

export const useFlightById = ({ id }: FlightId) => {
  const isValid = !!id;
  const { data: fetchFlightId, refetch: refetchFlightId } = useFetch<
    FlightDetailApiResponse,
    FlightId
  >({
    url: isValid ? `/sys/flights/flights/${id}` : "",
    params: {},
    autoFetch: false,
    config: getMethod,
  });
  return {
    fetchFlightId,
    refetchFlightId,
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
// export const SeatType = {
//   VIP: "VIP",
//   BUSINESS: "BUSINESS",
//   ECONOMY: "ECONOMY",
// };
export type SeatTypeValue = "ECONOMY" | "BUSINESS" | "FIRST" | "VIP";

export type SeatPosition = "WINDOW" | "MIDDLE" | "AISLE";

export interface SeatUpdateProps {
  seatIds: number[];
  type?: SeatTypeValue;
  price?: number;
  isBooked?: boolean;
  isAvailable?: boolean;
  isExtraLegroom?: boolean;
  isExitRow?: boolean;
  isHandicapAccessible?: boolean;
  isNearLavatory?: boolean;
  isUpperDeck?: boolean;
  isWing?: boolean;
  note?: string;
}

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

export const useFindPassengerById = () => {
  const { data: dataPassengerById, refetch: refetchPassengerById } = useFetch<
    PassengerResponseMessage,
    { id: string }
  >({
    url: "sys/bookings/findPassengerById",
    autoFetch: true,
    config: postMethod,
  });
  return { dataPassengerById, refetchPassengerById };
};

type LoginData = {
  email: string;
  password: string;
};
export const useLoginUser = () => {
  const { data: loginUserData, refetch: refetchLogin } = useFetch<
    UserListResponse,
    LoginData
  >({
    url: "/auth/login",
    defaultValue: { resultCode: "", resultMessage: "", userId: 0 },
    autoFetch: false,
    config: postMethod,
  });
  return {
    loginUserData,
    refetchLogin,
  };
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

export const useFlightDelete = () => {
  const { data: deleteFlightId, refetch: refetchDeleteFlight } = useFetch<
    FlightDetailApiResponse,
    FlightId
  >({
    url: "",
    params: {},
    defaultValue: { resultCode: "", resultMessage: "" },
    autoFetch: false,
    config: deleteMethod,
  });
  const deleteFlightById = async ({ id }: FlightId) => {
    const res = await refetchDeleteFlight({}, `/sys/flights/flights/${id}`);
    return res;
  };
  return {
    deleteFlightId,
    deleteFlightById,
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
export const useFlightList = () => {
  const { data: flightList, refetch: refetchFlightList } = useFetch<
    FlightListApiResponse,
    null
  >({
    url: "/sys/flights",
    defaultValue: { resultCode: "", resultMessage: "" },
    autoFetch: true,
    config: getMethod,
  });
  return {
    flightList,
    refetchFlightList,
  };
};
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

export const useGetSeatByFlightId = ({ id }: ReqUserIDProps) => {
  const { refetch: refetchGetSeatByFlightId, data: dataGetSeatByFlightId } =
    useFetch<DetailResponseMessage<Seat>, void>({
      url: `/sys/seats/getFlightSeat/${id}`,
      autoFetch: !!id,
      config: getMethod,
    });
  return {
    dataGetSeatByFlightId,
    refetchGetSeatByFlightId,
  };
};
// interface CreateMealProps {
//   name: string;
//   mealType: string;
//   description?: string | null;
//   price?: number | null;
//   isAvailable?: boolean;
// }

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
  } = useFetch<AirportResponseMessage, CreateAirportReq[]>({
    url: "/sys/flights/airport/batch",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchCreateBatchAirport,
    loadingCreateBatchAirport,
  };
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
export type CreateGateProps = {
  code: string;
  terminalId: string;
  status: string;
};

// export const useCreateGate = () => {
//   const { refetch: refetchCreateGate } = useFetch<
//     ResponseMessage,
//     CreateGateProps
//   >({
//     url: "/auth/setmfa",
//     autoFetch: false,
//     config: postMethod,
//   });
//   return {
//     refetchCreateGate,
//   };
// };

export const useGetTerminalData = () => {
  const { data: getTerminalData, refetch: refetchGetTerminalData } = useFetch<
    TerminalResponse,
    void
  >({
    url: "/sys/flights/terminal",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getTerminalData,
    refetchGetTerminalData,
  };
};

interface ChangePassword {
  userId: number;
  newPassword: string;
  confirmPassword: string;
}

export type ChangePasswordInProfile = Omit<ChangePassword, "currentPassword">;

interface ResetPasswordByMfa {
  email: string;
  mfaCode: string;
}

interface EmailUserProps {
  email: string;
}
interface UserIdResponse {
  userId: number;
}

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

type DeleteUserProps = {
  id: number;
};

export const useDeleteUserById = () => {
  const { refetch: refetchDeleteUser } = useFetch<
    ResponseMessage,
    DeleteUserProps
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
    url: "/sys/flights/facilities",
    autoFetch: false,
    config: postMethod,
  });
  return {
    refetchCreateFacilities,
  };
};

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

export const useChangePassword = () => {
  const { data: changePassword, refetch: refetchChangePassword } = useFetch<
    ResponseMessage,
    ChangePassword
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
  const { data: changePassword, refetch: refetchChangePassword } = useFetch<
    ResponseMessage,
    ChangePasswordInProfile
  >({
    url: "/auth/change-password-in-profile",
    defaultValue: { resultCode: "", resultMessage: "" },
    autoFetch: false,
    config: postMethod,
  });
  return {
    changePassword,
    refetchChangePassword,
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
export type PassengerFormData = {
  name: string;
  email: string;
  role: string;
  password: string;
  phone: string;
  passport: string;
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
type VerifyOTPProps = {
  userId?: number;
  otp: string;
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
    DataResponseId,
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
      AdminUpdateUserForm
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
      url: `/sys/users/updateUserInfo/${id}`,
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
