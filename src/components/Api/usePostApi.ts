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
    showToast: true,
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
    showToast: false,
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
    showToast: false,
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
    showToast: false,
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
    message: messageMethod,
    showToast: true,
  });
  const refetchUpdateFlightId = (data: DataFlight) => {
    return refetch(data, `/sys/flights/flights/${data.flightId}`);
  };
  return {
    updateFlightId,
    refetchUpdateFlightId,
  };
};
type loginData = {
  email: string;
  password: string;
};
export const useLoginUser = () => {
  const { data: loginUserData, refetch: refetchLogin } = useFetch<
    UserListResponse,
    loginData
  >({
    url: "/auth/login",
    defaultValue: {
      resultCode: "",
      resultMessage: "",
      // user: {
      //   id: 0,
      //   // userId: 0,
      //   email: "",
      //   name: "",
      //   password: "",
      // },
      // accessToken: "",
    },
    autoFetch: false,
    config: postMethod,
    showToast: true,
  });
  return {
    loginUserData,
    refetchLogin,
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
    message: messageMethod,
    showToast: true,
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
    showToast: false,
  });
  return {
    aircraftList,
    refetchAircraftList,
  };
};
export const useFlightList = (flightParams: DataFlight) => {
  const { data: flightList, refetch: refetchFlightList } = useFetch<
    FlightListApiResponse,
    DataFlight
  >({
    url: "/sys/flights",
    params: flightParams, // 🔧 THIẾU dòng này
    defaultValue: { resultCode: "", resultMessage: "" },
    autoFetch: true,
    config: postMethod,
    showToast: false,
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
    showToast: false,
  });
  return {
    selectIdFlight,
    refetchSelectIdFlight,
  };
};

// import { useFetch } from 'hooks/useFetch';
// import { FlightDetailResponse, UserSearchType } from './type';
// const postMethod = { method: 'POST', headers: { 'Content-Type': 'application/json' }, timeout: 3000 };
// const getMethod = { method: 'GET', headers: { 'Content-Type': 'application/json' }, timeout: 3000 };
// const deleteMethod = { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, timeout: 3000 };
// const putMethod = { method: 'PUT', headers: { 'Content-Type': 'application/json' }, timeout: 3000 };
// const messageMethod = { success: 'Success', error: 'Error' };
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
      message: messageMethod,
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
      message: messageMethod,
    });
  return {
    flightBookingData,
    refetchFlightBookingDataData,
  };
};
interface MfaRequest {
  // userId: number;
  email: string;
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
}

export const useChangePassword = () => {
  const { data: changePassword, refetch: refetchChangePassword } = useFetch<
    MFAAuthResponse,
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

export const useRegisterUser = () => {
  const { data: register, refetch: refetchRegister } = useFetch<
    MFAAuthResponse,
    MfaRequest
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
    // defaultValue: { resultCode: "", resultMessage: "" },
    autoFetch: false,
    config: postMethod,
    // message: messageMethod,
  });
  return {
    verifyMfa,
    refetchVerifyMfa,
  };
};

export const useLoginByMfa = () => {
  const { data: setLoginMfa, refetch: refetchSetLoginMfa } = useFetch<
    MFAAuthResponse,
    MfaRequest
  >({
    url: "/auth/loginmfa",
    // defaultValue: { resultCode: "", resultMessage: "" },
    autoFetch: false,
    config: postMethod,
    // message: messageMethod,
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
    // params: ,
    autoFetch: false,
    config: postMethod,
    showToast: true,
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
    url: "/sys/users/createUserByAdmin",
    // params: ,
    autoFetch: false,
    config: postMethod,
    showToast: true,
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
  // const isValid = !!id;
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
    showToast: false,
  });
  return {
    loadingAccountLock,
    fetchAccountLock,
    refetchAccountLock,
    setParamsUser,
  };
};
