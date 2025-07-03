export enum ErrorCode {
  INVALID_USER_INFO = "error0005",
  INVALID_PASSWORD_RULE = "error0003",
  USER_ALREADY_EXISTS = "error0006",
  EMAIL_NOT_VERIFIED = "error0007",
  INVALID_TOKEN = "error0008",
  SESSION_EXPIRED = "error0009",
  UNAUTHORIZED_ACCESS = "error0010",
  USER_NOT_FOUND = "error0011",
  INVALID_EMAIL_FORMAT = "error0012",
}

export const ERROR = {
  [ErrorCode.INVALID_USER_INFO]: "Không có ID người dùng",
  [ErrorCode.INVALID_PASSWORD_RULE]: "Mật khẩu không đúng định dạng",
  [ErrorCode.USER_ALREADY_EXISTS]: "Người dùng đã tồn tại",
  [ErrorCode.EMAIL_NOT_VERIFIED]: "Email chưa được xác thực",
  [ErrorCode.INVALID_TOKEN]: "Token không hợp lệ",
  [ErrorCode.SESSION_EXPIRED]: "Phiên đăng nhập đã hết hạn",
  [ErrorCode.UNAUTHORIZED_ACCESS]: "Không có quyền truy cập",
  [ErrorCode.USER_NOT_FOUND]: "Không tìm thấy người dùng",
  [ErrorCode.INVALID_EMAIL_FORMAT]: "Định dạng email không hợp lệ",
};
