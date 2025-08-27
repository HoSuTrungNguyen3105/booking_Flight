export const ResponseCode = {
  SUCCESS: "00",
  INVALID_PASSWORD_FORMAT: "03",
  // INVALID_CORRECT_PASSWORD: '05',
  // PASSWORD_CONFIRMATION_MISMATCH: '06',
  INVALID_USER: "05",
  LOGIN_FAILED_ACCOUNT_LOCKED: "31",
  UNKNOWN: "99",
};

export const Message = {
  [ResponseCode.SUCCESS]: "성공",
  [ResponseCode.INVALID_PASSWORD_FORMAT]: "비밀번호 형식이 유효하지 않습니다.",
  [ResponseCode.INVALID_USER]: "유효하지 않은 사용자입니다.",
  [ResponseCode.LOGIN_FAILED_ACCOUNT_LOCKED]: "계정이 잠겨 있습니다.",
  [ResponseCode.UNKNOWN]: "알 수 없는 오류가 발생했습니다.",
};

export type ResponseCode = (typeof ResponseCode)[keyof typeof ResponseCode];

export const formatMessage = (
  responseMessage: string,
  ...values: (string | number)[]
): string => {
  // Replace placeholders {0}, {1}, {2}... with values
  values.forEach((value, index) => {
    const placeholder = `{${index}}`;
    responseMessage = responseMessage.replace(
      new RegExp(placeholder, "g"),
      String(value)
    );
  });
  return responseMessage;
};

export const getMessage = (code: ResponseCode): string => {
  return Message[code] || Message[ResponseCode.UNKNOWN];
};
