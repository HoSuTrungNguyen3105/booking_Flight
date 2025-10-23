import { useState, useMemo, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Box, Typography, Stack, Divider, Button } from "@mui/material";
import { useGetAllAttendance } from "../../context/Api/useGetApi";

const AttendanceCalendar = () => {
  const { dataAllAttendance } = useGetAllAttendance();

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const events = useMemo(() => {
    if (!dataAllAttendance?.list) return [];

    return dataAllAttendance.list.map((a: any) => ({
      title: `${a.employee?.name || "Unknown"} (${a.status})`,
      start: a.date,
      color:
        a.status === "PRESENT"
          ? "#4caf50"
          : a.status === "LATE"
          ? "#ff9800"
          : "#f44336",
      extendedProps: { ...a },
    }));
  }, [dataAllAttendance]);

  const handleDateClick = useCallback((info: any) => {
    console.log("info", info);
    console.log("events", events);
    setSelectedDate(info.dateStr);
    setOpenDetail(true);
  }, []);

  const handleEventClick = useCallback((info: any) => {
    const clickedDate = info.event.startStr;
    console.log("info", clickedDate);
    setSelectedDate(clickedDate);
    setOpenDetail(true);
    console.log("setOpenDetail", openDetail);
  }, []);

  const selectedAttendances = useMemo(() => {
    if (!selectedDate || !dataAllAttendance?.list) return [];
    return dataAllAttendance.list.filter((a: any) =>
      a.date.startsWith(selectedDate)
    );
  }, [selectedDate, dataAllAttendance]);

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={events}
        editable
        selectable
        dateClick={handleDateClick}
        // dateClick={handleDateClick}
        eventClick={handleEventClick}
      />

      {/* Modal chi tiết */}
      <Modal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        aria-labelledby="attendance-detail"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography id="attendance-detail" variant="h6" gutterBottom>
            Attendance Detail
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {selectedAttendances.length > 0 ? (
            <Stack spacing={2}>
              {selectedAttendances.map((item: any) => (
                <Box
                  key={item.id}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: "grey.50",
                    border: "1px solid #eee",
                  }}
                >
                  <Typography fontWeight={600}>
                    👤 {item.employee?.name || "Unknown"}
                  </Typography>
                  <Typography>Status: {item.status}</Typography>
                  <Typography>Check-in: {item.checkIn || "N/A"}</Typography>
                  <Typography>Check-out: {item.checkOut || "N/A"}</Typography>
                  <Typography>
                    Worked Hours: {item.workedHours || "0"}
                  </Typography>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary">No data for this day</Typography>
          )}

          <Box mt={3} textAlign="right">
            <Button variant="contained" onClick={() => setOpenDetail(false)}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AttendanceCalendar;
