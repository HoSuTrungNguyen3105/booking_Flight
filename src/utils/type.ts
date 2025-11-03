import type { GridRowDef } from "../common/DataGrid";
// import type { SeatTypeValue } from "../context/Api/usePostApi";

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

export type GetIDToDeleteData = {
  id: number | string;
};

export type CheckMfaProps = {
  email: string;
};

export type SeatTypeValue = "ECONOMY" | "BUSINESS" | "FIRST" | "VIP";

// export type SeatPosition = "WINDOW" | "MIDDLE" | "AISLE";

export interface SeatUpdateProps {
  seatIds: number[];
  data: {
    type?: SeatTypeValue;
    price?: number;
    isBooked?: boolean;
    isAvailable?: boolean;
    isExtraLegroom?: boolean;
    isExitRow?: boolean;
    isHandicapAccessible?: boolean;
    isNearLavatory?: boolean;
    isUpperDeck?: boolean;
    isWing?: boolean;
    note?: string;
  };
}

// export type DeleteUserProps = {
//   id: number;
// };

export type CodeItem = {
  code: string;
  codeName?: string;
  acodeName?: string;
};

export type FlightStatus = {
  id: number;
  flightId?: number;
  status: string;
  description: string;
  updatedAt: number;
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
  // terminal?: string;
  isDomestic?: boolean;
  isCancelled?: boolean;
  delayMinutes?: number | null;
  cancellationReason?: string;
  delayReason?: string;
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

interface MfaResponse {
  userId: number;
  hasVerified: string;
  secret: string;
  qrCodeDataURL: string;
}

export type MFAAuthResponse = DetailResponseMessage<MfaResponse>;

export type TerminalResponse = DetailResponseMessage<Terminal>;

export type AvailableAircraft = FlightTimeFields;

export type FlightInAircraft = Pick<DataFlight, "flightNo">;

export type Aircraft = {
  code: string;
  range?: number;
  model?: string;
  flights?: FlightInAircraft[];
};

export type PasswordProps = {
  password: string;
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

export type LoginDataResponse<T> = {
  resultCode: string;
  resultMessage: string;
  data?: T;
  requireChangePassword?: boolean;
  requireUnlock?: boolean;
  requireVerified?: boolean;
  accessToken?: string | null;
  userId: number;
};

export type RequestSendEmailResponse = {
  resultCode: string;
  resultMessage: string;
  requireVerified?: boolean;
  userId: number;
};

export type RegisterOTPCodeVerifyResponse = {
  resultCode: string;
  resultMessage: string;
  requireChangePassword?: boolean;
  userId: number;
};

export type ResponseGGAuthenticate = {
  resultCode: string;
  resultMessage: string;
  data?: { id: number };
  requireChangePassword?: boolean;
  requireUnlock?: boolean;
  accessToken?: string | null;
  userId: number;
};

// interface Employee {
//   id: number;
//   name: string;
//   email: string;
// }

export type TypeStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface LeaveRequest {
  id: number;
  employeeId: number;
  leaveType: string; // "ANNUAL" | "SICK" | "UNPAID"
  startDate: string;
  endDate: string;
  days: number;
  reason?: string | null;
  status: TypeStatus;
  approverId?: number | null;
  approverNote?: string | null;
  appliedAt: string;
  decidedAt?: string | null;
  employee: UserData;
}

export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "ON_LEAVE"
  | "REMOTE";

export interface Attendance {
  id: number;
  employeeId: number;
  date: number;
  checkIn: number;
  checkOut: number;
  status: AttendanceStatus;
  workedHours?: number | null;
  note?: string | null;
  createdAt: number;

  employee?: UserData;
}

export type FlightSeat = {
  flightId: number;
  flightNo: string;
  seats: Seat[];
};

export type FlightSeatByAircraftResponseMessage =
  DetailResponseMessage<FlightSeat>;

// interface FlightInfoAircraft {
//   flightId: number;
//   flightNo: string;
// }

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  createdAt?: number | string;
  updatedAt?: number | string;
}

export interface TypeWithErrorResponse {
  code?: string;
  errorCode: string;
  errorMessage: string;
}

// type BatchAirportResponse = {
//     code: string;
//     errorCode: string;
//     errorMessage: string;
// };

export interface CreateAirportReq {
  code: string;
  name: string;
  city: string;
  country: string;
}

export type UpdateAirportReq = Omit<CreateAirportReq, "code">;
// export interface AircraftCodeName {
//   code: string;
//   model: string;
//   range: number;
//   flights?: FlightInfoAircraft[];
// }

export interface FlightCodeItem {
  code: string;
  value: string;
}

interface AllFlightCodeProps {
  aircraft: FlightCodeItem[];
  airport: FlightCodeItem[];
}

export type FlightInStatus = {
  flightNo: string;
  flightId: number;
  flightStatuses: FlightStatus[];
};

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
  email: string;
  id: number;
  name?: string;
  authType?: string;
  userAlias?: string;
  remember?: boolean;
  pictureUrl?: string;
  status: string;
  rank?: string;
  role?: UserRoleType;
  employeeNo?: string;
  department: string;
  position: string;
  baseSalary?: number;
  hireDate?: number;
  phone?: string;
  password: string;
  createdAt?: string;
  prevPassword?: string;
  loginFailCnt?: number;
  lastLoginDate: number;
  accountLockYn?: string;
  mfaEnabledYn?: string;
  mfaSecretKey?: string;
  toTransferAdminUserYn?: string;
  fromTransferAdminUserYn?: string;
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
  employeeNo?: string;
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
  baseSalary?: number;
  status?: EmployeeStatus;
  name?: string;
  role?: UserRole;
};

