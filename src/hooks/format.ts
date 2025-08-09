import moment, { type MomentInput } from "moment";

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
  return moment(targetDate).isValid();
};

export const formatDate = (
  format: DateFormatEnum,
  targetDate?: MomentInput
) => {
  if (!isValidDate(targetDate)) return "";
  return moment(targetDate).format(format);
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
