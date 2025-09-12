import React, { useState, useEffect } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Box, TextField, InputAdornment, type SxProps } from "@mui/material";
import CalendarIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import moment, { type Moment } from "moment";
import { koKR, enUS } from "@mui/x-date-pickers/locales";
import clsx from "clsx";

interface Props {
  language: "vn" | "en" | "ko" | "jp";
  status?: "default" | "error" | "warning" | "confirmed";
  sx?: SxProps;
  inputClassName?: string;
  placeHolder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
  disabledOpenPicker?: boolean;
}

const SingleDateRangePickerComponent: React.FC<Props> = ({
  language,
  status = "default",
  sx,
  inputClassName = "",
  placeHolder = "YYYY.MM.DD",
  disabled = false,
  readOnly = false,
  value,
  onChange,
  disabledOpenPicker = false,
}) => {
  const parseDecimalToMoment = (
    decimalValue: number | undefined
  ): Moment | null => {
    if (
      decimalValue === undefined ||
      decimalValue === null ||
      decimalValue <= 0
    ) {
      return null;
    }

    try {
      const momentDate = moment(decimalValue * 1000);
      return momentDate.isValid() ? momentDate : null;
    } catch (error) {
      console.error("Error parsing decimal value to date:", error);
      return null;
    }
  };

  const convertMomentToDecimal = (momentDate: Moment | null): number => {
    if (!momentDate || !momentDate.isValid()) {
      return 0;
    }

    try {
      const timestampMs = momentDate.valueOf();
      return parseFloat((timestampMs / 1000).toFixed(3));
    } catch (error) {
      console.error("Error converting moment to decimal:", error);
      return 0;
    }
  };

  const [dateRange, setDateRange] = useState<[Moment | null, Moment | null]>(
    () => {
      if (value && Array.isArray(value) && value.length === 2) {
        return [parseDecimalToMoment(value[0]), parseDecimalToMoment(value[1])];
      }
      return [null, null];
    }
  );

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    moment.locale(language);
  }, [language]);

  useEffect(() => {
    if (value && Array.isArray(value) && value.length === 2) {
      const newStart = parseDecimalToMoment(value[0]);
      const newEnd = parseDecimalToMoment(value[1]);

      setDateRange([newStart, newEnd]);
      setIsInitialized(true);
    } else if (!isInitialized) {
      setDateRange([null, null]);
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  const handleDateChange = (index: 0 | 1, newValue: Moment | null) => {
    const newDateRange: [Moment | null, Moment | null] = [...dateRange];
    newDateRange[index] = newValue;

    setDateRange(newDateRange);

    if (onChange) {
      const decimalValue: [number, number] = [
        convertMomentToDecimal(newDateRange[0]),
        convertMomentToDecimal(newDateRange[1]),
      ];
      onChange(decimalValue);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "error":
        return <ErrorIcon color="error" />;
      case "warning":
        return <ErrorIcon color="warning" />;
      case "confirmed":
        return <CheckCircleIcon color="success" />;
      default:
        return null;
    }
  };

  const getLocaleConfig = () => {
    switch (language) {
      case "ko":
        return koKR.components.MuiLocalizationProvider.defaultProps.localeText;
      default:
        return enUS.components.MuiLocalizationProvider.defaultProps.localeText;
    }
  };

  if (!isInitialized) {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField label="Loading..." disabled fullWidth />
        <TextField label="Loading..." disabled fullWidth />
      </Box>
    );
  }

  return (
    <LocalizationProvider
      dateAdapter={AdapterMoment}
      localeText={getLocaleConfig()}
    >
      <Box sx={{ display: "flex", gap: 1, ...sx }}>
        {/* Start Date Picker */}
        <DatePicker
          value={dateRange[0]}
          onChange={(newValue) => handleDateChange(0, newValue as Moment)}
          disabled={disabled}
          readOnly={readOnly}
          enableAccessibleFieldDOMStructure={false}
          slotProps={{
            textField: {
              className: clsx(
                "datefield-input",
                inputClassName,
                status === "error" && "border-error",
                status === "warning" && "border-warning",
                status === "confirmed" && "border-confirmed"
              ),
              InputProps: {
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
              },
              placeholder: placeHolder,
              fullWidth: true,
              error: status === "error",
              helperText: status === "error" ? "Invalid date" : "",
            },
          }}
        />

        <DatePicker
          value={dateRange[1]}
          onChange={(newValue) => handleDateChange(1, newValue as Moment)}
          disabled={disabled}
          readOnly={readOnly}
          enableAccessibleFieldDOMStructure={false}
          disableOpenPicker={disabledOpenPicker}
          slotProps={{
            textField: {
              className: clsx(
                "datefield-input",
                inputClassName,
                status === "error" && "border-error",
                status === "warning" && "border-warning",
                status === "confirmed" && "border-confirmed"
              ),
              InputProps: {
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
              },
              placeholder: placeHolder,
              fullWidth: true,
              error: status === "error",
              helperText: status === "error" ? "Invalid date" : "",
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default SingleDateRangePickerComponent;
