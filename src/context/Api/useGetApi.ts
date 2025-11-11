import {
  MethodType,
  type FlightDetailApiResponse,
  type UserListManageResponse,
  type UserData,
  type DetailResponseMessage,
  type FlightMealDetailApiResponse,
  type FlightListApiResponse,
  type MealResponse,
  type FlightResponse,
  type SeatResponseMessage,
  type AircraftResponseMessage,
  type FlightSeatByAircraftResponseMessage,
  type ReqUserIDProps,
  type AirportResponseMessage,
  type GetAllCodeResponseMessage,
  type Passenger,
  type TerminalLabelListResponse,
  type FlightBaggageDetailApiResponse,
  type TicketResponseMessage,
  type TransferAdmin,
  type StatusResponseMessage,
  type Seat,
  type TerminalResponse,
  type GetIDToDeleteData,
  type LeaveRequest,
  type UserUpdateProps,
  type AttendanceResponseMessage,
  type FacilyByTerminalIdResponseMessage,
  type Payroll,
  type BookingResponseMessage,
  type Hotel,
  type UserSession,
  type SearchFlightFromPassengerParams,
} from "../../utils/type.ts";
import { useFetch } from "../use[custom]/useFetch.ts";
import type { ActionType } from "../../common/Dropdown/SelectDropdown.tsx";
import { useEffect } from "react";
import type { UserWithRelationsData } from "../../components/Sample/type.ts";

const getMethod = {
  method: MethodType.GET,
  // headers: { "Content-Type": "application/json" },
};

type FlightId = {
  id?: number;
};

export interface SelectOptions {
  label: string;
  value: string;
}

export const mapStringToDropdown: (list: string[]) => SelectOptions[] = (
  list
) => {
  return list.map((item) => ({
    label: item,
    value: item,
  }));
};

export const useRandomPassword = () => {
  const {
    data: fetchUserPw,
    refetch: refetchUserPw,
    loading: loadingUser,
  } = useFetch<DetailResponseMessage<string>, null>({
    url: "/sys/users/getRandomPw",
    autoFetch: false,
    config: getMethod,
  });
  return {
    fetchUserPw,
    refetchUserPw,
    loadingUser,
  };
};

