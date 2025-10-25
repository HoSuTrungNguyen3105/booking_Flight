import { useState, useMemo, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useGetAllAttendance } from "../../context/Api/useGetApi";
import FindAttendanceByDayModal from "./FindAttendanceByDayModal";
// import { DateFormatEnum, formatDate } from "../../hooks/format";

const AttendanceCalendar = () => {
  const { dataAllAttendance } = useGetAllAttendance();

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // const formatDate = (timestamp: string | number) => {
  //   if (!timestamp || timestamp === "0") return null;
  //   const date = new Date(Number(timestamp));
  //   return date.toISOString();
  // };

  // const events = useMemo(() => {
  //   if (!dataAllAttendance?.list) return [];

  //   return dataAllAttendance.list.map((a: any) => ({
  //     title: `${a.employee?.name || "Unknown"} (${a.status})`,
  //     start: formatDate(a.checkIn || a.date),
  //     end: formatDate(a.checkOut),
  //     color:
  //       a.status === "PRESENT"
  //         ? "#4caf50"
  //         : a.status === "LATE"
  //         ? "#ff9800"
  //         : "#f44336",
  //     extendedProps: { ...a },
  //   }));
  // }, [dataAllAttendance]);

  // const events = useMemo(() => {
  //   if (!dataAllAttendance?.list) return [];

  //   return dataAllAttendance.list
  //     .map((a: any) => {
  //       const start = formatDate(DateFormatEnum.DD_MM_YYYY_HH_MM_SS, a.checkIn);
  //       const end = formatDate(a.checkOut);
  //       if (!start) return null;
  //       if (!end) return null;

  //       return {
  //         title: `${a.employee?.name || "Unknown"} (${a.status})`,
  //         start,
  //         end,
  //         color:
  //           a.status === "PRESENT"
  //             ? "#4caf50"
  //             : a.status === "LATE"
  //             ? "#ff9800"
  //             : "#f44336",
  //         extendedProps: { ...a },
  //       };
  //     })
  //     .filter(Boolean);
  // }, [dataAllAttendance]);

  const formatDate = (timestamp: string | number) => {
    if (!timestamp || timestamp === "0") return null;
    const date = new Date(Number(timestamp));
    return date.toISOString();
  };

  const events = useMemo(() => {
    if (!dataAllAttendance?.list) return [];

    return dataAllAttendance.list.map((a: any) => ({
      title: `${a.employee?.name || "Unknown"} (${a.status})`,
      start: formatDate(a.checkIn || a.date),
      end: formatDate(a.checkOut),
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
    setSelectedDate(info.dateStr);
    setOpenDetail(true);
  }, []);

  const handleEventClick = useCallback((info: any) => {
    const clickedDate = info.event.startStr.split("T")[0];
    setSelectedDate(clickedDate);
    setOpenDetail(true);
  }, []);

  const selectedAttendances = useMemo(() => {
    if (!selectedDate || !dataAllAttendance?.list) return [];

    return dataAllAttendance.list.filter((a: any) => {
      const date = new Date(Number(a.date)).toISOString().split("T")[0];
      return date === selectedDate;
    });
  }, [selectedDate, dataAllAttendance]);

  // const formatTime = (timestamp: string | number | null) => {
  //   if (!timestamp || timestamp === "0") return "N/A";
  //   const d = new Date(Number(timestamp));
  //   return d.toLocaleTimeString("vi-VN");
  // };

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
        eventClick={handleEventClick}
      />

      {/* Modal chi tiết */}
      <FindAttendanceByDayModal
        onSuccess={() => {}}
        selectedAttendances={selectedAttendances}
        open={openDetail}
        onClose={() => setOpenDetail(false)}
      />
      {/* <Modal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        aria-labelledby="attendance-detail"
      >
        <Box
          sx={{
            position: "absolute",
            // top: "50%",
            // left: "50%",
            // transform: "translate(-50%, -50%)",
            width: "20rem",
            bgcolor: "background.paper",
            //boxShadow: 24,
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography id="attendance-detail" variant="h6" gutterBottom>
            Attendance Detail ({selectedDate})
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
                  <Typography>Check-in: {formatTime(item.checkIn)}</Typography>
                  <Typography>
                    Check-out: {formatTime(item.checkOut)}
                  </Typography>
                  <Typography>Worked Hours: {item.workedHours ?? 0}</Typography>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary">
              No attendance data for this day
            </Typography>
          )}

          <Box mt={3} textAlign="right">
            <Button variant="contained" onClick={() => setOpenDetail(false)}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal> */}
    </>
  );
};

export default AttendanceCalendar;
