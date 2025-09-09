import React, { useState, useEffect } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Box, TextField, InputAdornment } from "@mui/material";
import CalendarIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import moment, { type Moment } from "moment";
import { koKR, enUS } from "@mui/x-date-pickers/locales";
import clsx from "clsx";

interface Props {
  language: "vn" | "en" | "kr" | "jp";
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
  const today = moment().format("YYYY.MM.DD");
  const [dateRange, setDateRange] = useState<[Moment | null, Moment | null]>([
    moment(today, "YYYY.MM.DD"),
    moment(today, "YYYY.MM.DD"),
  ]);

  useEffect(() => {
    moment.locale(language);
  }, [language]);

  const getStatusIcon = () => {
    switch (status) {
      case "error":
        return <ErrorIcon className="icon datefield-icon--error" />;
      case "warning":
        return <ErrorIcon className="icon datefield-icon--warning" />;
      case "confirmed":
        return <CheckCircleIcon className="icon datefield-icon--confirmed" />;
      default:
        return null;
    }
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterMoment}
      localeText={
        language === "kr"
          ? koKR.components.MuiLocalizationProvider.defaultProps.localeText
          : enUS.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <Box
        className={clsx(
          `date-range-field-container date-range-field--${status} date-range-picker--${size} ${className}`
        )}
      >
        <DatePicker
          value={dateRange[0]}
          onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
          disabled={disabled}
          readOnly={readOnly}
          enableAccessibleFieldDOMStructure={false} // ← quan trọng
          slots={{
            textField: (props) => (
              <TextField
                {...props}
                className={clsx(
                  "datefield-input",
                  inputClassName,
                  status === "error" ? "border-error" : "",
                  status === "warning" ? "border-warning" : "",
                  status === "confirmed" ? "border-confirmed" : ""
                )}
                InputProps={{
                  ...props.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {getStatusIcon()}
                    </InputAdornment>
                  ),
                }}
                placeholder={placeHolder}
              />
            ),
          }}
        />

        {/* End Date Picker */}
        <DatePicker
          value={dateRange[1]}
          onChange={(newValue) => setDateRange([dateRange[0], newValue])}
          disabled={disabled}
          readOnly={readOnly}
          disableOpenPicker={disabledOpenPicker}
          slots={{
            textField: (props) => (
              <TextField
                {...props}
                className={clsx(
                  "datefield-input",
                  inputClassName,
                  status === "error" ? "border-error" : "",
                  status === "warning" ? "border-warning" : "",
                  status === "confirmed" ? "border-confirmed" : ""
                )}
                InputProps={{
                  ...props.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {getStatusIcon()}
                    </InputAdornment>
                  ),
                }}
                placeholder={placeHolder}
              />
            ),
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default SingleDateRangePickerComponent;