export const usefindAllTransferRequests = () => {
  const {
    data: dataFindAllTransferRequests,
    refetch: refetchFindAllTransferRequests,
    loading: loadingFindAllTransferRequests,
  } = useFetch<DetailResponseMessage<TransferAdmin>, void>({
    url: "/sys/users/view/all-transfer-requests",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataFindAllTransferRequests,
    refetchFindAllTransferRequests,
    loadingFindAllTransferRequests,
  };
};

// export const useFlightList = () => {
//   const { data: flightList, refetch: refetchFlightList } = useFetch<
//     FlightListApiResponse,
//     null
//   >({
//     url: "/sys/flights",
//     defaultValue: { resultCode: "", resultMessage: "" },
//     autoFetch: true,
//     config: getMethod,
//   });
//   return {
//     flightList,
//     refetchFlightList,
//   };
// };

// export interface Booking {
//   id: number;
//   passengerId: string;
//   flightId: number;
//   bookingTime: string;
// }

export const useFindAllPassenger = () => {
  const {
    data: dataAllPassenger,
    refetch: refetchAllPassenger,
    loading: loadingAllPassenger,
  } = useFetch<DetailResponseMessage<Passenger>, null>({
    url: "/sys/bookings/findAllPassenger",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataAllPassenger,
    refetchAllPassenger,
    loadingAllPassenger,
  };
};

export const useFlightById = ({ id }: FlightId) => {
  const isValid = !!id;
  const { data: fetchFlightId, refetch: refetchFlightId } = useFetch<
    FlightDetailApiResponse,
    FlightId
  >({
    url: isValid ? `/sys/flights/flights/${id}` : "",
    params: {},
    autoFetch: false,
    config: getMethod,
  });
  return {
    fetchFlightId,
    refetchFlightId,
  };
};
export const useGetFlightMealsById = (id: number) => {
  const {
    data: fetchFlightMealsById,
    refetch: refetchFlightMealsById,
    loading: loadingFlightMealsById,
    error: errorFlightMealsById,
  } = useFetch<FlightMealDetailApiResponse, void>({
    url: `/sys/flight-meals/${id}`,
    autoFetch: false,
    config: getMethod,
  });

  useEffect(() => {
    if (id && id > 0) {
      refetchFlightMealsById();
    }
  }, [id]);

  return {
    fetchFlightMealsById,
    refetchFlightMealsById,
    loadingFlightMealsById,
    errorFlightMealsById,
  };
};

export const useGetMeal = () => {
  const { data, refetch, loading } = useFetch<MealResponse, MealResponse>({
    url: "/sys/meals",
    autoFetch: true,
    config: getMethod,
  });
  return {
    mealData: data,
    refetchMealData: refetch,
    loadingMealData: loading,
  };
};

export const useGetFlightData = () => {
  const {
    data: getFlightData,
    refetch: refetchGetFlightData,
    loading: loadingFlightData,
  } = useFetch<FlightResponse, null>({
    url: "/sys/flights",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getFlightData,
    refetchGetFlightData,
    loadingFlightData,
  };
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

export const useGetFlightByIDData = ({ id }: ReqUserIDProps) => {
  const {
    data: getFlightByIdData,
    refetch: refetchGetFlightData,
    loading: loadingFlightData,
  } = useFetch<FlightResponse, void>({
    url: id ? `/sys/flights/getFlight/${id}` : "",
    autoFetch: !!id,
    config: getMethod,
  });
  return {
    getFlightByIdData,
    refetchGetFlightData,
    loadingFlightData,
  };
};

export const useGetUserIdAndNameToDropdownGeneratePayroll = () => {
  const { refetch, data, loading } = useFetch<
    DetailResponseMessage<ActionType>,
    void
  >({
    url: "/sys/payrolls/getUserIdAndNameToDropdown",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataGetUserIdAndNameToDropdown: data,
    refetchGetUserIdAndNameToDropdown: refetch,
    loadingGetUserIdAndNameToDropdown: loading,
  };
};

export const useGetPayrollsById = (id: number) => {
  const { refetch, data, loading } = useFetch<
    DetailResponseMessage<Payroll>,
    void
  >({
    url: `/sys/payrolls/payroll/getById/${String(id)}`,
    autoFetch: !!id,
    config: getMethod,
  });
  return {
    dataGetPayrollsById: data,
    refetchGetPayrollsById: refetch,
    loadingGetPayrollsById: loading,
  };
};

export const useGetAllInfoFlightByIDData = ({ id }: ReqUserIDProps) => {
  const {
    data: getAllInfoFlightByIdData,
    refetch: refetchGetAllInfoFlightData,
    loading: loadingFlightData,
  } = useFetch<FlightResponse, void>({
    url: id ? `/sys/flights/getFlightAllInfo/${id}` : "",
    autoFetch: !!id,
    config: getMethod,
  });
  return {
    getAllInfoFlightByIdData,
    refetchGetAllInfoFlightData,
    loadingFlightData,
  };
};

export const useGetAircraftCode = () => {
  const { data: getAircraftCodeData, refetch: refetchGetAircraftCodeData } =
    useFetch<AircraftResponseMessage, null>({
      url: "/sys/flights/getAllAircraftBasic",
      autoFetch: true,
      config: getMethod,
    });
  return {
    getAircraftCodeData,
    refetchGetAircraftCodeData,
  };
};

export const useGetAllAircraftInfo = () => {
  const { data: getAircraftInfo, refetch: refetchGetAircraftInfo } = useFetch<
    AircraftResponseMessage,
    null
  >({
    url: "/sys/flights/aircraft",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getAircraftInfo,
    refetchGetAircraftInfo,
  };
};

export const useGetAllFlightMainInfo = () => {
  const { data: getAllFlightInfoInfo, refetch: refetchGetAllFlightInfoInfo } =
    useFetch<FlightDetailApiResponse, null>({
      url: "/sys/flights/flight-info/main",
      autoFetch: true,
      config: getMethod,
    });
  return {
    getAllFlightInfoInfo,
    refetchGetAllFlightInfoInfo,
  };
};

export const useGetAllHotels = () => {
  const { data: dataGetAllHotels, refetch: refetchGetAllHotels } = useFetch<
    DetailResponseMessage<Hotel>,
    void
  >({
    url: "/sys/hotels",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataGetAllHotels,
    refetchGetAllHotels,
  };
};

export const useGetHotelByHotelCode = (hotelCode: string) => {
  const { data: dataHotelByHotelCode, refetch: refetchGetHotelByHotelCode } =
    useFetch<DetailResponseMessage<Hotel>, void>({
      url: `/sys/hotels/find-by-hotel-code/${hotelCode}`,
      autoFetch: !!hotelCode,
      config: getMethod,
    });
  return {
    dataHotelByHotelCode,
    refetchGetHotelByHotelCode,
  };
};

export const useGetAllFlightIds = () => {
  const { data: getAllFlightIds, refetch: refetchGetAllFlightIds } = useFetch<
    StatusResponseMessage,
    void
  >({
    url: "/sys/flights/flightIds/status",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getAllFlightIds,
    refetchGetAllFlightIds,
  };
};

export const useGetAllAirportInfo = () => {
  const { data: getAirportInfo, refetch: refetchGetAirportInfo } = useFetch<
    AirportResponseMessage,
    null
  >({
    url: "/sys/flights/airports",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getAirportInfo,
    refetchGetAirportInfo,
  };
};

// export const useGetAllAirportInfo = () => {
//   const { refetch, loading } = useFetch<Blob, void>({
//     url,
//     config: {
//       method: "GET",
//       responseType: "blob",
//     },
//     autoFetch: false,
//   });
// };

export const useExportPayrollExcel = () => {
  const { refetch, loading } = useFetch<DetailResponseMessage<string>, void>({
    url: "/sys/users/init/exportPayrollsToExcel",
    config: getMethod,
    autoFetch: false,
  });

  const exportExcel = async () => {
    const res = await refetch();
    if (res?.data) {
      const byteCharacters = atob(res.data); // decode base64
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "payroll.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  return { exportExcel, loading };
};

export const useExportFlightExcel = () => {
  const { refetch, loading } = useFetch<DetailResponseMessage<string>, void>({
    url: "/sys/users/init/exportFlightsToExcel",
    config: getMethod,
    autoFetch: false,
  });

  const exportExcel = async () => {
    const res = await refetch();
    if (res?.data) {
      const byteCharacters = atob(res.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "flights.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  return { exportExcel, loading };
};

export const useGetAllTicketInfo = () => {
  const {
    data: getTicketInfo,
    refetch: refetchGetTicketInfo,
    loading: loadingGetTicketInfo,
  } = useFetch<TicketResponseMessage, null>({
    url: "/sys/flights/tickets",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getTicketInfo,
    refetchGetTicketInfo,
    loadingGetTicketInfo,
  };
};

export const useGetAllCode = () => {
  const { data: getAllCode, refetch: refetchGetAllCode } = useFetch<
    GetAllCodeResponseMessage,
    null
  >({
    url: "/sys/flights/getAllCode",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getAllCode,
    refetchGetAllCode,
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

export interface UnlockRequest {
  id: number;
  userId: number;
  reason: string;
  status: string;
  createdAt: string;
  approvedAt?: string | null;
  user: {
    id: number;
  };
}

export const useGetUnlockRequests = () => {
  const { data: getUnlockRequests, refetch: refetchGetUnlockRequests } =
    useFetch<DetailResponseMessage<UnlockRequest>, null>({
      url: "/auth/unlock-requests",
      autoFetch: true,
      config: getMethod,
    });
  return {
    getUnlockRequests,
    refetchGetUnlockRequests,
  };
};

export const useGetBaggageData = () => {
  const { refetch: refetchBaggageData, data: dataBaggage } = useFetch<
    FlightBaggageDetailApiResponse,
    void
  >({
    url: "sys/bookings/baggage",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataBaggage,
    refetchBaggageData,
  };
};

// export const useFlightList = () => {
//   const { data: fetchFlightList, refetch: refetchFlightList } = useFetch<
//     FlightListApiResponse,
//     FlightListApiResponse
//   >({
//     url: `/sys/flights`,
//     autoFetch: true,
//     config: getMethod,
//   });
//   return {
//     fetchFlightList,
//     refetchFlightList,
//   };
// };

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

export const useGetTerminalData = () => {
  const { data: getTerminalData, refetch: refetchGetTerminalData } = useFetch<
    TerminalResponse,
    void
  >({
    url: "/sys/flights/terminal",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getTerminalData,
    refetchGetTerminalData,
  };
};

export const useGetUserWithRelations = ({ id }: GetIDToDeleteData) => {
  const {
    refetch: refetchGetUserWithRelations,
    data: dataGetUserWithRelations,
  } = useFetch<DetailResponseMessage<UserWithRelationsData>, void>({
    url: `/auth/getUserWithRelations/${id as string}`,
    autoFetch: !!id,
    config: getMethod,
  });
  return {
    dataGetUserWithRelations,
    refetchGetUserWithRelations,
  };
};

export const useGetUserList = () => {
  const { data, refetch, loading } = useFetch<UserListManageResponse, UserData>(
    {
      url: "/sys/users",
      autoFetch: true,
      config: getMethod,
    }
  );
  return {
    fetchUserList: data,
    refetchUser: refetch,
    loadingUser: loading,
  };
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

type GateCodeRes = {
  id: string;
  code: string;
};

export const useGetAllGateCode = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<GateCodeRes>,
    void
  >({
    url: "/sys/gates/findAllGateCode",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataAllGateCode: data,
    refetchGetAllGateCode: refetch,
    loadingAllGateCode: loading,
  };
};

export const useGetLeaveRequest = () => {
  const {
    data: dataGetLeaveRequest,
    refetch: refetchGetLeaveRequest,
    loading: loadingGetLeaveRequest,
  } = useFetch<DetailResponseMessage<LeaveRequest>, UserUpdateProps>({
    url: "/sys/users/leave-requests/all",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataGetLeaveRequest,
    loadingGetLeaveRequest,
    refetchGetLeaveRequest,
  };
};

export const useGetAllAttendance = () => {
  const { refetch, loading, data } = useFetch<AttendanceResponseMessage, void>({
    url: "/sys/users/attendance/all",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataAllAttendance: data,
    refetchAllAttendance: refetch,
    loadingAllAttendance: loading,
  };
};

export const useGetUserById = (id: number) => {
  const { data: fetchUserById, refetch: refetchUserById } = useFetch<
    UserListManageResponse,
    null
  >({
    url: `/sys/users/${id}`,
    // params: ,
    autoFetch: false,
    config: getMethod,
  });
  return {
    fetchUserById,
    refetchUserById,
  };
};

export const useFindTerminalIDStatuses = () => {
  const { data, loading } = useFetch<TerminalLabelListResponse, void>({
    url: "/sys/gates/findTerminalID",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataTerminalIDStatuses: data,
    loadingFindTerminalIDStatuses: loading,
  };
};

export const useGetFaclilityByTerminalID = (terminalId: string) => {
  const { data, refetch } = useFetch<FacilyByTerminalIdResponseMessage, void>({
    url: `/sys/gates/by-terminal/${terminalId}`,
    autoFetch: !!terminalId,
    config: getMethod,
  });
  return {
    dataGetFaclilityByTerminalID: data,
    refetchGetFaclilityByTerminalID: refetch,
  };
};
export type MyRequestUnlockProps = {
  id: number;
  status: string;
  createdAt: string;
  reason: string;
};

export const useGetMyRequestUnlock = (id?: number) => {
  const { data: dataGetMyRequestUnlock, refetch: refetchGetMyRequestUnlock } =
    useFetch<DetailResponseMessage<MyRequestUnlockProps>, void>({
      url: `/sys/users/my_request-unlock/${id}`,
      autoFetch: !!id,
      config: getMethod,
    });

  return {
    dataGetMyRequestUnlock,
    refetchGetMyRequestUnlock,
  };
};

// Role
export const useFindAllRoles = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<string[]>,
    null
  >({
    url: "/sys/enums/roles",
    autoFetch: true,
    config: getMethod,
  });
  return { dataRoles: data, refetchRoles: refetch, loadingRoles: loading };
};

// LeaveStatus
export const useFindAllLeaveStatuses = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<string[]>,
    null
  >({
    url: "/sys/enums/leave-statuses",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataLeaveStatuses: data,
    refetchLeaveStatuses: refetch,
    loadingLeaveStatuses: loading,
  };
};

export const useFindAllFlightStatuses = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<string[]>,
    null
  >({
    url: "/sys/enums/flight-statuses",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataFlightStatuses: data,
    refetchFlightStatuses: refetch,
    loadingFlightStatuses: loading,
  };
};

// UnlockStatus
export const useFindAllUnlockStatuses = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<string[]>,
    null
  >({
    url: "/sys/enums/unlock-statuses",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataUnlockStatuses: data,
    refetchUnlockStatuses: refetch,
    loadingUnlockStatuses: loading,
  };
};

// EmployeeStatus
export const useFindAllEmployeeStatuses = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<string[]>,
    null
  >({
    url: "/sys/enums/employee-statuses",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataEmployeeStatuses: data,
    refetchEmployeeStatuses: refetch,
    loadingEmployeeStatuses: loading,
  };
};

// AttendanceStatus
export const useFindAllAttendanceStatuses = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<string[]>,
    null
  >({
    url: "/sys/enums/attendance-statuses",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataAttendanceStatuses: data,
    refetchAttendanceStatuses: refetch,
    loadingAttendanceStatuses: loading,
  };
};

// PayrollStatus
export const useFindAllPayrollStatuses = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<string[]>,
    null
  >({
    url: "/sys/enums/payroll-statuses",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataPayrollStatuses: data,
    refetchPayrollStatuses: refetch,
    loadingPayrollStatuses: loading,
  };
};

export const useGetPayrollData = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<Payroll>,
    null
  >({
    url: "/sys/payrolls",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataPayroll: data,
    refetchPayroll: refetch,
    loadingPayroll: loading,
  };
};

// Department
export const useFindAllDepartments = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<string[]>,
    null
  >({
    url: "/sys/enums/departments",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataDepartments: data,
    refetchDepartments: refetch,
    loadingDepartments: loading,
  };
};

// Position
export const useFindAllPositions = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<string[]>,
    null
  >({
    url: "/sys/enums/positions",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataPositions: data,
    refetchPositions: refetch,
    loadingPositions: loading,
  };
};

// Rank
export const useFindAllRanks = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<string[]>,
    null
  >({
    url: "/sys/enums/ranks",
    autoFetch: true,
    config: getMethod,
  });
  return { dataRanks: data, refetchRanks: refetch, loadingRanks: loading };
};

// TerminalType
export const useFindAllTerminalTypes = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<string[]>,
    null
  >({
    url: "/sys/enums/terminal-types",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataTerminalTypes: data,
    refetchTerminalTypes: refetch,
    loadingTerminalTypes: loading,
  };
};

export const useFindAllAirportIds = () => {
  const { data, loading } = useFetch<
    DetailResponseMessage<{ code: string }>,
    null
  >({
    url: "/sys/flights/getAllAirportIds",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataFindAllAirportIds: data,
    loadingFindAllAirportIds: loading,
  };
};

// GateStatus
export const useFindAllGateStatuses = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<string[]>,
    null
  >({
    url: "/sys/enums/gate-statuses",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataGateStatuses: data,
    refetchGateStatuses: refetch,
    loadingGateStatuses: loading,
  };
};

// FacilityType
export const useFindAllFacilityTypes = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<string[]>,
    null
  >({
    url: "/sys/enums/facility-types",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataFacilityTypes: data,
    refetchFacilityTypes: refetch,
    loadingFacilityTypes: loading,
  };
};

// SeatType
export const useFindAllSeatTypes = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<string[]>,
    null
  >({
    url: "/sys/enums/seat-types",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataSeatTypes: data,
    refetchSeatTypes: refetch,
    loadingSeatTypes: loading,
  };
};

export interface FlightSearchFromPassengerRes {
  flightId: number;
  flightNo: string;
  departureAirport: string;
  arrivalAirport: string;
  scheduledDeparture: number; // timestamp (mili giây)
  scheduledArrival: number; // timestamp (mili giây)
  flightClass: string;
  seats: number;
}

export const useSearchFlightFromPassenger = () => {
  const { refetch, loading, setParams } = useFetch<
    DetailResponseMessage<string[]>,
    SearchFlightFromPassengerParams
  >({
    url: "/sys/flights/passenger/searchs",
    autoFetch: false,
    config: getMethod,
  });
  return {
    setParamsSearch: setParams,
    refetchSeatTypes: refetch,
    loadingSeatTypes: loading,
  };
};

export const useFindAllFlightTypes = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<string[]>,
    null
  >({
    url: "/sys/enums/flight-types",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataFlightTypes: data,
    refetchFlightTypes: refetch,
    loadingFlightTypes: loading,
  };
};

// MealType
export const useFindAllMealTypes = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<string[]>,
    null
  >({
    url: "/sys/enums/meal-types",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataMealTypes: data,
    refetchMealTypes: refetch,
    loadingMealTypes: loading,
  };
};
