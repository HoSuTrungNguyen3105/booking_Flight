import React, { useState, useEffect } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { koKR, enUS } from "@mui/x-date-pickers/locales";
import { Box, TextField } from "@mui/material";
import moment, { type Moment } from "moment";

interface Props {
  language: "vn" | "en" | "kr" | "jp";
  onChange?: (value: number) => void; // callback để trả về decimal timestamp (20,3)
  value?: number; // Giá trị decimal (20,3) đại diện cho timestamp
}

const DateTimePickerComponent: React.FC<Props> = ({
  language,
  onChange,
  value,
}) => {
  const [date, setDate] = useState<Moment | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    moment.locale(language);
  }, [language]);

  useEffect(() => {
    if (!isInitialized && value !== undefined && value !== null && value > 0) {
      try {
        const momentDate = moment(value * 1000);
        if (momentDate.isValid()) {
          setDate(momentDate);
          setIsInitialized(true);
        } else {
          console.warn("Invalid date value:", value);
          setDate(moment());
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Error parsing date:", error);
        setDate(moment());
        setIsInitialized(true);
      }
    }
  }, [value, isInitialized]);

  useEffect(() => {
    if (
      !isInitialized &&
      (value === 0 || value === null || value === undefined)
    ) {
      setDate(moment());
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  // Sửa lại hàm handleChange để phù hợp với type definition mới
  // const handleChange = (value: Moment | null, context: any) => {
  //   setDate(value);

  //   if (value && onChange) {
  //     try {
  //       const timestampMs = value.valueOf();
  //       const decimalValue = parseFloat((timestampMs / 1000).toFixed(3));

  //       if (!isNaN(decimalValue) && isFinite(decimalValue)) {
  //         onChange(decimalValue);
  //       } else {
  //         console.error("Invalid decimal value calculated:", decimalValue);
  //         onChange(0);
  //       }
  //     } catch (error) {
  //       console.error("Error in handleChange:", error);
  //       onChange(0);
  //     }
  //   } else if (onChange) {
  //     onChange(0);
  //   }
  // };

  const handleChange = (newValue: unknown) => {
    const momentValue = newValue as Moment | null;
    setDate(momentValue);

    if (momentValue && onChange) {
      try {
        const timestampMs = momentValue.valueOf();
        const decimalValue = parseFloat((timestampMs / 1000).toFixed(3));

        if (!isNaN(decimalValue) && isFinite(decimalValue)) {
          onChange(decimalValue);
        } else {
          onChange(0);
        }
      } catch (error) {
        onChange(0);
      }
    } else if (onChange) {
      onChange(0);
    }
  };

  if (!isInitialized) {
    return <TextField label="Loading date..." disabled fullWidth />;
  }

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
          enableAccessibleFieldDOMStructure={false}
          slots={{
            textField: (params) => (
              <TextField
                {...params}
                fullWidth
                error={!date || !date.isValid()}
                helperText={!date || !date.isValid() ? "Invalid date" : ""}
              />
            ),
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DateTimePickerComponent;
