import { KB_TO_BYTES, SIZE_TYPE } from "../common/FileUploader/type";

export const convertToString = (value: any): string => {
  if (value === undefined || value === null) {
    return "";
  }
  return String(value);
};
export const quickValue = <T, K>(
  status: boolean,
  trueValue: T,
  falseValue: K
) => {
  return status ? trueValue : falseValue;
};

export const extractSizeInfo = (size: string) => {
  const match = size.split(" ");
  if (match) {
    return {
      amount: match[0],
      unit: match[1].toUpperCase(),
    };
  }
  return undefined;
};

export const sizeToBytes = (size: string) => {
  const sizeData = extractSizeInfo(size);
  if (sizeData) {
    if (!SIZE_TYPE.includes(sizeData.unit)) return 0;
    const indexSize = SIZE_TYPE.indexOf(sizeData.unit);
    return parseFloat(sizeData.amount) * KB_TO_BYTES ** indexSize;
  }
  return 0;
};

export const bytesToSize = (bytes: number, decimals = 2) => {
  if (!Number(bytes)) return "0 B";
  const dm = decimals < 0 ? 0 : decimals;
  const index = Math.floor(Math.log(bytes) / Math.log(KB_TO_BYTES));
  return convertToString(
    parseFloat((bytes / KB_TO_BYTES ** index).toFixed(dm)) + SIZE_TYPE[index]
  );
};

export const getFileInformation = (fileName: string) => {
  const lastDotIndex = fileName.lastIndexOf(".");
  const name = fileName.substring(0, lastDotIndex);
  const type = fileName.substring(lastDotIndex + 1).toLowerCase();
  return { name, type };
};

export const concatStrings = (...params: (string | number)[]) => {
  let result = "";
  params.forEach((param) => (result += param.toString()));
  return result;
};
