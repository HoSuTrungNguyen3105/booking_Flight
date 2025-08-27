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
type AirportCode = {
  arrivalCode?: string;
  departureCode?: string;
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
    showToast: false,
  });
  const { data: airportData, refetch: refetchAirportData } = useFetch<
    FlightDetailApiResponse,
    CodeItem
  >({
    url: "/sys/flights/getAirportCode",
    params: { code: "", codeName: "", acodeName: "" },
    defaultValue: { resultCode: "", resultMessage: "" },
    autoFetch: true,
    config: getMethod,
    showToast: false,
  });
  const { data: statusData } = useFetch<FlightDetailApiResponse, CodeItem>({
    url: "/sys/flights/getStatus",
    params: { code: "", codeName: "" },
    defaultValue: { resultCode: "", resultMessage: "" },
    autoFetch: true,
    config: getMethod,
    showToast: false,
  });
  const { data: fareConditionsData } = useFetch<
    FlightDetailApiResponse,
    CodeItem
  >({
    url: "/sys/flights/getFareConditions",
    params: { code: "", codeName: "" },
    defaultValue: { resultCode: "", resultMessage: "" },
    autoFetch: true,
    config: getMethod,
    showToast: false,
  });
  const { data: optionAirportCodeData, refetch: refetchOptionAirport } =
    useFetch<FlightDetailApiResponse, CodeItem>({
      url: "",
      params: { code: "", codeName: "" },
      defaultValue: { resultCode: "", resultMessage: "" },
      autoFetch: false,
      config: getMethod,
      showToast: false,
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
    // params: ,
    autoFetch: true,
    config: getMethod,
    showToast: false,
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
    showToast: false,
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
    showToast: false,
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
      showToast: false,
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
      showToast: false,
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

export const useGetMyInfo = () => {
  const { data: getMyInfo, refetch } = useFetch<
    DetailResponseMessage<UserData>,
    UserData
  >({
    url: "", // khởi tạo rỗng
    autoFetch: false, // không fetch khi mount
    config: getMethod,
    showToast: false,
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

// export const useGetMyInfo = (id: number) => {
//   const { data: getMyInfo, refetch: refetchGetMyInfo } = useFetch<
//     DetailResponseMessage<UserData>,
//     UserData
//   >({
//     url: id ? `/sys/users/${id}` : "",
//     autoFetch: !!id,
//     config: getMethod,
//   });
//   return {
//     getMyInfo,
//     refetchGetMyInfo,
//   };
// };

// export const useGetMyInfo = () => {
//   const { data: getMyInfo, refetch: refetchGetMyInfo } = useFetch<
//     DetailResponseMessage<UserData>,
//     UserData
//   >({
//     url: "",   // ban đầu để trống
//     autoFetch: false,
//     config: getMethod,
//   });

//   // cho phép gọi refetch với id động
//   const fetchWithId = (id: number) => refetchGetMyInfo(`/sys/users/${id}`);

//   return {
//     getMyInfo,
//     refetchGetMyInfo: fetchWithId,
//   };
// };

export const useFlightList = () => {
  const { data: fetchFlightList, refetch: refetchFlightList } = useFetch<
    FlightListApiResponse,
    FlightListApiResponse
  >({
    url: `/sys/flights`,
    autoFetch: true,
    config: getMethod,
    showToast: false,
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
    showToast: false,
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
    showToast: false,
  });
  return {
    fetchUserById,
    refetchUserById,
    loadingUserById,
  };
};
