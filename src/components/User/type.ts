import type { DetailResponseMessage, Terminal } from "../../utils/type";

export type FareConditions = "Business" | "Economy" | "Comfort";

// export type SearchTicketType = {
//   ticketNo?: string;
//   passengerCount: number;
//   status?: string;
//   flightNo?: string;
//   aircraftName?: string;
//   totalAmount?: number;
//   amount?: number;
//   scheduledDeparture?: string;
//   scheduledArrival?: string;
//   departureAirport?: string;
//   arrivalAirport?: string;
// };

export type SearchTicketType = {
  flightNo?: string;
  from: string;
  to: string;
  departDate?: number;
  returnDate?: number;
  passengers?: number;
  flightType?: "oneway" | "roundtrip";
  cabinClass?: string; //"ECONOMY" | "BUSINESS" | "VIP"
  aircraftCode?: string;
  status?: string;
  //| "scheduled"
  // | "boarding"
  // | "departed"
  // | "arrived"
  // | "delayed"
  // | "cancelled";
  minPrice?: number;
  maxPrice?: number;
  gate?: string;
  terminal?: string;
  minDelayMinutes?: number;
  maxDelayMinutes?: number;
  includeCancelled?: boolean;
};

export type FlightDetailResponse = {
  // flightList?: SearchTicketType;
  resultCode: string;
  resultMessage: string;
};

// type Formatter<P> = string | ((params?: P) => string);

// export const format1: Formatter<number> = "Giá trị mặc định";

// export const format2: Formatter<number> = (num) => `Số là: ${num}`;

interface MfaResponse {
  userId: number;
  hasVerified: string;
  secret: string;
  qrCodeDataURL: string;
}

export type MFAAuthResponse = DetailResponseMessage<MfaResponse>;

export type TerminalResponse = DetailResponseMessage<Terminal>;
