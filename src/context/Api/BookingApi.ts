import {
  MethodType,
  type BookingResponseMessage,
  type FlightBookingTicketDetailApiResponse,
  type PassengerResponseMessage,
  type DetailResponseMessage,
  type Ticket,
} from "../../utils/type.ts";
import { useFetch } from "../use[custom]/useFetch.ts";
import type { SearchFlightDto } from "./../../components/Admin/component/Flight/Search_layout.tsx";

const getMethod = {
  method: MethodType.GET,
};

const postMethod = {
  method: MethodType.POST,
  headers: { "Content-Type": "application/json" },
};

export const useGetBookingList = () => {
  const { data, refetch, loading } = useFetch<BookingResponseMessage, void>({
    url: "/sys/bookings/findAllBooking",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataBookingList: data,
    refetchGetBookingList: refetch,
    loadingGetBookingList: loading,
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

export const useFindPassengerFromBooking = () => {
  const {
    data: dataPassengerFromBooking,
    refetch: refetchPassengerFromBooking,
  } = useFetch<PassengerResponseMessage, { id: string }>({
    url: "sys/bookings/find-passenger-from-booking",
    autoFetch: true,
    config: postMethod,
  });
  return { dataPassengerFromBooking, refetchPassengerFromBooking };
};

export const useFindPassengerTicket = () => {
  const { data: dataFindPassengerTicket, refetch: refetchFindPassengerTicket } =
    useFetch<DetailResponseMessage<Ticket>, { id: string }>({
      url: "/sys/flights/find-passenger-ticket",
      autoFetch: true,
      config: postMethod,
    });
  return {
    dataFindPassengerTicket,
    refetchFindPassengerTicket,
  };
};

export type GetReqponseOneTicket = { id: string; ticketNo: string };

export const useFindOnePassengerTicket = () => {
  const { data: dataFindPassengerTicket, refetch: refetchFindPassengerTicket } =
    useFetch<DetailResponseMessage<Ticket>, GetReqponseOneTicket>({
      url: "/sys/flights/find-one-passenger-ticket",
      autoFetch: false,
      config: postMethod,
    });
  return {
    dataFindPassengerTicket,
    refetchFindPassengerTicket,
  };
};
