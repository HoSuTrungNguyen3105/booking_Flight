import type { Language } from "../../utils/type";

export type TimePickerStatus = "ReadOnly" | "Disable" | "Default";
export type TimePickerType = "Error" | "Warning" | "Confirmed";
export type TimePickerSize = "small" | "medium" | "large";

export type TimePickerProps = {
  status?: TimePickerStatus;
  type?: TimePickerType;
  size?: TimePickerSize;
  language?: Language;
};
