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
  const [date, setDate] = useState<Moment>(moment(0)); // default = 0
  const [isInitialized, setIsInitialized] = useState(false);

  // Cập nhật locale
  useEffect(() => {
    if (moment.locale() !== language) {
      moment.locale(language);
    }
  }, [language]);

  // Khởi tạo giá trị ban đầu
  useEffect(() => {
    if (isInitialized) return;

    let initialDate: Moment;

    if (value !== undefined && value > 0) {
      const momentDate = moment(value * 1000);
      initialDate = momentDate.isValid() ? momentDate : moment(0);
    } else {
      initialDate = moment(0);
    }

    setDate(initialDate);
    setIsInitialized(true);

    // Gọi onChange ngay lần đầu để đảm bảo set 0 khi chưa có
    if (onChange) {
      onChange(
        initialDate.isValid()
          ? Number((initialDate.valueOf() / 1000).toFixed(3))
          : 0
      );
    }
  }, [value, isInitialized, onChange]);

  // Callback thay đổi giá trị
  const handleChange = useCallback(
    (newValue: unknown) => {
      const momentValue = newValue as Moment | null;
      const validDate =
        momentValue && momentValue.isValid() ? momentValue : moment(0);

      setDate(validDate);

      if (onChange) {
        const timestampMs = validDate.valueOf();
        const decimalValue = Number((timestampMs / 1000).toFixed(3));
        onChange(decimalValue);
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
