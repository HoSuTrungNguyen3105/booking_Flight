import type { GridRowDef } from "../../common/DataGrid";
import type { AuthType } from "../../components/Auth/Login";
import {
  type DetailResponseMessage,
  // type SocketResponseMessage,
} from "./common.types";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  DEV = "DEV",
  MONITOR = "MONITOR",
}

export type UserRoleType =
  | UserRole.ADMIN
  | UserRole.USER
  | UserRole.MONITOR
  | UserRole.DEV;

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

export type UserCreateResponse = DetailResponseMessage<UserDataNoGrid>;
export type UserListManageResponse = DetailResponseMessage<UserData>;

export type CheckMfaProps = {
  email: string;
};

interface MfaResponse {
  userId: number;
  hasVerified: string;
  secret: string;
  qrCodeDataURL: string;
}

export type MFAAuthResponse = DetailResponseMessage<MfaResponse>;

export type PasswordProps = {
  password: string;
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

export type TypeStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface TransferAdmin {
  id: number;
  userId: number;
  fromUserId: number;
  toUserId: number;
  status: TypeStatus;
  requestedAt: string | number;
  approvedAt?: string | number | null;
}

export interface UserSession {
  id: number;
  userId: number;
  token: string;
  createdAt: number | null;
  device: string | null;
  browser: string | null;
  location: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  isCurrent: boolean;
}

export type VerifyOTPProps = {
  userId: string;
  type: AuthType;
  otp: string;
};

export type EmailProps = {
  email?: string;
  userId?: string | number;
  authType?: string;
  onClose?: () => void;
};

export type RegisterResponseMessage = DetailResponseMessage<EmailProps>;

export interface ChangeEmailPassengerProps {
  // email: string;
  id: string;
  newEmail: string;
}

export interface VerifyOtpFromEmailChangeProps {
  id: string;
  otp: string;
}

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
