import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { Clock, LogIn, LogOut } from "lucide-react";
import dayjs from "dayjs";
import { nowDecimal } from "../../hooks/format";

export const AttendanceCard = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<number | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(dayjs().format("HH:mm:ss"));

  // Cập nhật thời gian hiện tại mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format("HH:mm:ss"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    setCheckInTime(nowDecimal());
    setCheckedIn(true);
  };

  const handleCheckOut = () => {
    setCheckOutTime(nowDecimal());
    setCheckedIn(false);
  };

  return (
    <Card
      sx={{
        maxWidth: 420,
        mx: "auto",
        mt: 8,
        p: 3,
        borderRadius: 4,
        boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        background: "linear-gradient(145deg, #e3f2fd, #ffffff)",
        textAlign: "center",
      }}
    >
      <CardContent>
        <Stack spacing={2} alignItems="center">
          <Clock size={46} color="#1976d2" />
          <Typography variant="h5" fontWeight={700} color="primary.main">
            Attendance Tracker
          </Typography>

          {/* Hiển thị ngày và giờ */}
          <Typography variant="body1" color="text.secondary">
            {dayjs().format("dddd, DD MMM YYYY")}
          </Typography>
          <Typography variant="h6" color="text.primary">
            {currentTime}
          </Typography>

          <Divider sx={{ width: "80%", my: 2 }} />

          {/* Thời gian check-in */}
          {checkInTime && (
            <Box textAlign="center">
              <Typography variant="body2" color="success.main">
                Checked in at:
              </Typography>
              <Typography variant="h6">{checkInTime}</Typography>
            </Box>
          )}

          {/* Thời gian check-out */}
          {checkOutTime && (
            <Box textAlign="center">
              <Typography variant="body2" color="error.main">
                Checked out at:
              </Typography>
              <Typography variant="h6">{checkOutTime}</Typography>
            </Box>
          )}

          {/* Nút hành động */}
          <Stack direction="row" spacing={2} mt={3}>
            <Button
              variant="contained"
              color="success"
              disabled={checkedIn}
              onClick={handleCheckIn}
              startIcon={<LogIn />}
              sx={{
                px: 3,
                textTransform: "none",
                borderRadius: 3,
                boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
              }}
            >
              Check In
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={!checkedIn}
              onClick={handleCheckOut}
              startIcon={<LogOut />}
              sx={{
                px: 3,
                textTransform: "none",
                borderRadius: 3,
                boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
              }}
            >
              Check Out
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