export type EmployeeType = {
  id: number;
  email: string;
  name: string;
  position: string;
  department: string;
  payrolls: Payroll[];
  hireDate: string | null;
};

export interface Payroll {
  id: number;
  employeeId: number;
  month: number;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  tax: number;
  netPay: number;
  status: string; //"DRAFT" | "FINALIZED"
  generatedAt: string;
  employee: EmployeeType;
}

export interface GeneratePayroll {
  employeeId: number;
  month: number;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  tax: number;
}

export interface CreateMealDto extends Omit<Meal, "id" | "flightMeals"> {}

export type UserUpdateProps = {
  name?: string;
  userAlias?: string;
  role?: UserRoleType;
  phone?: string;
  pictureUrl?: string;
  baseSalary?: number;
  departmentId?: string;
  position?: string;
  employeeNo?: string;
  hireDate?: number;
};

export type DetailResponseMessage<T = null> = {
  data?: T;
  list?: T[];
  resultCode: string;
  resultMessage: string;
};

export type SocketResponseMessage<T = null> = {
  data?: {
    list?: T[];
    resultCode: string;
    resultMessage: string;
  };
};

export interface FlightMeal {
  id: number;
  flightId: number;
  mealId: number;
  quantity: number;
  price?: number;
  flight: DataFlight;
  meal: Meal;
}

export interface Meal {
  id: number;
  mealCode: string;
  name: string;
  mealType: string;
  description?: string;
  price: number;
  isAvailable: boolean;
  flightMeals: FlightMeal[];
}
export type MealType =
  | "VEG"
  | "NONVEG"
  | "DRINK"
  | "DESSERT"
  | "BEVERAGE"
  | "SNACK"
  | "DINNER"
  | "LUNCH"
  | "BREAKFAST";

export type MealRequestDto = Omit<Meal, "id" | "flightMeals">;

export type SearchBookingFlightProps = {
  id: number;
  passengerId: string;
  flightId: number;
  bookingTime: number;
  flight: DataFlight;
};

export type Conversation = {
  userId: number;
  name: string;
  lastMessage: string;
  timestamp: number;
};

export type SendMessageProps = {
  receiverId: number;
  senderId: number;
  content: string;
};

export type TerminalLabelValue = {
  value: string;
  label: string;
};

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  senderId: number;
  receiverId: number;
  sender: {
    id: number;
    name: string;
    pictureUrl: string;
    email: string;
  };
  receiver: {
    id: number;
    name: string;
    pictureUrl: string;
    email: string;
  };
}

export type MessageBetweenUserLoginResponse = SocketResponseMessage<Message>;

export type SearchFlightSearchBookingFlightPropsProps = {
  outbound: SearchBookingFlightProps[];
  inbound: SearchBookingFlightProps[];
};

export type SearchFlightProps = {
  outbound: DataFlight[];
  inbound: DataFlight[];
};

export type AircraftCodeBatchProps = {
  code: string;
  errorCode: string;
  errorMessage: string;
};

export interface Ticket {
  id: number;
  ticketNo: string;
  passengerId: string;
  flightId: number;
  seatClass: "ECONOMY" | "BUSINESS";
  seatNo: string;
  bookedAt: string; // ISO datetime hoặc number nếu backend trả về timestamp

  // Quan hệ
  passenger?: Passenger;
  flight?: DataFlight;
  boardingPass?: BoardingPass | null;
  baggage?: Baggage[];
}

