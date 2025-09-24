import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { koKR, enUS } from "@mui/x-date-pickers/locales";
import { Box, TextField } from "@mui/material";
import moment, { type Moment } from "moment";

interface Props {
  language: "vn" | "en" | "kr" | "jp";
  onChange?: (value: number) => void;
  value?: number;
}

const DateTimePickerComponent: React.FC<Props> = ({
  language,
  onChange,
  value,
}) => {
  const [date, setDate] = useState<Moment | null>(null);

  // sync value từ props
  useEffect(() => {
    if (value) {
      const momentDate = moment(value); // giữ nguyên ms
      setDate(momentDate.isValid() ? momentDate : null);
    } else {
      setDate(null);
    }
  }, [value]);

  const handleChange = useCallback(
    (newValue: Moment | null) => {
      setDate(newValue);
      if (onChange && newValue?.isValid()) {
        onChange(newValue.valueOf()); // trả ms
      }
    },
    [onChange]
  );

  // Locale text
  const localeText = useMemo(() => {
    return language === "kr"
      ? koKR.components.MuiLocalizationProvider.defaultProps.localeText
      : enUS.components.MuiLocalizationProvider.defaultProps.localeText;
  }, [language]);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} localeText={localeText}>
      <Box display="flex" gap={2}>
        <DatePicker
          value={date}
          onChange={handleChange}
          enableAccessibleFieldDOMStructure={false}
          slots={{
            textField: (params) => (
              <TextField
                {...params}
                fullWidth
                error={!date?.isValid()}
                helperText={!date?.isValid() ? "Invalid date" : ""}
              />
            ),
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default memo(DateTimePickerComponent);
