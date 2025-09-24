import type { GridRowDef } from "../common/DataGrid";
import type { Flight } from "../common/Setting/type";
import type { SeatTypeValue } from "../components/Api/usePostApi";

export enum MethodType {
  DELETE = "DELETE",
  PATCH = "PATCH",
  PUT = "PUT",
  GET = "GET",
  POST = "POST",
}
export interface ReqUserIDProps {
  id?: number;
}

export type CodeItem = {
  code: string;
  codeName?: string;
  acodeName?: string;
};

export type DataFlight = {
  flightId?: number;
  flightNo?: string;
  flightType?: string; // one-way / roundtrip
  departureAirport: string;
  arrivalAirport: string;
  status: string;
  aircraftCode: string;

  priceEconomy?: number;
  priceBusiness?: number;
  priceFirst?: number;
  maxCapacity?: number;

  scheduledDeparture: number;
  scheduledArrival: number;
  actualDeparture?: number | null;
  actualArrival?: number | null;

  gateId?: string;
  terminal?: string;
  isCancelled?: boolean;
  delayMinutes?: number | null;
  cancellationReason?: string;
  delayReason?: string;
  aircraft?: {
    code: string;
    model: string;
    range: number;
  };
  departureAirportRel?: {
    code: string;
    name: string;
    city: string;
    coordinates: string;
    timezone: string;
  };

  arrivalAirportRel?: {
    code: string;
    name: string;
    city: string;
    coordinates: string;
    timezone: string;
  };
  meals?: Meal[];
  seats?: Seat[];
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
  Pick<DataFlight, "status" | "aircraftCode">;

export type FareConditions = "Business" | "Economy" | "Comfort";

export type SearchTicketType = {
  flightNo?: string;
  from: string;
  to: string;
  departDate?: number;
  returnDate?: number;
  // passengers?: number;
  flightType?: string;
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

interface MfaResponse {
  userId: number;
  hasVerified: string;
  secret: string;
  qrCodeDataURL: string;
}

export type MFAAuthResponse = DetailResponseMessage<MfaResponse>;

export type TerminalResponse = DetailResponseMessage<Terminal>;

export type AvailableAircraft = FlightTimeFields;

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
  resultCode: string;
  resultMessage: string;
  user?: T[];
  accessToken?: string | null;
};

export type UserDataResponse<T> = {
  resultCode: string;
  resultMessage: string;
  data?: T;
  requireChangePassword?: boolean;
  requireUnlock?: boolean;
  requireVerified?: boolean;
  accessToken?: string | null;
  userId: number;
};

export type RegisterOTPCodeVerifyResponse = {
  resultCode: string;
  resultMessage: string;
  requireChangePassword?: boolean;
  userId: number;
};

export type DataResponseId = {
  resultCode: string;
  resultMessage: string;
  data?: { id: number };
  requireChangePassword?: boolean;
  requireUnlock?: boolean;
  accessToken?: string | null;
  userId: number;
};

export type Seat = {
  id: number;
  seatNumber: number;
  seatRow: string;
  flightId?: number;
  bookingId?: number;
  // position: PositionTypeValue;
  type: SeatTypeValue;

  //Add type
  // isWindow?: boolean;
  // nearRestroom?: boolean;
  // isAvailable?: boolean;
  isBooked: boolean;
  isAvailable?: boolean;
  isExtraLegroom?: boolean;
  isExitRow?: boolean;
  isHandicapAccessible?: boolean;
  isNearLavatory?: boolean;
  isUpperDeck?: boolean;
  isWing?: boolean;
  note?: string;
};

interface Employee {
  id: number;
  name: string;
  email: string;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  leaveType: string; // "ANNUAL" | "SICK" | "UNPAID"
  startDate: string;
  endDate: string;
  days: number;
  reason?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  approverId?: number | null;
  approverNote?: string | null;
  appliedAt: string;
  decidedAt?: string | null;
  employee: Employee;
}

// Props cho component
// interface LeaveRequestProps {
//   data: LeaveRequest;
// }

export type FlightSeat = {
  flightId: number;
  flightNo: string;
  seats: Seat[];
};

export type FlightSeatByAircraftResponseMessage =
  DetailResponseMessage<FlightSeat>;
interface FlightInfoAircraft {
  flightId: number;
  flightNo: string;
}

export interface AirportCodeProps {
  code: string;
  name: string;
  city: string;
  country: string;
  createdAt: number | string;
  updatedAt: null;
}
interface AircraftCodeName {
  code: string;
  model: string;
  range: number;
  flights?: FlightInfoAircraft[];
}

export interface FlightCodeItem {
  code: string;
}

interface AllFlightCodeProps {
  aircraft: FlightCodeItem[];
  airport: FlightCodeItem[];
}

export type AircraftResponseMessage = DetailResponseMessage<AircraftCodeName>;

export type AirportResponseMessage = DetailResponseMessage<AirportCodeProps>;

export type GetAllCodeResponseMessage =
  DetailResponseMessage<AllFlightCodeProps>;

export type SeatResponseMessage = DetailResponseMessage<Seat>;

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  MONITOR = "MONITOR",
}

