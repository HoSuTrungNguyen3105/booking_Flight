import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Box, Typography } from "@mui/material";
import moment, { type Moment } from "moment";
import InputTextField from "../Input/InputTextField";
import ChevronRightSharpIcon from "@mui/icons-material/ChevronRightSharp";

type TimePickerProps = {
  value: string;
  onChange: (val: string) => void;
};

export const OpeningHoursPicker = ({ value, onChange }: TimePickerProps) => {
  const [startTime, setStartTime] = useState<Moment | null>(
    moment(value.split(" - ")[0], "HH:mm")
  );
  const [endTime, setEndTime] = useState<Moment | null>(
    moment(value.split(" - ")[1], "HH:mm")
  );

  const handleUpdate = (start: Moment | null, end: Moment | null) => {
    const formatted = `${start?.format("HH:mm") || "00:00"} - ${
      end?.format("HH:mm") || "00:00"
    }`;
    onChange(formatted);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TimePicker
          label="Mở"
          value={startTime}
          onChange={(newValue) => {
            setStartTime(newValue);
            handleUpdate(newValue, endTime);
          }}
          slotProps={{
            textField: {
              size: "small",
              sx: {
                height: "40px", // chỉnh cho bằng InputTextField
                "& .MuiInputBase-root": {
                  height: "100%",
                },
                "& input": {
                  padding: "4px 8px", // chỉnh padding cho khớp
                },
              },
            },
          }}
        />
        <Typography>-</Typography>
        <TimePicker
          label="Đóng"
          value={endTime}
          onChange={(newValue) => {
            setEndTime(newValue);
            handleUpdate(startTime, newValue);
          }}
          slotProps={{
            textField: {
              size: "small",
              sx: {
                height: "40px", // chỉnh cho bằng InputTextField
                "& .MuiInputBase-root": {
                  height: "100%",
                },
                "& input": {
                  padding: "4px 8px", // chỉnh padding cho khớp
                },
              },
            },
          }}
        />
        <ChevronRightSharpIcon />
        <InputTextField
          sx={{ width: "15rem", height: "90%" }}
          value={value}
          readOnly
          placeholder="00:00 - 00:00"
        />
      </Box>
    </LocalizationProvider>
  );
};
