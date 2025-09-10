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
  language: "vn" | "en" | "kr" | "jp";
  status?: "default" | "error" | "warning" | "confirmed";
  size?: "small" | "medium" | "large";
  sx?: SxProps;
  inputClassName?: string;
  placeHolder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  value?: [number, number]; // Giá trị decimal (20,3) đại diện cho timestamp [start, end]
  onChange?: (value: [number, number]) => void; // Callback trả về decimal timestamp (20,3)
  disabledOpenPicker?: boolean;
}

const SingleDateRangePickerComponent: React.FC<Props> = ({
  language,
  status = "default",
  size = "medium",
  sx,
  inputClassName = "",
  placeHolder = "YYYY.MM.DD",
  disabled = false,
  readOnly = false,
  value,
  onChange,
  disabledOpenPicker = false, // Đổi thành false mặc định để cho phép mở picker
}) => {
  // Chuyển đổi giá trị decimal (20,3) sang Moment
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
      // Chuyển đổi decimal (giây) thành milliseconds cho moment
      const momentDate = moment(decimalValue * 1000);
      return momentDate.isValid() ? momentDate : null;
    } catch (error) {
      console.error("Error parsing decimal value to date:", error);
      return null;
    }
  };

  // Chuyển đổi Moment sang giá trị decimal (20,3)
  const convertMomentToDecimal = (momentDate: Moment | null): number => {
    if (!momentDate || !momentDate.isValid()) {
      return 0;
    }

    try {
      // Lấy timestamp (ms) → chuyển đổi thành giây với 3 chữ số thập phân
      const timestampMs = momentDate.valueOf();
      return parseFloat((timestampMs / 1000).toFixed(3));
    } catch (error) {
      console.error("Error converting moment to decimal:", error);
      return 0;
    }
  };

  // Khởi tạo state với giá trị từ props
  const [dateRange, setDateRange] = useState<[Moment | null, Moment | null]>(
    () => {
      if (value && Array.isArray(value) && value.length === 2) {
        return [parseDecimalToMoment(value[0]), parseDecimalToMoment(value[1])];
      }
      return [null, null]; // Default to null thay vì moment()
    }
  );

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    moment.locale(language);
  }, [language]);

  // Cập nhật state khi value prop thay đổi từ bên ngoài
  useEffect(() => {
    if (value && Array.isArray(value) && value.length === 2) {
      const newStart = parseDecimalToMoment(value[0]);
      const newEnd = parseDecimalToMoment(value[1]);

      setDateRange([newStart, newEnd]);
      setIsInitialized(true);
    } else if (!isInitialized) {
      // Chỉ set default một lần nếu không có giá trị từ props
      setDateRange([null, null]);
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  const handleDateChange = (index: 0 | 1, newValue: Moment | null) => {
    const newDateRange: [Moment | null, Moment | null] = [...dateRange];
    newDateRange[index] = newValue;

    setDateRange(newDateRange);

    // Gọi callback với giá trị decimal (20,3)
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
      case "kr":
        return koKR.components.MuiLocalizationProvider.defaultProps.localeText;
      case "vn":
      case "jp":
      default:
        return enUS.components.MuiLocalizationProvider.defaultProps.localeText;
    }
  };

  // Hiển thị loading nếu chưa khởi tạo xong
  if (!isInitialized) {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          label="Loading..."
          disabled
          fullWidth
          // size={size}
        />
        <TextField
          label="Loading..."
          disabled
          fullWidth
          // size={size}
        />
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
          onChange={(newValue) => handleDateChange(0, newValue)}
          disabled={disabled}
          readOnly={readOnly}
          enableAccessibleFieldDOMStructure={false} // Dòng này gây vấn đề
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

        {/* End Date Picker */}
        <DatePicker
          value={dateRange[1]}
          onChange={(newValue) => handleDateChange(1, newValue)}
          disabled={disabled}
          readOnly={readOnly}
          enableAccessibleFieldDOMStructure={false} // Dòng này gây vấn đề
          disableOpenPicker={disabledOpenPicker}
          slotProps={{
            textField: {
              // size,
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
