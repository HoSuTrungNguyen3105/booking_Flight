import type { UnlockRequest } from "../../components/Api/useGetApi";
import type { Attendance, LeaveRequest } from "../../utils/type";
import type { Payroll } from "./PayrollManagement";

export interface UserWithRelationsData {
  name: string;
  email: string;
  phone: string | null;
  role: string;
  rank: string | null;
  status: string;
  employeeNo: string | null;
  hireDate: number | string | null;
  attendance: AttendanceProps[];
  leaveRequests: LeaveRequest[];
  payrolls: Payroll[];
  unlockRequests: UnlockRequest[];
}

export type AttendanceProps = Pick<
  Attendance,
  "id" | "date" | "checkIn" | "checkOut" | "createdAt"
>;

export type LeaveRequestProps = Pick<
  LeaveRequest,
  "id" | "leaveType" | "startDate" | "endDate" | "status" | "decidedAt"
>;

export type PayrollProps = Pick<Payroll, "id" | "month" | "year" | "netPay">;

export type UnlockRequestProps = Pick<
  UnlockRequest,
  "id" | "status" | "createdAt"
>;
