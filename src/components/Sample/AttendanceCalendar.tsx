import { useState, useMemo, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useGetAllAttendance } from "../../context/Api/useGetApi";
import FindAttendanceByDayModal from "./FindAttendanceByDayModal";

const AttendanceCalendar = () => {
  const { dataAllAttendance } = useGetAllAttendance();

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const formatDate = (timestamp: string | number | null | undefined) => {
    if (!timestamp || timestamp === "0") return undefined;
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

      <FindAttendanceByDayModal
        onSuccess={() => setOpenDetail(false)}
        selectedAttendances={selectedAttendances}
        open={openDetail}
        onClose={() => setOpenDetail(false)}
      />
    </>
  );
};

export default AttendanceCalendar;
