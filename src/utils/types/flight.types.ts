import type { Seat } from "./booking.types";
import {
  type DetailResponseMessage,
  type TypeWithErrorResponse,
} from "./common.types";
import type { Meal } from "./meal.types";

export enum FlightStatusType {
  SCHEDULED = "SCHEDULED",
  BOARDING = "BOARDING",
  DELAYED = "DELAYED",
  DEPARTED = "DEPARTED",
  IN_AIR = "IN_AIR",
  ARRIVED = "ARRIVED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export type FlightStatus = {
  id: number;
  flightId?: number;
  status: string;
  description: string;
  updatedAt: number;
  flight: DataFlight;
};

export type DataFlight = {
  flightId?: number;
  flightNo?: string;
  flightType?: string;
  departureAirport: string;
  arrivalAirport: string;
  // status: string;
  aircraftCode: string;
  priceEconomy?: number;
  priceBusiness?: number;
  priceFirst?: number;
  scheduledDeparture: number;
  scheduledArrival: number;
  actualDeparture?: number | null;
  actualArrival?: number | null;
  gateId?: string;
  isDomestic?: boolean;
  aircraft?: Aircraft;
  departureAirportRel?: Airport;
  arrivalAirportRel?: Airport;
  meals?: Meal[];
  seats?: Seat[];
  flightStatuses?: FlightStatus[];
  _count?: {
    seats: number;
    meals: number;
    bookings: number;
    gateAssignments: number;
    flightStatuses: number;
  };
};

export type FlightTimeFields = Pick<
  DataFlight,
  "scheduledDeparture" | "scheduledArrival"
>;

export type FlightLocationFields = Pick<
  DataFlight,
  "departureAirport" | "arrivalAirport"
>;

export type FlightBasicFields = Pick<DataFlight, "flightNo" | "aircraftCode">;

export type SearchType = FlightTimeFields &
  FlightLocationFields &
  Pick<DataFlight, "aircraftCode">;

export type FareConditions = "Business" | "Economy" | "Comfort";

export type SearchTicketType = {
  flightNo?: string;
  from: string;
  to: string;
  departDate?: number;
  returnDate?: number;
  flightType?: string;
  cabinClass?: string;
  aircraftCode?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  gate?: string;
  terminal?: string;
  minDelayMinutes?: number;
  maxDelayMinutes?: number;
  includeCancelled?: boolean;
};

export type AvailableAircraft = FlightTimeFields;

export type FlightInAircraft = Pick<DataFlight, "flightNo">;

export type Aircraft = {
  code: string;
  range?: number;
  model?: string;
  manufacturer?: string;
  totalSeats?: number;
  imageAircraft?: string;
  flights?: FlightInAircraft[];
};

export interface CreateManyFlightResultItem {
  code?: string;
  error?: boolean;
  resultCode?: string;
  resultMessage?: string;
  errorCode?: string;
  errorMessage?: string;
}

export type AircraftList = {
  resultCode: string;
  resultMessage: string;
  aircraftList: Aircraft[];
};

export type FlightListResponse<T> = {
  resultCode: string;
  resultMessage: string;
  user?: T[];
  accessToken?: string | null;
};

export type FlightSeat = {
  flightId: number;
  flightNo: string;
  seats: Seat[];
};

export type FlightSeatByAircraftResponseMessage =
  DetailResponseMessage<FlightSeat>;

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  createdAt?: number | string;
  updatedAt?: number | string;
}

export interface CreateAirportReq {
  code: string;
  name: string;
  city: string;
  country: string;
}

export type UpdateAirportReq = Omit<CreateAirportReq, "code">;

export interface FlightCodeItem {
  code: string;
  value: string;
}

export interface AllFlightCodeProps {
  aircraft: FlightCodeItem[];
  airport: FlightCodeItem[];
}

export type FlightInStatus = {
  flightNo: string;
  flightId: number;
  flightStatuses: FlightStatus[];
};

export type GateStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "CLOSED";

export type CreateGateReq = {
  code: string;
  terminalId: string;
  status?: GateStatus;
  createdAt?: number;
  updatedAt?: number;
};

