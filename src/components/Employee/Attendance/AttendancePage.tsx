import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import { Check, Info } from "lucide-react";
import DateTimePickerComponent from "../../../common/DayPicker/index";
import { nowDecimal } from "../../../hooks/format";
import InputTextField from "../../../common/Input/InputTextField";
import { AttendanceCard } from "./AttendanceCard";

interface Worker {
  id: string;
  name: string;
  morning: boolean;
  afternoon: boolean;
}

type Shift = "morning" | "afternoon";

const workersMock: Worker[] = [
  { id: "CN001", name: "A.NAM", morning: true, afternoon: true },
  { id: "CN010", name: "ANH THÁI", morning: true, afternoon: true },
  { id: "CN014", name: "C.NHIỄM", morning: true, afternoon: true },
];

export default function AttendancePage() {
  const [date, setDate] = useState<number>(nowDecimal());
  const [attendanceCard, setAttendanceCard] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [shift, setShift] = useState<Shift>("morning");

  // Chuyển ca làm việc thành "mốc thời gian trong ngày" (theo kiểu decimal timestamp)
  const verifyDateMilionsToDaytime = (shift: Shift): number => {
    const current = new Date();

    // đặt giờ tương ứng cho từng ca
    if (shift === "morning") {
      current.setHours(8, 0, 0, 0); // 8:00 sáng
    } else if (shift === "afternoon") {
      current.setHours(13, 0, 0, 0); // 1:00 chiều
    }

    // Trả về dạng milliseconds hoặc seconds tùy anh muốn
    return current.getTime(); // milliseconds
    // hoặc: return Math.floor(current.getTime() / 1000); // seconds
  };

  const [workers, setWorkers] = useState<Worker[]>(workersMock);
  const markShift = (isAbsent: boolean) => {
    if (!selectedWorker) return;
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === selectedWorker
          ? shift === "morning"
            ? { ...w, morning: !isAbsent }
            : { ...w, afternoon: !isAbsent }
          : w
      )
    );
  };

  const markAllDay = (isAbsent: boolean) => {
    if (!selectedWorker) return;
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === selectedWorker
          ? {
              ...w,
              morning: !isAbsent,
              afternoon: !isAbsent,
            }
          : w
      )
    );
  };

  if (attendanceCard) {
    return <AttendanceCard />;
  }

  return (
    <>
      <Typography variant="h5" fontWeight="600" mb={2}>
        Quản Lý Điểm Danh
      </Typography>

      <Grid container spacing={3}>
        {/* LEFT SIDE */}
        <Grid size={6}>
          <Paper sx={{ p: 3 }}>
            <Typography fontWeight={600}>Chọn Ngày</Typography>
            <Button onClick={() => setAttendanceCard(true)} variant="contained">
              {" "}
              Attendance Card
            </Button>
            <Box mt={1} display="flex" gap={2}>
              <DateTimePickerComponent
                language="en"
                value={Number(date)}
                onChange={(e) => setDate(e)}
              />
              <InputTextField
                sx={{ width: "20rem" }}
                disabled
                value={String(nowDecimal())}
              />

              {/* <TextField value="10/11/2025 (Hôm nay)" size="small" disabled /> */}
            </Box>

            <Box mt={3}>
              <Typography fontWeight={600}>Đánh Dấu Vắng</Typography>

              <TextField
                fullWidth
                select
                label="Chọn công nhân"
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
                size="small"
                sx={{ mt: 2 }}
              >
                {workers.map((w) => (
                  <MenuItem key={w.id} value={w.id}>
                    {w.id} – {w.name}
                  </MenuItem>
                ))}
              </TextField>

              <Typography mt={2} fontWeight={600}>
                Ca Làm Việc
              </Typography>

              <RadioGroup
                row
                value={shift}
                onChange={(e) => setShift(e.target.value as any)}
              >
                <FormControlLabel
                  value="morning"
                  control={<Radio />}
                  label="Ca Sáng"
                />
                <FormControlLabel
                  value="afternoon"
                  control={<Radio />}
                  label="Ca Chiều"
                />
              </RadioGroup>

              <Paper
                sx={{
                  p: 2,
                  mt: 2,
                  bgcolor: "#f7f7f7",
                }}
              >
                <Box display="flex" gap={1} alignItems="start">
                  <Info size={18} />{" "}
                  <Box>
                    <Typography>
                      - Có thể đánh dấu vắng cho ngày bất kỳ
                    </Typography>
                    <Typography>
                      - Đánh dấu vắng trước khi nhân viên thông báo
                    </Typography>
                    <Typography>
                      - Xem lại các ngày trước để kiểm tra
                    </Typography>
                    <Typography>
                      - Có thể đánh dấu vắng cả ngày & cả ca
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Action Buttons */}
              <Box mt={3}>
                <Typography fontWeight={600}>Đánh Dấu Theo Ca</Typography>

                <Box display="flex" gap={2} mt={1}>
                  <Button variant="contained" onClick={() => markShift(true)}>
                    Vắng Ca Sáng/Chiều
                  </Button>
                  <Button variant="outlined" onClick={() => markShift(false)}>
                    Bỏ Vắng Ca
                  </Button>
                </Box>
              </Box>

              <Box mt={3}>
                <Typography fontWeight={600}>Đánh Dấu Cả Ngày</Typography>
                <Box display="flex" gap={2} mt={1}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => markAllDay(true)}
                  >
                    Vắng Cả Ngày
                  </Button>
                  <Button variant="outlined" onClick={() => markAllDay(false)}>
                    Bỏ Vắng Cả Ngày
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT SIDE */}
        <Grid size={6}>
          <Paper sx={{ p: 3 }}>
            <Typography fontWeight={600} mb={2}>
              Tổng Hợp Ngày {date}
            </Typography>

            <List>
              {workers.map((w) => (
                <Box key={w.id}>
                  <ListItem>
                    <Box width="100%">
                      <Typography fontWeight={600}>
                        {w.id} – {w.name}
                      </Typography>

                      <Box display="flex" justifyContent="space-between">
                        <Typography>
                          Ca Sáng: {w.morning ? <Check size={18} /> : "Vắng"}
                        </Typography>
                        <Typography>
                          Ca Chiều: {w.afternoon ? <Check size={18} /> : "Vắng"}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
