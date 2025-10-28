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
  const [hasError, setHasError] = useState(false);

  // sync value từ props
  useEffect(() => {
    if (value) {
      const momentDate = moment(value); // giữ nguyên ms
      setDate(momentDate.isValid() ? momentDate : null);
      setHasError(!momentDate.isValid());
    } else {
      setDate(null);
      setHasError(false);
    }
  }, [value]);

  const handleChange = useCallback(
    (newValue: Moment | null) => {
      setDate(newValue);
      if (newValue) {
        const isValid = newValue.isValid();
        setHasError(!isValid);

        if (onChange && isValid) {
          onChange(newValue.valueOf());
        }
      } else {
        setHasError(false);
        if (onChange) {
        }
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
          slotProps={{
            textField: (params) => (
              <TextField
                {...params}
                key={Number(params)}
                fullWidth
                error={hasError}
                helperText={hasError ? "Invalid date" : ""}
              />
            ),
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default memo(DateTimePickerComponent);
