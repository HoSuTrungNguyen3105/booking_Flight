import {
  type FlightDetailApiResponse,
  type CodeItem,
  type UserListManageResponse,
  type UserData,
  type DetailResponseMessage,
  type FlightMealDetailApiResponse,
  type FlightListApiResponse,
  type MealResponse,
  type FlightResponse,
  type ResponseMessage,
  type SeatResponseMessage,
  type AircraftResponseMessage,
  type FlightSeatByAircraftResponseMessage,
  type ReqUserIDProps,
  MethodType,
  type AirportResponseMessage,
} from "../../utils/type.ts";
import type { DropdownOptions } from "../../common/Dropdown/type.ts";
import { useFetch } from "../../context/use[custom]/useFetch.ts";

const getMethod = {
  method: MethodType.GET,
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

export const useRandomPassword = () => {
  // const isValid = !!id;
  const {
    data: fetchUserPw,
    refetch: refetchUserPw,
    loading: loadingUser,
    setParams: setParamsUser,
  } = useFetch<DetailResponseMessage<string>, null>({
    url: "/sys/users/getRandomPw",
    autoFetch: false,
    config: getMethod,
  });
  return {
    fetchUserPw,
    refetchUserPw,
    loadingUser,
    setParamsUser,
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

export const useFlightMeals = () => {
  const { data: fetchFlightMeals, refetch: refetchFlightMeals } = useFetch<
    FlightMealDetailApiResponse,
    FlightMealDetailApiResponse
  >({
    url: `/sys/flight-meals`,
    autoFetch: false,
    config: getMethod,
  });
  return {
    fetchFlightMeals,
    refetchFlightMeals,
  };
};
export const useFlightMealsById = (id: string) => {
  const { data: fetchFlightMealsById, refetch: refetchFlightMealsById } =
    useFetch<FlightMealDetailApiResponse, FlightMealDetailApiResponse>({
      url: `/sys/flight-meals/${id}`,
      autoFetch: false,
      config: getMethod,
    });
  return {
    fetchFlightMealsById,
    refetchFlightMealsById,
  };
};
export const useGetMeal = () => {
  const {
    data: flightBookingData,
    refetch: refetchFlightBookingDataData,
    loading: loadingFlightBookingData,
  } = useFetch<MealResponse, MealResponse>({
    url: "/sys/meals",
    autoFetch: true,
    config: getMethod,
  });
  return {
    flightBookingData,
    refetchFlightBookingDataData,
    loadingFlightBookingData,
  };
};

export const useGetFlightData = () => {
  const {
    data: getFlightData,
    refetch: refetchGetFlightData,
    loading: loadingFlightData,
  } = useFetch<FlightResponse, null>({
    url: "/sys/flights",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getFlightData,
    refetchGetFlightData,
    loadingFlightData,
  };
};

export const useGetSeatsData = () => {
  const { data: getSeatData, refetch: refetchGetSeatData } = useFetch<
    SeatResponseMessage,
    null
  >({
    url: "/sys/seats",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getSeatData,
    refetchGetSeatData,
  };
};

export const useGetFlightByIDData = ({ id }: ReqUserIDProps) => {
  const {
    data: getFlightByIdData,
    refetch: refetchGetFlightData,
    loading: loadingFlightData,
  } = useFetch<FlightResponse, void>({
    url: id ? `/sys/flights/getFlight/${id}` : "",
    autoFetch: !!id,
    config: getMethod,
  });
  return {
    getFlightByIdData,
    refetchGetFlightData,
    loadingFlightData,
  };
};

export const useGetAircraftCode = () => {
  const { data: getAircraftCodeData, refetch: refetchGetAircraftCodeData } =
    useFetch<AircraftResponseMessage, null>({
      url: "/sys/flights/getAllAircraftBasic",
      autoFetch: true,
      config: getMethod,
    });
  return {
    getAircraftCodeData,
    refetchGetAircraftCodeData,
  };
};

export const useGetAllAircraftInfo = () => {
  const { data: getAircraftInfo, refetch: refetchGetAircraftInfo } = useFetch<
    AircraftResponseMessage,
    null
  >({
    url: "/sys/flights/aircraft",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getAircraftInfo,
    refetchGetAircraftInfo,
  };
};

export const useGetAllAirportInfo = () => {
  const { data: getAirportInfo, refetch: refetchGetAirportInfo } = useFetch<
    AirportResponseMessage,
    null
  >({
    url: "/sys/flights/airports",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getAirportInfo,
    refetchGetAirportInfo,
  };
};

export const useGetSeatByAircraftCode = (aircraftCode: string) => {
  const {
    data: getSeatByAircraftCodeData,
    refetch: refetchGetSeatByAircraftCodeData,
  } = useFetch<FlightSeatByAircraftResponseMessage, null>({
    url: `/sys/flights/aircraft/${aircraftCode}/seats`,
    autoFetch: false,
    config: getMethod,
  });
  return {
    getSeatByAircraftCodeData,
    refetchGetSeatByAircraftCodeData,
  };
};

export type UnlockStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface UnlockRequest {
  id: number;
  userId: number;
  reason: string;
  status: UnlockStatus;
  createdAt: string;
  approvedAt?: string | null;
  user: {
    id: number;
  };
}

export const useGetUnlockRequests = () => {
  const { data: getUnlockRequests, refetch: refetchGetUnlockRequests } =
    useFetch<DetailResponseMessage<UnlockRequest>, null>({
      url: "/auth/unlock-requests",
      autoFetch: true,
      config: getMethod,
    });
  return {
    getUnlockRequests,
    refetchGetUnlockRequests,
  };
};

export const useGetMyInfo = () => {
  const { data: getMyInfo, refetch } = useFetch<
    DetailResponseMessage<UserData>,
    null
  >({
    url: "",
    autoFetch: false,
    config: getMethod,
  });

  const refetchGetMyInfo = (id: number) => {
    return refetch(undefined, `/sys/users/getUserInfo/${id}`);
  };

  return {
    getMyInfo,
    refetchGetMyInfo,
  };
};

export const useFlightList = () => {
  const { data: fetchFlightList, refetch: refetchFlightList } = useFetch<
    FlightListApiResponse,
    FlightListApiResponse
  >({
    url: `/sys/flights`,
    autoFetch: true,
    config: getMethod,
  });
  return {
    fetchFlightList,
    refetchFlightList,
  };
};

type CheckMfaProps = {
  email: string;
};

export const useCheckMfaAvailable = () => {
  const { refetch: refetchMfaCheck } = useFetch<ResponseMessage, CheckMfaProps>(
    {
      url: `/auth/checkMfaSettingYn`,
      autoFetch: false,
      config: getMethod,
    }
  );
  return {
    refetchMfaCheck,
  };
};
export const useGetUserList = () => {
  // const isValid = !!id;
  const {
    data: fetchUser,
    refetch: refetchUser,
    loading: loadingUser,
  } = useFetch<UserListManageResponse, UserData>({
    url: "/sys/users",
    // params: ,
    autoFetch: true,
    config: getMethod,
  });
  return {
    fetchUser,
    refetchUser,
    loadingUser,
  };
};
export const useGetUserById = (id: number) => {
  // const isValid = !!id;
  const { data: fetchUserById, refetch: refetchUserById } = useFetch<
    UserListManageResponse,
    null
  >({
    url: `/sys/users/${id}`,
    // params: ,
    autoFetch: false,
    config: getMethod,
  });
  return {
    fetchUserById,
    refetchUserById,
  };
};
