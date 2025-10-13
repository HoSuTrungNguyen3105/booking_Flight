import {
  type FlightDetailApiResponse,
  type CodeItem,
  type UserListManageResponse,
  type UserData,
  type DetailResponseMessage,
  type FlightMealDetailApiResponse,
  type FlightListApiResponse,
  type MealResponse,
  type FlightResponse,
  type ResponseMessage,
  type SeatResponseMessage,
  type AircraftResponseMessage,
  type FlightSeatByAircraftResponseMessage,
  type ReqUserIDProps,
  MethodType,
  type AirportResponseMessage,
  type GetAllCodeResponseMessage,
  type Passenger,
  type TerminalLabelListResponse,
  type FlightBaggageDetailApiResponse,
  type TicketResponseMessage,
} from "../../utils/type.ts";
import { useFetch } from "../../context/use[custom]/useFetch.ts";
import type { Payroll } from "../../common/Sample/PayrollManagement.tsx";
import type { ActionType } from "../../common/Dropdown/SelectDropdown.tsx";
import { useEffect } from "react";

const getMethod = {
  method: MethodType.GET,
  headers: { "Content-Type": "application/json" },
};

type FlightId = {
  id?: number;
};

export interface SelectOptions {
  label: string;
  value: string;
}

export const mapStringToDropdown = (list: string[]): SelectOptions[] => {
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

export interface Booking {
  id: number;
  passengerId: string;
  flightId: number;
  bookingTime: string;
}

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
  const {
    data: flightBookingData,
    refetch: refetchFlightBookingDataData,
    loading: loadingFlightBookingData,
  } = useFetch<MealResponse, MealResponse>({
    url: "/sys/meals",
    autoFetch: true,
    config: getMethod,
  });
  return {
    flightBookingData,
    refetchFlightBookingDataData,
    loadingFlightBookingData,
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
  const { data: getTicketInfo, refetch: refetchGetTicketInfo } = useFetch<
    TicketResponseMessage,
    null
  >({
    url: "/sys/flights/tickets",
    autoFetch: true,
    config: getMethod,
  });
  return {
    getTicketInfo,
    refetchGetTicketInfo,
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

export const useGetMyInfo = () => {
  const { data: getMyInfo, refetch } = useFetch<
    DetailResponseMessage<UserData>,
    null
  >({
    url: "",
    autoFetch: false,
    config: getMethod,
  });

  const refetchGetMyInfo = (id: number) => {
    return refetch(undefined, `/sys/users/getUserInfo/${id}`);
  };

  return {
    getMyInfo,
    refetchGetMyInfo,
  };
};

export const useFlightList = () => {
  const { data: fetchFlightList, refetch: refetchFlightList } = useFetch<
    FlightListApiResponse,
    FlightListApiResponse
  >({
    url: `/sys/flights`,
    autoFetch: true,
    config: getMethod,
  });
  return {
    fetchFlightList,
    refetchFlightList,
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
  const { data, refetch, loading } = useFetch<TerminalLabelListResponse, void>({
    url: "/sys/gates/findTerminalID",
    autoFetch: true,
    config: getMethod,
  });
  return {
    dataTerminalIDStatuses: data,
    loadingFindTerminalIDStatuses: loading,
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
