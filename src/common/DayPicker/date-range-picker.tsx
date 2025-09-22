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
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoize locale setup
  useEffect(() => {
    if (moment.locale() !== language) {
      moment.locale(language);
    }
  }, [language]);

  // Optimized initialization logic
  useEffect(() => {
    if (isInitialized) return;

    let initialDate: Moment | null = null;

    if (value !== undefined && value !== null && value > 0) {
      try {
        const momentDate = moment(value * 1000);
        initialDate = momentDate.isValid() ? momentDate : moment();
      } catch (error) {
        console.error("Error parsing date:", error);
        initialDate = moment();
      }
    } else {
      initialDate = moment();
    }

    setDate(initialDate);
    setIsInitialized(true);
  }, [value, isInitialized]); // Removed unnecessary dependencies

  // Memoized callback for onChange
  const handleChange = useCallback(
    (newValue: unknown) => {
      const momentValue = newValue as Moment | null;
      setDate(momentValue);

      if (!onChange) return;

      try {
        if (momentValue && momentValue.isValid()) {
          const timestampMs = momentValue.valueOf();
          const decimalValue = Number((timestampMs / 1000).toFixed(3));
          onChange(decimalValue);
        } else {
          onChange(0);
        }
      } catch (error) {
        console.error("Error in handleChange:", error);
        onChange(0);
      }
    },
    [onChange]
  );

  // Memoize locale text to prevent unnecessary re-renders
  const localeText = useMemo(() => {
    return language === "kr"
      ? koKR.components.MuiLocalizationProvider.defaultProps.localeText
      : enUS.components.MuiLocalizationProvider.defaultProps.localeText;
  }, [language]);

  if (!isInitialized) {
    return <TextField label="Loading date..." disabled fullWidth />;
  }

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
