export type TimePickerStatus = "ReadOnly" | "Disable" | "Default";
export type TimePickerType = "Error" | "Warning" | "Confirmed";
export type TimePickerSize = "small" | "medium" | "large";
export type Language = "en" | "kr" | "jp";
export type TimePickerProps = {
  status?: TimePickerStatus;
  type?: TimePickerType;
  size?: TimePickerSize;
  language?: Language;
};
