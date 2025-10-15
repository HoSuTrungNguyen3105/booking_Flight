import { isNaN } from "lodash";
import moment, { type MomentInput } from "moment";

export type Currency = "VND" | "USD" | "JPY" | "KRW";

export enum DateFormatEnum {
  MMMM_D_YYYY_HH_MM_SS = "MMMM D, YYYY, HH:mm:ss",
  MM_DD_YYYY_HH_MM_SS = "MM-DD-YYYY HH:mm:ss",
  DD_MM_YYYY_HH_MM_SS = "DD-MM-YYYY hh:mm:ss",
  MM_DD_YYYY = "MM/DD/YYYY",
  HH_MM_A = "hh:mm a",
  YYYY_MM_DD_HH_MM_SS = "YYYY-MM-DD HH:mm:ss",
  MMMM_D_YYYY = "MMMM D, YYYY",
  DDD_MMM_D_YYYY = "ddd MMM DD YYYY",
  YYYY_MM_DD_A_H_MM = "YYYY.MM.DD A h:mm",
  ISO_8601 = "YYYY-MM-DDTHH:mm:ss.SSS[Z]",
}

const SECOND_TO_MILLISECOND = 1000;

const isValidDate = (targetDate?: MomentInput) => {
  if (!targetDate) return false;

  if (typeof targetDate === "number") {
    return moment(targetDate).isValid();
  }

  if (typeof targetDate === "string" && /^\d+$/.test(targetDate)) {
    return moment(Number(targetDate)).isValid();
  }

  return moment(targetDate).isValid();
};

export const formatDate = (
  format: DateFormatEnum,
  targetDate?: MomentInput
) => {
  if (!isValidDate(targetDate)) return "";

  let date: moment.Moment;

  if (typeof targetDate === "number") {
    date = moment(targetDate);
  } else if (typeof targetDate === "string" && /^\d+$/.test(targetDate)) {
    date = moment(Number(targetDate));
  } else {
    date = moment(targetDate);
  }

  return date.format(format);
};

export const formatDateKR = (
  format: DateFormatEnum,
  offsetDateTime?: number
) => {
  const targetDateInMilliseconds = offsetDateTimeToMillisecond(offsetDateTime);
  if (!isValidDate(targetDateInMilliseconds)) return "";
  return moment(targetDateInMilliseconds)
    .format(format)
    .replace("PM", "오후")
    .replace("AM", "오전");
};

export const getDateTimeFromNow = (
  targetDate: MomentInput,
  defaultValue: string = ""
) => {
  if (!isValidDate(targetDate)) return defaultValue;
  return moment(targetDate).fromNow();
};

export const offsetDateTimeToMillisecond = (offsetDateTime?: number) => {
  if (!offsetDateTime) return null;
  return offsetDateTime * SECOND_TO_MILLISECOND;
};

export const formatOffsetDateTime = (
  offsetDateTime?: number,
  format: DateFormatEnum = DateFormatEnum.YYYY_MM_DD_HH_MM_SS
) => {
  const targetDateInMilliseconds = offsetDateTimeToMillisecond(offsetDateTime);
  if (!targetDateInMilliseconds) return "";
  return formatDate(format, targetDateInMilliseconds);
};

export const getOffsetDateTimeFromNow = (
  offsetDateTime?: number,
  defaultValue: string = ""
) => {
  const targetDateInMilliseconds = offsetDateTimeToMillisecond(offsetDateTime);
  return getDateTimeFromNow(targetDateInMilliseconds, defaultValue);
};

export const getYesterday = (
  format: DateFormatEnum = DateFormatEnum.ISO_8601
) => {
  return moment().subtract(1, "day").startOf("day").format(format);
};

export const getToday = (format: DateFormatEnum = DateFormatEnum.ISO_8601) => {
  return moment().endOf("day").format(format);
};

export function convertCurrency(
  amountVND: number,
  targetCurrency: Currency,
  rates: Record<Currency, number> = {
    USD: 0.000043,
    JPY: 0.0061,
    KRW: 0.053,
    VND: 1,
  }
): string {
  if (isNaN(amountVND)) return "";

  const amount = amountVND * (rates[targetCurrency] || 1);

  let locale = "vi-VN";
  let minimumFractionDigits = 0;

  switch (targetCurrency) {
    case "USD":
      locale = "en-US";
      minimumFractionDigits = 2;
      break;
    case "JPY":
      locale = "ja-JP";
      minimumFractionDigits = 0;
      break;
    case "KRW":
      locale = "ko-KR";
      minimumFractionDigits = 0;
      break;
    case "VND":
      locale = "vi-VN";
      minimumFractionDigits = 0;
      break;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: targetCurrency,
    minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(amount);
}
