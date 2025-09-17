import React, { useState, useCallback, memo } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
  Button,
  Stack,
} from "@mui/material";
import { type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import TableData from "../../../common/DataGrid/index";
import { useGetLeaveRequest } from "../../Api/usePostApi";
import { DateFormatEnum, formatDateKR } from "../../../hooks/format";
import CustomPopover from "../../../common/Button/Popover";
import RequestLeaveActionModal from "./RequestLeaveActionModal";
import { UserRole, type LeaveRequest } from "../../../utils/type";
import CreateLeaveRequestForm from "../../User/CreateLeaveRequestForm";
import { useAuth } from "../../../context/AuthContext";

const LeaveRequestGrid = () => {
  const theme = useTheme();
  const { user } = useAuth();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { dataGetLeaveRequest, refetchGetLeaveRequest } = useGetLeaveRequest();

  const rowData = useCallback(() => {
    return (
      dataGetLeaveRequest?.list?.map((req) => ({
        ...req,
        id: req.id,
      })) ?? []
    );
  }, [dataGetLeaveRequest]);

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modalType, setModalType] = useState<"view" | null>(null);
  const [selectedRow, setSelectedRow] = useState<LeaveRequest | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleView = (row: LeaveRequest) => {
    setSelectedRow(row);
    setModalType("view");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModalType(null);
    // setSelectedRow(null);
  };

  // Hàm lấy màu cho trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  // Hàm lấy label cho loại leave
  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case "ANNUAL":
        return "Nghỉ phép năm";
      case "SICK":
        return "Nghỉ ốm";
      case "UNPAID":
        return "Nghỉ không lương";
      default:
        return type;
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "employee",
      headerName: "Nhân viên",
      flex: 1,
      renderCell: (params) => params.row.employee?.name,
    },
    {
      field: "startDate",
      headerName: "Ngày bắt đầu",
      flex: 1.5,
      valueFormatter: (value) =>
        formatDateKR(DateFormatEnum.MM_DD_YYYY_HH_MM_SS, value),
    },
    {
      field: "endDate",
      headerName: "Ngày kết thúc",
      flex: 1.5,
      valueFormatter: (value) =>
        formatDateKR(DateFormatEnum.MM_DD_YYYY_HH_MM_SS, value),
    },

    {
      field: "days",
      headerName: "Số ngày",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Chip label={`${params.value} ngày`} color="secondary" size="small" />
      ),
    },
    {
      field: "reason",
      headerName: "Lý do",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <CustomPopover
          icon="Detail"
          handleAction={() => {}}
          option={[params.value]}
        />
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value === "PENDING" ? "Chờ duyệt" : params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: "appliedAt",
      headerName: "Ngày đăng ký",
      flex: 1,
      renderCell: (params: GridRenderCellParams) =>
        formatDateKR(DateFormatEnum.MMMM_D_YYYY_HH_MM_SS, params.value),
    },
    {
      field: "actions",
      flex: 1,
      headerName: "Thao tác",
      renderCell: (params: GridRenderCellParams) => (
        <CustomPopover
          icon="Detail"
          handleAction={(opt) => {
            if (opt === "View") handleView(params.row);
          }}
          option={["View"]}
        />
      ),
    },
  ];

  const statuses = [
    {
      key: "PENDING",
      label: "Pending",
      sx: {
        bgcolor: "warning.light",
        color: "warning.dark",
        fontWeight: 500,
      },
    },
    {
      key: "APPROVED",
      label: "Approved",
      sx: {
        bgcolor: "success.light",
        color: "success.dark",
        fontWeight: 500,
      },
    },
    {
      key: "REJECTED",
      label: "Rejected",
      sx: {
        bgcolor: "error.light",
        color: "error.dark",
        fontWeight: 500,
      },
    },
  ];

  const [onCreateRequest, setOnCreateRequest] = useState(false);

  if (onCreateRequest) {
    return (
      <CreateLeaveRequestForm
        onSuccess={() => setOnCreateRequest(false)}
        employees={user?.id as number}
      />
    );
  }

  return (
    <>
      <Stack>
        <Typography variant="h5" fontWeight="bold" color="primary.main">
          Danh sách đơn xin nghỉ phép
        </Typography>
        {user?.role === UserRole.USER && (
          <Box>
            <Typography></Typography>
            <Button
              variant="contained"
              onClick={() => setOnCreateRequest(true)}
            >
              Create Request leave
            </Button>
          </Box>
        )}
      </Stack>

      <Box p={2}>
        <Typography variant="subtitle2" fontWeight="bold" mb={1}>
          Thống kê nhanh
        </Typography>
        <Box display="flex" gap={3} flexWrap="wrap">
          {statuses.map((status) => {
            const count =
              dataGetLeaveRequest?.list?.filter(
                (req) => req.status === status.key
              ).length ?? 0;

            return (
              <Box key={status.key} display="flex" alignItems="center" gap={1}>
                <Chip
                  label={status.label}
                  sx={{
                    ...status.sx,
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    px: 1,
                  }}
                  // size="small"
                />
                <Typography variant="body2">{status.label}</Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ height: "30rem", width: "100%" }}>
        <TableData rows={rowData()} columns={columns} />
      </Box>
      {open && selectedRow && (
        <RequestLeaveActionModal
          selectedRows={selectedRow}
          open={open}
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            refetchGetLeaveRequest();
          }}
        />
      )}
    </>
  );
};

export default memo(LeaveRequestGrid);
