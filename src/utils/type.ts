import type { GridRowDef } from "../common/DataGrid";
import type { Flight } from "../common/Setting/type";

export enum MethodConfig {
  DELETE = "DELETE",
  PATCH = "PATCH",
  UPDATE = "UPDATE",
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

  scheduledDeparture: string;
  scheduledArrival: string;
  actualDeparture?: string | null;
  actualArrival?: string | null;

  gate?: string;
  terminal?: string;
  isCancelled?: boolean;
  delayMinutes?: number | null;

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

  meals?: any[];
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

// export type CreateDataFlight = FlightTimeFields &
//   FlightLocationFields &
//   FlightBasicFields;
// export type CreateDataFlight = <Flight>;
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
  isBooked: boolean;
  flightId?: number;
  bookingId?: number;
  type: string;

  //Add type
  isWindow?: boolean;
  nearRestroom?: boolean;
};
// Định nghĩa type cho Employee
interface Employee {
  id: number;
  name: string;
  email: string;
}

// Định nghĩa type cho LeaveRequest
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

interface AircraftCodeName {
  code: string;
  model: string;
  range: number;
}
export type AircraftResponseMessage = DetailResponseMessage<AircraftCodeName>;

export type SeatResponseMessage = DetailResponseMessage<Seat>;

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  MONITOR = "MONITOR",
}

export type UserRoleType = UserRole.ADMIN | UserRole.USER | UserRole.MONITOR;

export type BaseUserData = {
  email: string;
  name?: string;
  authType?: string;
  userAlias?: string;
  remember?: boolean;
  firstname?: string;
  lastname?: string;
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
  id: string;
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

export type UserListResponse = UserDataResponse<UserData>;
export type UserCreateResponse = DetailResponseMessage<UserDataNoGrid>;

export type MealResponse = DetailResponseMessage<Meal>;
export type FlightResponse = DetailResponseMessage<Flight>;

export type FlightDetailApiResponse = DetailResponseMessage<Flight>;
export type FlightMealDetailApiResponse = DetailResponseMessage<FlightMeal>;
export type UserListManageResponse = DetailResponseMessage<UserData>;
export type FlightListApiResponse = DetailResponseMessage<Flight>;
export type EmailProps = {
  email?: string;
  userId?: number;
};
export type RegisterResponseMessage = DetailResponseMessage<EmailProps>;

export type ResponseMessage = {
  resultCode: string;
  resultMessage: string;
};

export type Language = "en" | "ko" | "jp";
