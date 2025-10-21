import type { UnlockRequest } from "../Api/useGetApi";
import type {
  Attendance,
  LeaveRequest,
  TransferAdmin,
  UserData,
} from "../../utils/type";
import type { Payroll } from "../Admin/component/Payroll/PayrollManagement";

export type UserWithRelationsData = Pick<
  UserData,
  | "name"
  | "email"
  | "phone"
  | "role"
  | "rank"
  | "status"
  | "employeeNo"
  | "hireDate"
  | "lastLoginDate"
  | "department"
  | "position"
> & {
  attendance: AttendanceProps[];
  leaveRequests: LeaveRequest[];
  payrolls: Payroll[];
  unlockRequests: UnlockRequest[];
  transferAdmin: TransferAdmin;
};

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
