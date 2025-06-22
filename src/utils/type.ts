export enum MethodConfig {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PATCH = "PATCH",
  UPDATE = "UPDATE",
}
export enum MessageOption {
  Option00 = "00",
  Option01 = "01",
  Option02 = "02",
  Option03 = "03",
  Option04 = "05",
}
export type OptionalNumber = number | undefined;
export type SearchType = FlightTimeFields &
  FlightLocationFields &
  Pick<DataFlight, "status" | "aircraftCode">;
export type CreateDataFlight = FlightTimeFields &
  FlightLocationFields &
  FlightBasicFields;
export type AvailableAircraft = FlightTimeFields;
export type FlightTimeFields = Pick<
  DataFlight,
  "scheduledDeparture" | "scheduledArrival"
>;
export type FlightLocationFields = Pick<
  DataFlight,
  "departureAirport" | "arrivalAirport"
>;
export type FlightBasicFields = Pick<DataFlight, "flightNo" | "aircraftCode">;
export type FlightListApiResponse = FlightListResponse<DataFlight>;
export type FlightDetailApiResponse = FlightDetailResponse<DataFlight>;
export type DataFlight = {
  flightId?: OptionalNumber;
  flightNo?: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  departureAirport: string;
  arrivalAirport: string;
  status: string;
  aircraftCode: string;
  actualDeparture?: string;
  actualArrival?: string;
};

export type Aircraft = {
  aircraftCode: string;
  rangeAircraft?: string;
  model?: string;
};

export type AircraftList = {
  resultCode: string;
  resultMessage: string;
  aircraftList: Aircraft[];
};

export type FlightListResponse<T> = {
  flightList?: T[];
  resultCode: string;
  resultMessage: string;
  totalCount?: OptionalNumber;
};

export type FlightDetailResponse<T> = {
  codeList?: CodeItem[];
  flightList?: T;
  deleteStatus?: string;
  deletedFlightId?: string;
  resultCode: string;
  resultMessage: string;
  selectById?: boolean;
};

export type ResponseMessage = {
  resultCode?: string;
  resultMessage?: string;
};

export type CodeItem = {
  code: string;
  codeName?: string;
  acodeName?: string;
};
