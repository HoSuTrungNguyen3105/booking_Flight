import { type DetailResponseMessage } from "./common.types";
import { type TypeStatus, type UserData } from "./user.types";

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

export type AttendanceResponseMessage = DetailResponseMessage<Attendance>;
