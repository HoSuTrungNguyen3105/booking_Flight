import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type SetStateAction,
} from "react";
import BaseModal from "../../common/Modal/BaseModal";
import { Add as AddIcon } from "@mui/icons-material";
import { Box, Typography, Divider, Button, Stack } from "@mui/material";

import type { UserWithRelationsData } from "./type";
import {
  useDeleteAttendance,
  useDeleteLeaveRequest,
  useDeletePayroll,
  useDeleteRequestUnlockById,
} from "../../context/Api/usePostApi";
import {
  DateFormatEnum,
  formatDate,
  formatOffsetDateTime,
} from "../../hooks/format";
import type { GridColDef } from "@mui/x-data-grid";
import TableSection from "../../common/CustomRender/TableSection";
import type { GridRowDef } from "../../common/DataGrid";
import type { IDetailItem } from "../../common/DetailSection";
import DetailSection from "../../common/DetailSection";
import type { Attendance, UserRoleType } from "../../utils/type";
import { useGetUserWithRelations } from "../../context/Api/useGetApi";

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
  /** Attendance columns */
  const columnAttendanceList: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "Attendance ID", flex: 1 },
      {
        field: "date",
        headerName: "Date",
        flex: 1,
        renderCell: ({ value }) => (
          <Typography variant="body2">
            {formatDate(DateFormatEnum.MMMM_D_YYYY, value)}
          </Typography>
        ),
      },
      { field: "checkIn", headerName: "Check In", flex: 1 },
      { field: "checkOut", headerName: "Check Out", flex: 1 },
    ],
    []
  );

  const rowDataPayrolls = useMemo(
    () =>
      selectedAttendances?.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [selectedAttendances]
  );

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
                  👤 {item.employee?.name || "Unknown"}
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
  }, [rowDataPayrolls]);

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
