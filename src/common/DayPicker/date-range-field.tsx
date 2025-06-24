import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { InputAdornment, Box } from "@mui/material";
import CalendarIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import moment, { type Moment } from "moment";
import { koKR, enUS } from "@mui/x-date-pickers/locales";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import clsx from "clsx";
import "./_datefield.scss";
import "../../../scss/form/_text-field.scss";

interface Props {
  language: "en" | "ko";
  status?: "default" | "error" | "warning" | "confirmed";
  size?: "small" | "medium" | "large";
  className?: string;
  inputClassName?: string;
  placeHolder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  value?: [string, string];
  disabledOpenPicker?: boolean;
}

const SingleDateRangePickerComponent: React.FC<Props> = ({
  language,
  status = "default",
  size = "medium",
  className = "",
  inputClassName = "",
  placeHolder = "YYYY.MM.DD - YYYY.MM.DD",
  disabled = false,
  readOnly = false,
  disabledOpenPicker = true,
}) => {
  const [value, setValue] = useState<[Moment | null, Moment | null]>([
    null,
    null,
  ]);
  const today = moment().format("YYYY.MM.DD");

  const [dateRange, setDateRange] = useState<[Moment | null, Moment | null]>(
    value && value[0] && value[1]
      ? [moment(value[0], "YYYY.MM.DD"), moment(value[1], "YYYY.MM.DD")]
      : [moment(today, "YYYY.MM.DD"), moment("2023.08.28", "YYYY.MM.DD")]
  );
  useEffect(() => {
    moment.locale(language);
  }, [language]);

  const getStatusIcon = () => {
    switch (status) {
      case "error":
        return (
          <i
            className="icon icon-ban"
            data-testid="cus-error-icon"
            aria-hidden="true"
          ></i>
        );
      case "warning":
        return (
          <ErrorIcon
            className="icon datefield-icon--warningIcon"
            data-testid="cus-warning-icon"
          />
        );
      case "confirmed":
        return (
          <CheckCircleIcon
            className="icon datefield-icon--confirmedIcon"
            data-testid="cus-confirmed-icon"
          />
        );
      default:
        return null;
    }
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterMoment}
      localeText={
        language === "ko"
          ? koKR.components.MuiLocalizationProvider.defaultProps.localeText
          : enUS.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <Box
        className={clsx(
          `date-range-field-container date-range-field--${status} date-range-picker--${size} ${className}`
        )}
      >
        <DateRangePicker
          data-testid="cus-date-range-picker"
          value={dateRange}
          onChange={(newValue) =>
            setDateRange(newValue as [Moment | null, Moment | null])
          }
          disabled={disabled}
          readOnly={readOnly}
          disableOpenPicker={disabledOpenPicker}
          slots={{
            field: SingleInputDateRangeField,
          }}
          slotProps={{
            textField: {
              className: clsx(
                "datefield-input",
                inputClassName,
                status === "error" ? "border-error" : "",
                status === "warning" ? "border-warning" : "",
                status === "confirmed" ? "border-confirmed" : ""
              ),
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon data-testid="calendar-icon" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {getStatusIcon()}
                  </InputAdornment>
                ),
              },
              inputProps: {
                placeholder: placeHolder,
                readOnly,
              },
            },
          }}
          calendars={1}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default SingleDateRangePickerComponent;
