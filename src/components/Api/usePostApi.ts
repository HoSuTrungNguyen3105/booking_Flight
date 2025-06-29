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
} from "../../utils/type.ts";
import { MethodType } from "../../hooks/type";
import type { DropdownOptions } from "../../common/Dropdown/type.ts";
import { useFetch } from "../../hooks/useFetch.ts";
import type { FlightDetailResponse, UserSearchType } from "../User/type.ts";

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
// type AirportCode = {
//   arrivalCode?: string;
//   departureCode?: string;
// };
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

// export const useFlightUpdate = (data:Dat) => {
//   const { data: updateFlightId, refetch:refetchUpdateFlightId } = useFetch<FlightDetailApiResponse, DataFlight>({
//     url: `/sys/flights/flights/${data.flightId}`,
//     defaultValue: { resultCode: '', resultMessage: '' },
//     autoFetch: false,
//     config: putMethod,
//     message: messageMethod,
//     showToast: true,
//   });
//   // const refetchUpdateFlightId = (data: DataFlight) => {
//   //   return refetch(data, `/sys/flights/flights/${data.flightId}`);
//   // };
//   return {
//     updateFlightId,
//     refetchUpdateFlightId,
//   };
// };

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
