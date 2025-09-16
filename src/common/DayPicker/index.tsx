import { useMemo } from "react";
import moment from "moment";
import {
  LocalizationProvider,
  DatePicker as MuiDatePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import clsx from "clsx";
import { Box, TextField } from "@mui/material";
import Calendar from "@mui/icons-material/Event";
import type { DatePickerProps, ValueDate } from "./type";

export const onChangeDatePicker = (
  value: moment.Moment | null,
  onChange?: (date: string | null) => void
) => {
  onChange?.(value?.toISOString() ?? null);
};

export const onChangeTimePicker = (
  value: moment.Moment | null,
  onChange?: (time: string | null) => void,
  usecase?: string
) => {
  if (!value || usecase !== "time") {
    return onChange?.(null);
  }
  return onChange?.(value.format("HH:mm"));
};

export const getTimeValue = (value?: string | null, usecase?: string) => {
  if (!value || typeof value !== "string" || usecase !== "time") return null;
  const [hour, minute] = value.split(":");
  return moment().set({ hour: Number(hour), minute: Number(minute) });
};

export const getDateValue = (value: ValueDate): moment.Moment | null => {
  if (!value) return null;

  if (value instanceof Date) {
    return moment(value);
  }

  if (typeof value === "string") {
    const momentValue = moment(value, true);
    return momentValue.isValid() ? momentValue : null;
  }
  return null;
};

export const InputDate = ({
  usecase,
  value,
  disabled,
  inputClassName,
  readOnly,
  format,
  minDate,
  maxDate,
  status,
  onChange,
}: Omit<DatePickerProps, "className">) => {
  const timeValue = useMemo(
    () => getTimeValue(value as string, usecase as string),
    [value]
  );
  const dateValue = useMemo(() => getDateValue(value), [value]);
  switch (usecase) {
    case "date":
      return (
        <MuiDatePicker
          value={dateValue}
          onChange={(value) => onChangeDatePicker(value, onChange)}
          format={format}
          disabled={disabled}
          readOnly={readOnly}
          enableAccessibleFieldDOMStructure={false} // ← quan trọng
          className={clsx(inputClassName, status)}
          minDate={minDate ? moment(minDate) : undefined}
          maxDate={maxDate ? moment(maxDate) : undefined}
          views={["year", "month", "day"]}
          slotProps={{
            inputAdornment: {
              position: "start",
              children: <Calendar />,
            },
            field: { clearable: true },
            toolbar: { hidden: true },
          }}
        />
      );
    case "month":
      return (
        <MuiDatePicker
          value={dateValue}
          onChange={(value) => onChangeDatePicker(value, onChange)}
          format={format}
          disabled={disabled}
          readOnly={readOnly}
          enableAccessibleFieldDOMStructure={false} // ← quan trọng
          className={clsx(inputClassName, status)}
          slotProps={{
            inputAdornment: {
              position: "start",
            },
            field: { clearable: true },
            toolbar: { hidden: true },
          }}
          views={["month", "year"]}
        />
      );
    case "year":
      return (
        <MuiDatePicker
          value={dateValue}
          onChange={(value) => onChangeDatePicker(value, onChange)}
          format={format}
          disabled={disabled}
          enableAccessibleFieldDOMStructure={false} // ← quan trọng
          readOnly={readOnly}
          className={clsx(inputClassName, status)}
          slotProps={{
            inputAdornment: {
              position: "start",
            },
            field: { clearable: true },
            toolbar: { hidden: true },
          }}
          views={["year"]}
        />
      );
    case "datetime":
      return (
        <MuiDatePicker
          value={timeValue}
          onChange={(value) => onChangeTimePicker(value, onChange)}
          format="HH:mm"
          enableAccessibleFieldDOMStructure={false} // ← quan trọng
          disabled={disabled}
          readOnly={readOnly}
          className={clsx(inputClassName, status)}
          slotProps={{
            inputAdornment: {
              position: "start",
            },
            field: { clearable: true },
            toolbar: { hidden: true },
          }}
        />
      );
    default:
      return (
        <MuiDatePicker
          value={dateValue}
          onChange={(value) => onChangeDatePicker(value, onChange)}
          format={format}
          disabled={disabled}
          readOnly={readOnly}
          enableAccessibleFieldDOMStructure={false} // ← quan trọng
          className={clsx(inputClassName, status)}
          minDate={minDate ? moment(minDate) : undefined}
          maxDate={maxDate ? moment(maxDate) : undefined}
          slotProps={{
            textField: (params) => <TextField {...params} variant="outlined" />,
            inputAdornment: {
              position: "start",
            },
            field: { clearable: true },
            toolbar: { hidden: true },
          }}
        />
      );
  }
};

export const DatePickerFunc = (props: DatePickerProps) => {
  const { className = "", size = "" } = props;
  return (
    <Box
      className={`${className} ${size} datepicker-container`}
      data-testid="default-datepicker"
    >
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <InputDate {...props} data-testid="default-datepicker" />
      </LocalizationProvider>
    </Box>
  );
};

export default DatePickerFunc;
