import { memo, useCallback, useMemo } from "react";
import BaseModal from "../../common/Modal/BaseModal";
import { Add as AddIcon } from "@mui/icons-material";
import { Box, Typography, Button, Stack } from "@mui/material";
import {
  DateFormatEnum,
  formatDate,
  formatOffsetDateTime,
} from "../../hooks/format";
import type { GridColDef } from "@mui/x-data-grid";
import type { Attendance } from "../../utils/type";

interface IModalGeneratePayrollProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedAttendances: Attendance[];
}

const FindAttendanceByDayModal = ({
  open,
  onClose,
  onSuccess,
  selectedAttendances,
}: IModalGeneratePayrollProps) => {
  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="outlined" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="contained" onClick={onSuccess}>
          Xác nhận
        </Button>
      </Box>
    );
  }, [onClose, onSuccess]);

  /** Modal Content */
  const renderContent = useCallback(() => {
    return (
      <Box height={"60vh"} width={"50rem"}>
        <Typography variant="h6" gutterBottom>
          Thông tin nhân viên
        </Typography>

        {selectedAttendances.length > 0 ? (
          <Stack spacing={2}>
            {selectedAttendances.map((item) => (
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
                  {item.employee?.name || "Unknown"}
                </Typography>
                <Typography>Status: {item.status}</Typography>
                <Typography>
                  Check-in: {formatOffsetDateTime(item.checkIn)}
                </Typography>
                <Typography>
                  Check-out: {formatOffsetDateTime(item.checkOut)}
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
      </Box>
    );
  }, [selectedAttendances]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Chi tiết nhân viên"
      Icon={AddIcon}
      maxWidth="lg"
      slots={{
        content: renderContent(),
        actions: renderActions(),
      }}
    />
  );
};

export default memo(FindAttendanceByDayModal);
