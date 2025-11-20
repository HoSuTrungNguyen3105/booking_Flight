import {
  MethodType,
  type SeatResponseMessage,
  type FlightSeatByAircraftResponseMessage,
  type ReqUserIDProps,
  type DetailResponseMessage,
  type Seat,
  type FlightDetailApiResponse,
  type SeatUpdateProps,
  type ResponseMessage,
} from "../../utils/type.ts";
import { useFetch } from "../use[custom]/useFetch.ts";

const getMethod = {
  method: MethodType.GET,
};

const postMethod = {
  method: MethodType.POST,
  headers: { "Content-Type": "application/json" },
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