export type GateStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "CLOSED";

export type CreateGateReq = {
  code: string;
  terminalId: string;
  status?: GateStatus;
  createdAt?: number;
  updatedAt?: number;
};

export type UserRoleType = UserRole.ADMIN | UserRole.USER | UserRole.MONITOR;

export type BaseUserData = {
  id: number;
  email: string;
  name?: string;
  authType?: string;
  userAlias?: string;
  remember?: boolean;
  pictureUrl?: string;
  rank?: string;
  role?: UserRoleType;
  passport?: string;
  baseSalary?: number;
  hireDate?: number;
  phone?: string;
  password: string;
  createdAt?: string;
  prevPassword?: string;
  loginFailCnt?: number;
  accountLockYn?: string;
  mfaEnabledYn?: string;
  mfaSecretKey?: string;
};

export type UserData = BaseUserData &
  GridRowDef & {
    id: number;
  };

export type UserDataNoGrid = BaseUserData & {
  userId?: number;
};

export type UserCreateProps = {
  email?: string;
  name?: string;
  role?: UserRoleType;
  password?: string;
};

export enum EmployeeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  TERMINATED = "TERMINATED",
}

export type AdminUpdateUserForm = {
  id: number;
  department?: string;
  position?: string;
  hireDate?: number;
  status?: EmployeeStatus;
  baseSalary?: number;
};

export type UserUpdateProps = {
  name?: string;
  userAlias?: string;
  role?: UserRoleType;
  pictureUrl?: string;
  passport?: string;
  phone?: string;
};

export type DetailResponseMessage<T = null> = {
  data?: T;
  list?: T[];
  resultCode: string;
  resultMessage: string;
};

export interface Airport {
  code: string;
  name: string;
  city: string;
}

export interface FlightMeal {
  id: number;
  flightId: number;
  mealId: number;
  quantity: number;
  price?: number;
  flight: Flight;
  meal: Meal;
}

export interface Meal {
  id: number;
  name: string;
  mealType: string;
  description?: string;
  price: number;
  isAvailable: boolean;
  flightMeals: FlightMeal[];
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
export type UserListResponse = UserDataResponse<UserData>;
export type UserCreateResponse = DetailResponseMessage<UserDataNoGrid>;

export type MealResponse = DetailResponseMessage<Meal>;
export type FlightResponse = DetailResponseMessage<DataFlight>;

export type FlightDetailApiResponse = DetailResponseMessage<Flight>;

export type SearchFlightResponse = DetailResponseMessage<SearchFlightProps>;

export type FlightMealDetailApiResponse = DetailResponseMessage<FlightMeal>;
export type UserListManageResponse = DetailResponseMessage<UserData>;
export type FlightListApiResponse = DetailResponseMessage<Flight>;
export type FlightAircraftResponse =
  DetailResponseMessage<AircraftCodeBatchProps>;

export type EmailProps = {
  email?: string;
  userId?: number;
};

export enum FacilityType {
  RESTAURANT = "RESTAURANT",
  SHOP = "SHOP",
  LOUNGE = "LOUNGE",
  ATM = "ATM",
  WIFI = "WIFI",
  CHARGING_STATION = "CHARGING_STATION",
  INFORMATION = "INFORMATION",
  MEDICAL = "MEDICAL",
  PRAYER_ROOM = "PRAYER_ROOM",
  SMOKING_AREA = "SMOKING_AREA",
}
// export type Airport = {
//   code: string;
//   name: string;
//   city: string;
//   country: string;
//   createdAt: string; // timestamp kiểu string
//   updatedAt: string | null;
// };

export type Terminal = {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: "DOMESTIC" | "INTERNATIONAL" | "CARGO"; // enum TerminalType
  airportId: string;
  createdAt: string;
  updatedAt: string;
  airport: Airport;
  gates: Gate[];
  facilities: Facility[];
};

export type Gate = {
  id: string;
  code: string;
  terminalId: string;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE"; // enum GateStatus
  createdAt: number;
  updatedAt: number;
};

export type Facility = {
  id: string;
  name: string;
  type: string; // enum FacilityType nếu có
  description?: string;
  terminalId: string;
  location?: string;
  openingHours?: string;
  createdAt: string;
  updatedAt: string;
};

// export interface Terminal {
//   id: string;
//   code: string;
//   name: string;
//   description?: string;
//   type: string;
//   airportId: string;
//   createdAt: string;
//   updatedAt: string;
// }

export type RegisterResponseMessage = DetailResponseMessage<EmailProps>;

export type ResponseMessage = {
  resultCode: string;
  resultMessage: string;
};

export type Language = "en" | "ko" | "jp";
