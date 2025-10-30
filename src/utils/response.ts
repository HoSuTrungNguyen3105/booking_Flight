export const ResponseCode = {
  SUCCESS: "00",
  UNKNOWN: "99",
};

export const Message = {
  [ResponseCode.SUCCESS]: "Success",
  [ResponseCode.UNKNOWN]: "Unknown error occurred.",
};

export type ResponseCode = (typeof ResponseCode)[keyof typeof ResponseCode];

export const formatMessage = (
  responseMessage: string,
  ...values: (string | number)[]
): string => {
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
