export const ErrorCodes = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  EMPTY_FIELDS: "EMPTY_FIELDS",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  INVALID_PASSWORD: "INVALID_PASSWORD",
  NETWORK_ERROR: "NETWORK_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  INVALID_EMAIL: "INVALID_EMAIL",
  ACCOUNT_DISABLED: "ACCOUNT_DISABLED",
  TOO_MANY_ATTEMPTS: "TOO_MANY_ATTEMPTS",
  PASSWORD_NOT_MATCH: "PASSWORD_NOT_MATCH",
  USERNAME_EXISTS: "USERNAME_EXISTS",
  EMAIL_EXISTS: "EMAIL_EXISTS",
  INVALID_USERNAME: "INVALID_USERNAME",
  PASSWORD_TOO_SHORT: "PASSWORD_TOO_SHORT",
  REGISTRATION_FAILED: "REGISTRATION_FAILED",
  PASSWORD_MISMATCH: "PASSWORD_MISMATCH",
} as const;

export const ErrorMessages: Record<keyof typeof ErrorCodes, string> = {
  [ErrorCodes.INVALID_CREDENTIALS]: "Tên đăng nhập hoặc mật khẩu không đúng",
  [ErrorCodes.EMPTY_FIELDS]: "Vui lòng nhập đầy đủ thông tin",
  [ErrorCodes.USER_NOT_FOUND]: "Tài khoản không tồn tại",
  [ErrorCodes.INVALID_PASSWORD]: "Mật khẩu không đúng",
  [ErrorCodes.NETWORK_ERROR]: "Lỗi kết nối mạng, vui lòng thử lại",
  [ErrorCodes.SERVER_ERROR]: "Hệ thống đang gặp sự cố, vui lòng thử lại sau",
  [ErrorCodes.INVALID_EMAIL]: "Email không hợp lệ",
  [ErrorCodes.ACCOUNT_DISABLED]: "Tài khoản đã bị khóa",
  [ErrorCodes.TOO_MANY_ATTEMPTS]:
    "Bạn đã thử đăng nhập quá nhiều lần, vui lòng thử lại sau",
  [ErrorCodes.PASSWORD_NOT_MATCH]: "Mật khẩu xác nhận không khớp",
  [ErrorCodes.USERNAME_EXISTS]: "Tên đăng nhập đã tồn tại",
  [ErrorCodes.EMAIL_EXISTS]: "Email đã được sử dụng",
  [ErrorCodes.INVALID_USERNAME]:
    "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới",
  [ErrorCodes.PASSWORD_TOO_SHORT]: "Mật khẩu phải có ít nhất 6 ký tự",
  [ErrorCodes.REGISTRATION_FAILED]: "Đăng ký thất bại, vui lòng thử lại sau",
  [ErrorCodes.PASSWORD_MISMATCH]: "Mật khẩu xác nhận không khớp",
};
