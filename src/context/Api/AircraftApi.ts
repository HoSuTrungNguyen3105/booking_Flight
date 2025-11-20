import {
  MethodType,
  type AircraftResponseMessage,
  type FlightAircraftResponse,
  type Aircraft,
  type ResponseMessage,
  type AircraftList,
  type AvailableAircraft,
} from "../../utils/type.ts";
import { useFetch } from "../use[custom]/useFetch.ts";

const getMethod = {
  method: MethodType.GET,
};

const postMethod = {
  method: MethodType.POST,
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
