import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";
import { Clock, LogIn, LogOut } from "lucide-react";
import dayjs from "dayjs";
import { nowDecimal } from "../../hooks/format";

export const AttendanceCard = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<number | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<number | null>(null);

  const handleCheckIn = () => {
    // const now = dayjs().format("HH:mm:ss");
    setCheckInTime(nowDecimal());
    setCheckedIn(true);
  };

  const handleCheckOut = () => {
    // const now = dayjs().format("HH:mm:ss");
    setCheckOutTime(nowDecimal());
    setCheckedIn(false);
  };

  return (
    <Card
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 6,
        p: 3,
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        background: "#fafafa",
      }}
    >
      <CardContent>
        <Stack spacing={2} alignItems="center">
          <Clock size={42} color="#1976d2" />
          <Typography variant="h5" fontWeight={600}>
            Attendance Tracker
          </Typography>

          {/* Thời gian */}
          <Typography variant="body2" color="text.secondary">
            {dayjs().format("dddd, DD MMM YYYY")}
          </Typography>

          {/* Check-in time */}
          {checkInTime && (
            <Box textAlign="center">
              <Typography variant="body2" color="success.main">
                Checked in at:
              </Typography>
              <Typography variant="h6">{checkInTime}</Typography>
            </Box>
          )}

          {/* Check-out time */}
          {checkOutTime && (
            <Box textAlign="center">
              <Typography variant="body2" color="error.main">
                Checked out at:
              </Typography>
              <Typography variant="h6">{checkOutTime}</Typography>
            </Box>
          )}

          {/* Nút hành động */}
          <Stack direction="row" spacing={2} mt={2}>
            <Button
              variant="contained"
              color="success"
              disabled={checkedIn}
              onClick={handleCheckIn}
              startIcon={<LogIn />}
              sx={{ px: 3 }}
            >
              Check In
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={!checkedIn}
              onClick={handleCheckOut}
              startIcon={<LogOut />}
              sx={{ px: 3 }}
            >
              Check Out
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
