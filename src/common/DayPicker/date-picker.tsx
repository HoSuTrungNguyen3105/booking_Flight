import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Box, Typography } from "@mui/material";
import moment, { type Moment } from "moment";

type TimePickerProps = {
  value: string;
  onChange: (val: string) => void;
};

export const OpeningHoursPicker = ({ value, onChange }: TimePickerProps) => {
  const [startTime, setStartTime] = useState<Moment | null>(
    value ? moment(value.split(" - ")[0], "HH:mm") : null
  );
  const [endTime, setEndTime] = useState<Moment | null>(
    value ? moment(value.split(" - ")[1], "HH:mm") : null
  );

  const handleUpdate = (start: Moment | null, end: Moment | null) => {
    const formatted = `${start?.format("HH:mm") || "00:00"} - ${
      end?.format("HH:mm") || "00:00"
    }`;
    onChange(formatted);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box display="flex" alignItems="center" gap={1}>
        <TimePicker
          label="Mở"
          value={startTime}
          onChange={(newValue) => {
            setStartTime(newValue);
            handleUpdate(newValue, endTime);
          }}
          slotProps={{ textField: { size: "small" } }}
        />
        <Typography>-</Typography>
        <TimePicker
          label="Đóng"
          value={endTime}
          onChange={(newValue) => {
            setEndTime(newValue);
            handleUpdate(startTime, newValue);
          }}
          slotProps={{ textField: { size: "small" } }}
        />
        <Typography
          sx={{
            color: value ? "text.primary" : "text.disabled",
            whiteSpace: "nowrap", // để không bị xuống dòng
          }}
        >
          Time : {value || "00:00 - 00:00"}
        </Typography>
      </Box>
    </LocalizationProvider>
  );
};
