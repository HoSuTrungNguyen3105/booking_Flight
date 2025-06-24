import type { TextFieldProps } from "@mui/material";

export type DatePickerCase =
  | "date"
  | "month"
  | "year"
  | "datetime"
  | "time"
  | "default";
export type DatePickerSize = "small" | "medium" | "large";
export type DatePickerStatus = "error" | "warning" | "confirmed" | "default";
export type ValueDate = string | Date | null | undefined;

export type DatePickerProps = {
  placeHolder?: string;
  usecase: DatePickerCase;
  size?: DatePickerSize;
  value?: ValueDate;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  readOnly?: boolean;
  format?: string;
  minDate?: ValueDate;
  maxDate?: ValueDate;
  status?: DatePickerStatus;
  onChange?: (date: ValueDate) => void;
  slotProps?: {
    textField?: TextFieldProps;
  };
};
