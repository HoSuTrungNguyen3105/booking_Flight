import type { DetailResponseMessage } from "../../utils/type";

export type FareConditions = "Business" | "Economy" | "Comfort";

export type UserSearchType = {
  ticketNo?: string;
  passengerCount: number;
  fareConditions: string;
  status?: string;
  flightId?: string;
  flightNo?: string;
  aircraftName?: string;
  totalAmount?: number;
  amount?: number;
  scheduledDeparture?: string;
  scheduledArrival?: string;
  departureAirport?: string;
  arrivalAirport?: string;
};

export type FlightDetailResponse = {
  flightList?: UserSearchType;
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
