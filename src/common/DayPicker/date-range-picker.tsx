import React, { useState, useEffect } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { koKR, enUS } from "@mui/x-date-pickers/locales";
import { Box, TextField, InputAdornment } from "@mui/material";
import CalendarIcon from "@mui/icons-material/Event";
import moment, { type Moment } from "moment";

interface Props {
  language: "vn" | "en" | "kr" | "jp";
  onChange?: (value: number) => void; // callback để trả về decimal timestamp
  value?: number; //timestamp data
}

const DateTimePickerComponent: React.FC<Props> = ({
  language,
  onChange,
  value,
}) => {
  const [date, setDate] = useState<Moment | null>(
    value ? moment.unix(value) : moment()
  );

  useEffect(() => {
    moment.locale(language);
  }, [language]);

  useEffect(() => {
    if (value) {
      setDate(moment.unix(value));
    }
  }, [value]);

  const handleChange = (newValue: Moment | null) => {
    setDate(newValue);

    if (newValue && onChange) {
      // Lấy timestamp (ms) → giây → decimal(20,3)
      const timestampMs = newValue.valueOf();
      const decimalValue = parseFloat((timestampMs / 1000).toFixed(3));
      onChange(decimalValue);
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
      <Box display="flex" gap={2}>
        <DatePicker
          value={date}
          onChange={handleChange}
          enableAccessibleFieldDOMStructure={false} // ← quan trọng
          slots={{
            textField: (props) => (
              <TextField
                {...props}
                InputProps={{
                  ...props.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon />
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

export default DateTimePickerComponent;
