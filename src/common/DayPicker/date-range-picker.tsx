import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { InputAdornment, Box } from "@mui/material";
import CalendarIcon from "@mui/icons-material/Event";
import moment, { type Moment } from "moment";
import "moment";
import { koKR, enUS } from "@mui/x-date-pickers/locales";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

interface Props {
  language: "en" | "ko";
}
const DateRangePickerComponent: React.FC<Props> = ({ language }) => {
  const [value, setValue] = useState<[Moment | null, Moment | null]>([
    null,
    null,
  ]);

  useEffect(() => {
    moment.locale(language);
  }, [language]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterMoment}
      localeText={
        language === "ko"
          ? koKR.components.MuiLocalizationProvider.defaultProps.localeText
          : enUS.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <Box className="date-range-picker-container">
        <DateRangePicker
          value={value}
          onChange={(newValue) =>
            setValue(newValue as [Moment | null, Moment | null])
          }
          format="YYYY.MM.DD"
          slots={{
            field: SingleInputDateRangeField,
          }}
          slotProps={{
            textField: {
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon data-testid="calendar-icon" />
                  </InputAdornment>
                ),
              },
            },
          }}
          calendars={2}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangePickerComponent;
