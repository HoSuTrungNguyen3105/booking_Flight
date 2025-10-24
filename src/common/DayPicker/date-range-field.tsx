import React, { useState, useEffect, useMemo } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Box, InputAdornment, type SxProps } from "@mui/material";
import CalendarIcon from "@mui/icons-material/Event";
import moment, { type Moment } from "moment";
import { koKR, enUS, jaJP, viVN } from "@mui/x-date-pickers/locales";
import type { DatePickerSize } from "./type";

interface Props {
  language: "vn" | "en" | "ko" | "jp";
  status?: "default" | "error" | "warning" | "confirmed";
  sx?: SxProps;
  placeHolder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
  disabledOpenPicker?: boolean;
  size?: DatePickerSize;
}

const parseDecimalToMoment = (decimalValue?: number): Moment | null => {
  if (!decimalValue || decimalValue <= 0) return null;
  const m = moment(decimalValue * 1000);
  return m.isValid() ? m : null;
};

const convertMomentToDecimal = (m?: Moment | null): number =>
  m && m.isValid() ? Number((m.valueOf() / 1000).toFixed(3)) : 0;

const SingleDateRangePickerComponent: React.FC<Props> = ({
  language,
  status = "default",
  sx,
  placeHolder = "YYYY.MM.DD",
  disabled = false,
  readOnly = false,
  value,
  onChange,
  size = "small",
  disabledOpenPicker = false,
}) => {
  const [dateRange, setDateRange] = useState<[Moment | null, Moment | null]>([
    parseDecimalToMoment(value?.[0]),
    parseDecimalToMoment(value?.[1]),
  ]);

  // Đặt ngôn ngữ cho moment
  useEffect(() => {
    moment.locale(language === "vn" ? "vi" : language);
  }, [language]);

  // Đồng bộ state khi prop `value` thay đổi
  useEffect(() => {
    if (value?.length === 2) {
      setDateRange([
        parseDecimalToMoment(value[0]),
        parseDecimalToMoment(value[1]),
      ]);
    }
  }, [value]);

  const handleDateChange = (index: 0 | 1, newValue: Moment | null) => {
    const newRange = [...dateRange] as [Moment | null, Moment | null];
    newRange[index] = newValue;
    setDateRange(newRange);

    onChange?.([
      convertMomentToDecimal(newRange[0]),
      convertMomentToDecimal(newRange[1]),
    ]);
  };

  // Config locale text của DatePicker
  const localeText = useMemo(() => {
    switch (language) {
      case "ko":
        return koKR.components.MuiLocalizationProvider.defaultProps.localeText;
      case "jp":
        return jaJP.components.MuiLocalizationProvider.defaultProps.localeText;
      case "vn":
        return viVN.components.MuiLocalizationProvider.defaultProps.localeText;
      default:
        return enUS.components.MuiLocalizationProvider.defaultProps.localeText;
    }
  }, [language]);

  // Render component DatePicker
  const renderDatePicker = (index: 0 | 1) => (
    <DatePicker
      value={dateRange[index]}
      onChange={(val) => handleDateChange(index, val as Moment)}
      disabled={disabled}
      readOnly={readOnly}
      disableOpenPicker={disabledOpenPicker}
      slotProps={{
        textField: {
          InputProps: {
            startAdornment: (
              <InputAdornment position="start">
                <CalendarIcon />
              </InputAdornment>
            ),
          },
          size: (size === "large" ? "medium" : size) as "small" | "medium",
          placeholder: placeHolder,
          fullWidth: true,
          error: status === "error",
          //helperText: status === "error" ? "Invalid date" : "",
        },
      }}
    />
  );

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} localeText={localeText}>
      <Box sx={{ display: "flex", gap: 1, ...sx }}>
        {renderDatePicker(0)}
        {renderDatePicker(1)}
      </Box>
    </LocalizationProvider>
  );
};

export default SingleDateRangePickerComponent;
