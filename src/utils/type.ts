import type { GridRowDef } from "../common/DataGrid";
import type { Flight } from "../common/Setting/type";

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

export type CodeItem = {
  code: string;
  codeName?: string;
  acodeName?: string;
};
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

export type CreateDataFlight = FlightTimeFields &
  FlightLocationFields &
  FlightBasicFields;

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

// ✅ Dùng type cho response list
export type FlightListResponse<T> = {
  resultCode: string;
  resultMessage: string;
  user?: T[];
  accessToken?: string | null;
};
export type UserDataResponse<T> = {
  resultCode: string;
  resultMessage: string;
  user?: T;
  accessToken?: string | null;
};
export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  MONITOR = "MONITOR",
}
export type UserRoleType = UserRole.ADMIN | UserRole.USER | UserRole.MONITOR;

// ✅ TypeScript cho User (từ Prisma model)
export type UserData = GridRowDef & {
  id: number;
  email: string;
  name?: string;
  authType?: string;
  userAlias?: string;
  remember?: boolean;
  firstname?: string;
  lastname?: string;
  pictureUrl?: string;
  rank?: string;
  role?: UserRoleType; // hoặc nếu bạn có enum Role cụ thể, dùng nó
  password: string;
  createdAt?: string;
  prevPassword?: string;
  loginFailCnt?: number;
  accountLockYn?: string;
  mfaEnabledYn?: string;
  mfaSecretKey?: string;
};
export type UserDataNoGrid = {
  // userId: number;
  id: string;
  email: string;
  name?: string;
  authType?: string;
  userAlias?: string;
  remember?: boolean;
  firstname?: string;
  lastname?: string;
  pictureUrl?: string;
  rank?: string;
  role?: UserRoleType; // hoặc nếu bạn có enum Role cụ thể, dùng nó
  password: string;
  createdAt?: string;
  prevPassword?: string;
  loginFailCnt?: number;
  accountLockYn?: string;
  mfaEnabledYn?: string;
  mfaSecretKey?: string;
};
export type UseRCreate = {
  email?: string;
  name?: string;
  role?: UserRoleType; // hoặc nếu bạn có enum Role cụ thể, dùng nó
  password?: string;
};
export type UserUpdateProps = {
  userAlias?: string;
  name?: string;
  role?: UserRoleType; // hoặc nếu bạn có enum Role cụ thể, dùng nó
  rank?: string;
  pictureUrl?: string;
};
export type DetailResponseMessage<T = any> = {
  data?: T;
  list?: T[];
  resultCode: string;
  resultMessage: string;
};

interface Airport {
  code: string;
  name: string;
  city: string;
}

// interface Aircraft {
//   code: string;
//   model: string;
//   range: number;
// }
// types.ts
// export interface Flight {
//   flightId: number;
//   flightNo: string;
//   scheduledDeparture: string;
//   scheduledArrival: string;
//   departureAirport: Airport;
//   arrivalAirport: Airport;
//   status: string;
//   aircraftCode: Aircraft;
//   actualDeparture?: string | null;
//   actualArrival?: string | null;
// }

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

// export interface BaseResponseDto<T> {
//   resultCode: string;
//   resultMessage: string;
//   list: T[];
// }

// export interface ApiResponse {
//   resultCode: string;
//   resultMessage: string;
//   data: FlightMeal[];
// }

// export type FlightListApiResponse = FlightListResponse<DataFlight>;
export type UserListResponse = UserDataResponse<UserData>;
export type UserCreateResponse = DetailResponseMessage<UserDataNoGrid>;

export type MealResponse = DetailResponseMessage<Meal>;
export type FlightResponse = DetailResponseMessage<Flight>;

// export type
export type FlightDetailApiResponse = DetailResponseMessage<DataFlight>;
export type FlightMealDetailApiResponse = DetailResponseMessage<FlightMeal>;
export type UserListManageResponse = DetailResponseMessage<UserData>;
export type FlightListApiResponse = DetailResponseMessage<Flight>;
export type ResponseMessage = {
  resultCode?: string;
  resultMessage?: string;
};

export type Language = "en" | "kr" | "jp";

// export type OptionalNumber = number | undefined;
// export type SearchType = FlightTimeFields &
//   FlightLocationFields &
//   Pick<DataFlight, "status" | "aircraftCode">;
// export type CreateDataFlight = FlightTimeFields &
//   FlightLocationFields &
//   FlightBasicFields;
// export type AvailableAircraft = FlightTimeFields;
// export type FlightTimeFields = Pick<
//   DataFlight,
//   "scheduledDeparture" | "scheduledArrival"
// >;
// export type FlightLocationFields = Pick<
//   DataFlight,
//   "departureAirport" | "arrivalAirport"
// >;
// export type FlightBasicFields = Pick<DataFlight, "flightNo" | "aircraftCode">;
// export type FlightListApiResponse = FlightListResponse<DataFlight>;
// export type FlightDetailApiResponse = FlightDetailResponse<DataFlight>;
// export enum MessageOption {
//   Option00 = "00",
//   Option01 = "01",
//   Option02 = "02",
//   Option03 = "03",
//   Option04 = "05",
// }
// export type DataFlight = {
//   flightId?: OptionalNumber;
//   flightNo?: string;
//   scheduledDeparture: string;
//   scheduledArrival: string;
//   departureAirport: string;
//   arrivalAirport: string;
//   status: string;
//   aircraftCode: string;
//   actualDeparture?: string;
//   actualArrival?: string;
// };

// export type Aircraft = {
//   aircraftCode: string;
//   rangeAircraft?: string;
//   model?: string;
// };

// export type AircraftList = {
//   resultCode: string;
//   resultMessage: string;
//   aircraftList: Aircraft[];
// };

// export type FlightListResponse<T> = {
//   flightList?: T[];
//   resultCode: string;
//   resultMessage: string;
//   totalCount?: OptionalNumber;
// };

// export type FlightDetailResponse<T> = {
//   codeList?: CodeItem[];
//   flightList?: T;
//   deleteStatus?: string;
//   deletedFlightId?: string;
//   resultCode: string;
//   resultMessage: string;
//   selectById?: boolean;
// };

// export type ResponseMessage = {
//   resultCode?: string;
//   resultMessage?: string;
// };

// export type CodeItem = {
//   code: string;
//   codeName?: string;
//   acodeName?: string;
// };
