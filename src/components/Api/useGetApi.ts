import type {
  FlightDetailApiResponse,
  CodeItem,
  SearchType,
  UserListManageResponse,
  UserData,
  DetailResponseMessage,
  FlightMealDetailApiResponse,
  FlightListApiResponse,
  MealResponse,
  FlightResponse,
  ResponseMessage,
  SeatResponseMessage,
  AircraftResponseMessage,
  FlightSeatByAircraftResponseMessage,
} from "../../utils/type.ts";
import React from "react";
import { MethodType } from "../../hooks/type.ts";
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
export const useFlightCode = (
  resetField?: (name: keyof SearchType) => void,
  getValues?: (name: keyof SearchType) => any
) => {
  const [airport, setAirport] = React.useState<DropdownOptions[]>([]);
  const [aircraft, setAircraft] = React.useState<DropdownOptions[]>([]);
  const [airportName, setAirportName] = React.useState<DropdownOptions[]>([]);
  const [airportAName, setAirportAName] = React.useState<DropdownOptions[]>([]);
  const [aircraftName, setAircraftName] = React.useState<DropdownOptions[]>([]);
  const [status, setStatus] = React.useState<DropdownOptions[]>([]);
  const [fareConditions, setFareConditions] = React.useState<DropdownOptions[]>(
    []
  );
  const [optionAirportCode, setOptionAirportCode] = React.useState<
    DropdownOptions[]
  >([]);
  const [departureAirportList, setDepartureAirportList] = React.useState<
    DropdownOptions[]
  >([]);
  const [arrivalAirportList, setArrivalAirportList] = React.useState<
    DropdownOptions[]
  >([]);
  const [errorFetch, setErrorFetch] = React.useState<string | null>(null);
  const { data: aircraftData } = useFetch<FlightDetailApiResponse, CodeItem>({
    url: "/sys/flights/getAircraftCode",
    params: { code: "", codeName: "" },
    defaultValue: { resultCode: "", resultMessage: "" },
    autoFetch: true,
    config: getMethod,
  });
  const { data: airportData, refetch: refetchAirportData } = useFetch<
    FlightDetailApiResponse,
    CodeItem
  >({
    url: "/sys/flights/getAirportCode",
    params: { code: "", codeName: "", acodeName: "" },
    autoFetch: true,
    config: getMethod,
  });
  const { data: statusData } = useFetch<FlightDetailApiResponse, CodeItem>({
    url: "/sys/flights/getStatus",
    params: { code: "", codeName: "" },
    autoFetch: true,
    config: getMethod,
  });
  const { data: fareConditionsData } = useFetch<
    FlightDetailApiResponse,
    CodeItem
  >({
    url: "/sys/flights/getFareConditions",
    params: { code: "", codeName: "" },
    autoFetch: true,
    config: getMethod,
  });
  const { data: optionAirportCodeData, refetch: refetchOptionAirport } =
    useFetch<FlightDetailApiResponse, CodeItem>({
      url: "",
      params: { code: "", codeName: "" },
      autoFetch: false,
      config: getMethod,
    });
  return {
    airport,
    airportName,
    airportAName,
    aircraft,
    aircraftName,
    status,
    fareConditions,
    optionAirportCode,
    optionAirportCodeData,
    refetchAirportData,
    departureAirportList,
    setDepartureAirportList,
    arrivalAirportList,
    setArrivalAirportList,
    errorFetch,
    mapToDropdown,
  };
};
export const useRandomPassword = () => {
  // const isValid = !!id;
  const {
    data: fetchUserPw,
    refetch: refetchUserPw,
    loading: loadingUser,
    setParams: setParamsUser,
  } = useFetch<DetailResponseMessage, DetailResponseMessage>({
    url: "/sys/users/getRandomPw",
    autoFetch: true,
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
  const { data: flightBookingData, refetch: refetchFlightBookingDataData } =
    useFetch<MealResponse, MealResponse>({
      url: "/sys/meals",
      autoFetch: false,
      config: getMethod,
    });
  return {
    flightBookingData,
    refetchFlightBookingDataData,
  };
};

export const useGetFlightData = () => {
  const { data: getFlightData, refetch: refetchGetFlightData } = useFetch<
    FlightResponse,
    FlightResponse
  >({
    url: "/sys/flights",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getFlightData,
    refetchGetFlightData,
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
    UserData
  >({
    url: "", // khởi tạo rỗng
    autoFetch: false, // không fetch khi mount
    config: getMethod,
  });

  // refetch với id động
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
export const useGetUserById = (id: string) => {
  // const isValid = !!id;
  const {
    data: fetchUserById,
    refetch: refetchUserById,
    loading: loadingUserById,
  } = useFetch<UserListManageResponse, UserData>({
    url: `/sys/users/${id}`,
    // params: ,
    autoFetch: false,
    config: getMethod,
  });
  return {
    fetchUserById,
    refetchUserById,
    loadingUserById,
  };
};
