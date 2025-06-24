import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateField } from "@mui/x-date-pickers/DateField";
import { InputAdornment, Box, TextField } from "@mui/material";
import moment, { type Moment } from "moment";
import "./_datefield.scss";
import clsx from "clsx";
import "../../../scss/form/_text-field.scss";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DateRangeIcon from "@mui/icons-material/DateRange";
import type { DatePickerProps } from "./type";
export const CusDateField: React.FC<DatePickerProps> = ({
  size = "medium",
  className = "",
  inputClassName = "",
  value,
  usecase = "default",
  onChange,
  placeHolder = "YYYY.MM.DD",
  format = "YYYY.MM.DD",
  disabled = false,
  status = "default",
  readOnly = false,
}) => {
  const momentValue: Moment | null =
    typeof value === "string"
      ? moment(value, format)
      : value instanceof Date
      ? moment(value)
      : null;

  const handleChange = (newValue: Moment | null) => {
    if (onChange) {
      const formattedValue = newValue ? newValue.format(format) : null;
      onChange(formattedValue);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "error":
        return <i className="icon icon-ban" aria-hidden="true"></i>;
      case "warning":
        return <ErrorIcon className="icon datefield-icon--warningIcon" />;
      case "confirmed":
        return (
          <CheckCircleIcon className="icon datefield-icon--confirmedIcon" />
        );
      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box
        className={clsx(
          `datefield datefield--${status} datefield--${size} ${className}`
        )}
        sx={{ p: 2 }}
      >
        <DateField
          value={momentValue}
          onChange={handleChange}
          format={format}
          disabled={disabled}
          slotProps={{
            inputProps: {
              className: clsx(
                "datefield-input",
                inputClassName,
                status === "error" ? "border-error" : "",
                status === "warning" ? "border-warning" : "",
                status === "confirmed" ? "border-confirmed" : ""
              ),
              inputProps: {
                placeholder: placeHolder,
                readOnly,
                "data-testid": "cus-datefield-input",
              },
            },
          }}
          slots={{
            textField: (params) => (
              <TextField
                {...params}
                variant="outlined"
                data-testid="cus-datefield-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      data-testid="cus-datefield-calendar-icon"
                    >
                      <DateRangeIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {getStatusIcon()}
                    </InputAdornment>
                  ),
                }}
              />
            ),
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default CusDateField;
