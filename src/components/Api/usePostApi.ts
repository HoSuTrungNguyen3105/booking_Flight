import type {
  FlightListApiResponse,
  FlightDetailApiResponse,
  CodeItem,
  DataFlight,
  SearchType,
  CreateDataFlight,
  AircraftList,
  AvailableAircraft,
  ResponseMessage,
  UserListResponse,
  UserCreateResponse,
  UserDataNoGrid,
  DetailResponseMessage,
  UseRCreate,
  DataResponseId,
} from "../../utils/type.ts";
import { MethodType } from "../../hooks/type";
import type { DropdownOptions } from "../../common/Dropdown/type.ts";
import type {
  FlightDetailResponse,
  MFAAuthResponse,
  UserSearchType,
} from "../User/type.ts";
import { useFetch } from "../../context/use[custom]/useFetch.ts";

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
const putMethod = {
  method: MethodType.PUT,
  headers: { "Content-Type": "application/json" },
};
const messageMethod = { success: "Success action", error: "Error action" };

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
    CreateDataFlight
  >({
    url: "/sys/flights/createFlight",
    defaultValue: { resultCode: "", resultMessage: "" },
    autoFetch: false,
    config: postMethod,
  });
  return {
    createFlightData,
    refetchCreateFlightData,
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
export const useSearchFlight = (flightParams: SearchType) => {
  const { data: flightList, refetch: refetchFlightList } = useFetch<
    FlightListApiResponse,
    DataFlight
  >({
    url: "/sys/flights/getFlightList",
    params: {
      ...flightParams,
    },
    defaultValue: { resultCode: "", resultMessage: "" },
    autoFetch: true,
    config: postMethod,
  });
  return {
    flightList,
    refetchFlightList,
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

export const useFlightUpdate = () => {
  const { data: updateFlightId, refetch } = useFetch<
    FlightDetailApiResponse,
    DataFlight
  >({
    url: "",
    defaultValue: { resultCode: "", resultMessage: "" },
    autoFetch: false,
    config: putMethod,
  });
  const refetchUpdateFlightId = (data: DataFlight) => {
    return refetch(data, `/sys/flights/flights/${data.flightId}`);
  };
  return {
    updateFlightId,
    refetchUpdateFlightId,
  };
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

export const useFlightBooking = (flightParams: UserSearchType) => {
  const { data: flightBookingData, refetch: refetchFlightBookingDataData } =
    useFetch<FlightDetailResponse, UserSearchType>({
      url: "/ticket/getFlightList",
      params: {
        ...flightParams,
      },
      defaultValue: { resultCode: "", resultMessage: "" },
      autoFetch: false,
      config: postMethod,
    });
  return {
    flightBookingData,
    refetchFlightBookingDataData,
  };
};

export const useTicketById = (flightParams: UserSearchType) => {
  const { data: flightBookingData, refetch: refetchFlightBookingDataData } =
    useFetch<FlightDetailResponse, UserSearchType>({
      url: "/ticket/getTicket",
      params: {
        ...flightParams,
      },
      defaultValue: { resultCode: "", resultMessage: "" },
      autoFetch: false,
      config: postMethod,
    });
  return {
    flightBookingData,
    refetchFlightBookingDataData,
  };
};
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
interface ChangePassword {
  userId: number;
  newPassword: string;
  confirmPassword: string;
}

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

export const useGetUserId = () => {
  const { data: userIdData, refetch: refetchUserIdData } = useFetch<
    DetailResponseMessage<UserIdResponse>,
    EmailUserProps
  >({
    url: "/sys/users/getUserIdByEmail",
    autoFetch: false,
    config: postMethod,
  });
  return {
    userIdData,
    refetchUserIdData,
  };
};

export const useChangePassword = () => {
  const { data: changePassword, refetch: refetchChangePassword } = useFetch<
    ResponseMessage,
    ChangePassword
  >({
    url: "/auth/change-password",
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
  const { data: register, refetch: refetchRegister } = useFetch<
    ResponseMessage,
    PassengerFormData
  >({
    url: "/auth/register",
    autoFetch: false,
    config: postMethod,
  });
  return {
    register,
    refetchRegister,
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
  } = useFetch<UserCreateResponse, UseRCreate>({
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

export const useUpdateUserById = () => {
  // const isValid = !!id;
  const {
    data: fetchUpdateUserById,
    refetch: refetchCreateUser,
    loading: loadingUser,
    setParams: setParamsUser,
  } = useFetch<UserCreateResponse, UserDataNoGrid>({
    url: "/sys/users/updateUser",
    autoFetch: false,
    config: postMethod,
  });
  return {
    fetchUpdateUserById,
    refetchCreateUser,
    loadingUser,
    setParamsUser,
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
  } = useFetch<DetailResponseMessage, ILockAccountProps>({
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
