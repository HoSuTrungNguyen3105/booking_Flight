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
  // React.useEffect(() => {
  //   try {
  //     if (airportData?.codeList) {
  //       const airportDropdown = mapToDropdown(airportData?.codeList, "code");
  //       setAirport(airportDropdown);
  //       setAirportName(mapToDropdown(airportData?.codeList, "codeName"));
  //       setAirportAName(mapToDropdown(airportData?.codeList, "acodeName"));
  //       setDepartureAirportList((prev) =>
  //         prev.length === 0 ? airportDropdown : prev
  //       );
  //       setArrivalAirportList((prev) =>
  //         prev.length === 0 ? airportDropdown : prev
  //       );
  //     }
  //     if (aircraftData?.codeList) {
  //       setAircraft(mapToDropdown(aircraftData.codeList, "code"));
  //       setAircraftName(mapToDropdown(aircraftData.codeList, "codeName"));
  //     }
  //     if (statusData?.codeList) {
  //       setStatus(mapToDropdown(statusData.codeList, "code"));
  //     }
  //     if (fareConditionsData?.codeList) {
  //       setFareConditions(mapToDropdown(fareConditionsData.codeList, "code"));
  //     }
  //   } catch (err) {
  //     setErrorFetch("An error occurred while processing flight codes.");
  //     console.error(err);
  //   }
  // }, [airportData, aircraftData, statusData, fareConditionsData]);

  // const optionAirport = async ({ arrivalCode, departureCode }: AirportCode) => {
  //   const arrivalUrl = arrivalCode
  //     ? `/sys/flights/departure-options?arrivalCode=${arrivalCode}`
  //     : "";
  //   const departureUrl = departureCode
  //     ? `/sys/flights/arrival-options?departureCode=${departureCode}`
  //     : "";
  //   try {
  //     const [resArrival, resDeparture] = await Promise.all([
  //       arrivalCode
  //         ? refetchOptionAirport(undefined, arrivalUrl)
  //         : Promise.resolve(undefined),
  //       departureCode
  //         ? refetchOptionAirport(undefined, departureUrl)
  //         : Promise.resolve(undefined),
  //     ]);
  //     if (resArrival?.codeList) {
  //       setArrivalAirportList(mapToDropdown(resArrival.codeList, "code"));
  //     }
  //     if (resDeparture?.codeList) {
  //       setDepartureAirportList(mapToDropdown(resDeparture.codeList, "code"));
  //     }
  //     return { resArrival, resDeparture };
  //   } catch (error) {
  //     console.error("Error:", error);
  //     return { resArrival: undefined, resDeparture: undefined };
  //   }
  // };
  // const handleDepartureChange = async (options: DropdownOptions[]) => {
  //   setDepartureAirportList(options);
  //   if (options.length > 0) {
  //     const selectedDepartureCode = String(options[0].value);
  //     const { resDeparture } = await optionAirport({
  //       departureCode: selectedDepartureCode,
  //     });
  //     const arrivalOptions = resDeparture?.codeList || [];
  //     const mappedArrival = mapToDropdown(arrivalOptions, "code");
  //     const currentArrivalValue = getValues?.("arrivalAirport");
  //     const stillValid = mappedArrival.some(
  //       (opt) => opt.value === currentArrivalValue
  //     );
  //     if (!stillValid && resetField) {
  //       resetField("arrivalAirport");
  //     }
  //     const finalArrivalList = stillValid
  //       ? mappedArrival
  //       : currentArrivalValue
  //       ? [
  //           { label: currentArrivalValue, value: currentArrivalValue },
  //           ...mappedArrival,
  //         ]
  //       : mappedArrival;
  //     setArrivalAirportList(finalArrivalList);
  //   }
  // };
  // const handleArrivalChange = async (options: DropdownOptions[]) => {
  //   setArrivalAirportList(options);
  //   if (options.length > 0) {
  //     const selectedArrivalCode = String(options[0].value);
  //     const { resArrival } = await optionAirport({
  //       arrivalCode: selectedArrivalCode,
  //     });
  //     const departureOptions = resArrival?.codeList || [];
  //     const mappedDeparture = mapToDropdown(departureOptions, "code");
  //     const currentDepartureValue = getValues?.("departureAirport");
  //     const airportCodesOnly = departureOptions.map((item) => item.code);
  //     console.log("Danh sách airport code:", airportCodesOnly);
  //     const stillValid = mappedDeparture.some(
  //       (opt) => opt.value === currentDepartureValue
  //     );
  //     if (!stillValid && resetField) {
  //       resetField("departureAirport");
  //     }
  //     const finalDepartureList = stillValid
  //       ? mappedDeparture
  //       : currentDepartureValue
  //       ? [
  //           { label: currentDepartureValue, value: currentDepartureValue },
  //           ...mappedDeparture,
  //         ]
  //       : mappedDeparture;
  //     setDepartureAirportList(finalDepartureList);
  //   }
  // };
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
    // optionAirport,
    refetchAirportData,
    // handleDepartureChange,
    // handleArrivalChange,
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
export const useGetMyInfo = (id: number) => {
  const { data: getMyInfo, refetch: refetchGetMyInfo } = useFetch<
    DetailResponseMessage<UserData>,
    UserData
  >({
    url: `/sys/users/${id}`,
    autoFetch: true,
    config: getMethod,
  });
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
    showToast: false,
  });
  return {
    fetchFlightList,
    refetchFlightList,
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
