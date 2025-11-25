import {
  MethodType,
  type DataFlight,
  type DetailResponseMessage,
  type Payroll,
  type SearchFlightFromPassengerParams,
  type SearchFlightResponse,
} from "../../utils/type";
import { useFetch } from "../use[custom]/useFetch";

const getMethod = {
  method: MethodType.GET,
};

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

export const useFindAllPermissionsRole = () => {
  const { data: dataPermissionsRole, refetch: refetchPermissionsRole } =
    useFetch<DetailResponseMessage<Record<string, boolean>>, void>({
      url: "/auth/permissions/type/enum",
      autoFetch: true,
      config: getMethod,
    });
  return {
    dataPermissionsRole,
    refetchPermissionsRole,
  };
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
  const { data, refetch, loading, setParams } = useFetch<
    SearchFlightResponse,
    SearchFlightFromPassengerParams
  >({
    url: "/sys/flights/passenger/searchs",
    autoFetch: false,
    config: getMethod,
  });
  return {
    dataSearchFlightFromPassenger: data,
    setParamsSearch: setParams,
    refetchSearchFlightFromPassenger: refetch,
    loadingSearchFlightFromPassenger: loading,
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