export interface BoardingPass {
  id: number;
  ticketId: number;
  issuedAt: string;
  gate: string;
  boardingTime: string;
  flightId: number;

  ticket?: Ticket;
  flight?: DataFlight;
}

export interface Baggage {
  id: number;
  flightId: number;
  weight: number;
  status: string;
  checkedAt: string;
  ticketId: number;

  flight?: DataFlight;
  ticket?: Ticket;
}

export type FlightBookingTicketDetailApiResponse =
  DetailResponseMessage<SearchFlightSearchBookingFlightPropsProps>;

export type FlightBaggageDetailApiResponse = DetailResponseMessage<Baggage>;

export type TerminalLabelListResponse =
  DetailResponseMessage<TerminalLabelValue>;

// export type UserListResponse = LoginDataResponse<UserData>;
export type UserCreateResponse = DetailResponseMessage<UserDataNoGrid>;

export type MealResponse = DetailResponseMessage<Meal>;
export type FlightResponse = DetailResponseMessage<DataFlight>;

export type FlightDetailApiResponse = DetailResponseMessage<DataFlight>;

export type SearchFlightResponse = DetailResponseMessage<SearchFlightProps>;

export type FlightMealDetailApiResponse = DetailResponseMessage<FlightMeal>;
export type MessageApiResponse = DetailResponseMessage<Message>;

export type ResConversationsResponse = DetailResponseMessage<Conversation>;

export type UserListManageResponse = DetailResponseMessage<UserData>;
export type FlightListApiResponse = DetailResponseMessage<DataFlight>;
export type FlightAircraftResponse =
  DetailResponseMessage<AircraftCodeBatchProps>;

export type StatusResponseMessage = DetailResponseMessage<FlightInStatus>;

export type AttendanceResponseMessage = DetailResponseMessage<Attendance>;

export type AircraftResponseMessage = DetailResponseMessage<Aircraft>;

export type AirportCreateResponseMessage =
  DetailResponseMessage<TypeWithErrorResponse>;

export type AirportResponseMessage = DetailResponseMessage<Airport>;

export type TicketResponseMessage = DetailResponseMessage<Ticket>;

export type GetAllCodeResponseMessage =
  DetailResponseMessage<AllFlightCodeProps>;

export type SeatResponseMessage = DetailResponseMessage<Seat>;

export type EmailProps = {
  email?: string;
  userId?: number;
  authType?: string;
  onClose?: () => void;
};

export interface TransferAdmin {
  id: number;
  userId: number;
  fromUserId: number;
  toUserId: number;
  status: TypeStatus;
  requestedAt: string | number;
  approvedAt?: string | number | null;
}

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
  //  {
  //   id: string;
  //   name: string;
  // };
};
export type FacilyByTerminalIdResponseMessage = DetailResponseMessage<Facility>;

export type RegisterResponseMessage = DetailResponseMessage<EmailProps>;
export type PassengerResponseMessage = DetailResponseMessage<Passenger>;

export type ResponseMessage = {
  resultCode: string;
  resultMessage: string;
};

export type Seat = {
  id: number;
  seatNumber: number;
  seatRow: string;
  flightId?: number;
  bookingId?: number;
  type: SeatTypeValue;
  price: number;
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

export interface Booking {
  id: number;
  bookingTime: string;
  mealOrders: MealOrder[];
  flight: DataFlight;
  seats: Seat;

  passengerId: string;
  flightId: number;
  passenger: Passenger;
}

export type BookingResponseMessage = DetailResponseMessage<Booking>;

export interface MealOrder {
  id: number;
  bookingId: number;
  mealId: number;
  quantity: number;
}

export interface Passenger {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passport: string;
  accountLockYn: string;
  isEmailVerified: string;
  lastLoginDate?: number;
  bookings: Booking[];
}

export type TerminalType = "INTERNATIONAL" | "DOMESTIC" | "BUSINESS";

export type CreateTerminalDto = {
  code: string;
  name: string;
  description?: string;
  type: TerminalType;
  airportId: string;
};

export type CreateGateProps = {
  code: string;
  terminalId: string;
  status: string;
};

export interface ChangePasswordProps {
  userId: number;
  newPassword: string;
  confirmPassword: string;
}

export type ChangePasswordInProfile = Omit<
  ChangePasswordProps,
  "currentPassword"
>;

export interface ResetPasswordByMfa {
  email: string;
  mfaCode: string;
}

export interface EmailUserProps {
  email: string;
}
export interface UserIdResponse {
  userId: number;
}

export type Language = "en" | "ko" | "jp";