export type FacilityType =
  | "RESTAURANT"
  | "SHOP"
  | "LOUNGE"
  | "ATM"
  | "WIFI"
  | "CHARGING_STATION"
  | "INFORMATION"
  | "MEDICAL"
  | "PRAYER_ROOM"
  | "SMOKING_AREA";

export type Terminal = {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: "DOMESTIC" | "INTERNATIONAL" | "CARGO";
  airportId: string;
  createdAt: string;
  updatedAt: string;
  airport: Airport;
  gates: Gate[];
  facilities: Facility[];
};

export interface GateAssignment {
  id: string;
  gateId: string;
  flightId: number;
  assignedAt: number;
  releasedAt: number;
  createdAt: number;
  updatedAt: number;
}

export type Gate = {
  id: string;
  code: string;
  terminalId: string;
  status: string;
  createdAt: number;
  updatedAt: number;
  assignments: GateAssignment[];
};

export type Facility = {
  id: string;
  name: string;
  type: string;
  description?: string;
  terminalId: string;
  location?: string;
  openingHours?: string;
  createdAt: number;
  updatedAt: number;
  terminal: Terminal;
};

interface FlightResponseWithPagination {
  resultCode: string;
  resultMessage: string;
  list: DataFlight[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type FacilyByTerminalIdResponseMessage = DetailResponseMessage<Facility>;

export type TerminalResponse = DetailResponseMessage<Terminal>;

export type FlightResponse = FlightResponseWithPagination;

export type FlightDetailApiResponse = DetailResponseMessage<DataFlight>;

export type SearchFlightResponse = DetailResponseMessage<SearchFlightProps>;

// export type FlightListApiResponse = DetailResponseMessage<DataFlight>;
export type FlightAircraftResponse =
  DetailResponseMessage<AircraftCodeBatchProps>;

export type StatusResponseMessage = DetailResponseMessage<FlightInStatus>;

export type AircraftResponseMessage = DetailResponseMessage<Aircraft>;

export type AirportCreateResponseMessage =
  DetailResponseMessage<TypeWithErrorResponse>;

export type AirportResponseMessage = DetailResponseMessage<Airport>;

export type GetAllCodeResponseMessage =
  DetailResponseMessage<AllFlightCodeProps>;

export interface FlightDiscount {
  id: number;
  discountCodeId: number;
  flightId: number;
  createdAt: number;
  discountCode?: DiscountCode;
  flight?: DataFlight;
}

export interface GeoNearbyCity {
  id: number;
  wikiDataId: string;
  type: string;
  city: string;
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  population: number;
  distance: number;
}

export interface GeoNearbyCitiesResponse {
  data: GeoNearbyCity[];
  metadata?: {
    currentOffset?: number;
    totalCount?: number;
  };
}

export interface DiscountCode {
  id: number;
  code: string;
  description?: string;
  discountAmount?: number;
  discountPercent?: number;
  isPercentage: boolean;
  active: boolean;
  validFrom: number;
  validTo: number;
  usageLimit?: number;
  usedCount: number;
  createdAt: number;
  updatedAt: number;
  flights?: FlightDiscount[];
}

export type TerminalType = "INTERNATIONAL" | "DOMESTIC" | "BUSINESS";

export type CreateTerminalDto = {
  code: string;
  name: string;
  description?: string;
  type: TerminalType;
  airportId: string;
};

export interface SearchFlightFromPassengerParams {
  departureAirport?: string;
  arrivalAirport?: string;
  scheduledDeparture?: number;
  scheduledArrival?: number;
  passengers?: number;
  flightClass?: string;
}

export type SearchFlightProps = {
  outbound: DataFlight[];
  inbound: DataFlight[];
};

export type AircraftCodeBatchProps = {
  code: string;
  errorCode: string;
  errorMessage: string;
};

export type CreateGateProps = {
  code: string;
  terminalId: string;
  status: string;
};

export type TerminalLabelValue = {
  value: string;
  label: string;
};

export type FlightByDay = {
  day: string;
  date: string;
  year: number;
};

export type TerminalLabelListResponse =
  DetailResponseMessage<TerminalLabelValue>;
