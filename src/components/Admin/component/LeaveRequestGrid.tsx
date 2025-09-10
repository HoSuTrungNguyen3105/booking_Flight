import React, { useState, useMemo, useCallback, memo } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import {
  type GridColDef,
  type GridRenderCellParams,
  //  type  GridValueGetterParams,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import TableData from "../../../common/DataGrid/index";
import {
  Visibility,
  Edit,
  Delete,
  CalendarMonth,
  Person,
  AccessTime,
} from "@mui/icons-material";
import { useGetLeaveRequest } from "../../Api/usePostApi";
import {
  DateFormatEnum,
  formatDate,
  formatDateKR,
} from "../../../hooks/format";
import CustomPopover from "../../../common/Button/Popover";
import { useToast } from "../../../context/ToastContext";
import RequestLeaveActionModal from "./RequestLeaveActionModal";
import type { LeaveRequest } from "../../../utils/type";
import CreateLeaveRequestForm from "../../User/CreateLeaveRequestForm";
// Mock data - trong thực tế sẽ lấy từ API
// const leaveRequests = [
//   {
//     id: 1,
//     employeeId: 6,
//     employeeName: "Nguyễn Văn A",
//     leaveType: "ANNUAL",
//     startDate: 20250915.92,
//     endDate: 20250917.8,
//     days: 3,
//     reason: "Về quê thăm gia đình",
//     status: "PENDING",
//     appliedAt: 20250910.5,
//     approverName: "Chưa duyệt",
//   },
//   // Thêm các request khác...
// ];

const LeaveRequestGrid = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [pageSize, setPageSize] = useState(10);

  const { dataGetLeaveRequest, refetchGetLeaveRequest } = useGetLeaveRequest();

  const rowData = useCallback(() => {
    return (
      dataGetLeaveRequest?.list?.map((req) => ({
        ...req, // giữ nguyên data
        id: req.id, // đảm bảo DataGrid có id
      })) ?? []
    ); // nếu list undefined thì trả mảng rỗng
  }, [dataGetLeaveRequest]);

  // Hàm chuyển đổi decimal date thành định dạng ngày tháng
  //   const formatDecimalDate = (decimalDate: number): string => {
  //     const dateStr = decimalDate.toString();
  //     const year = dateStr.substring(0, 4);
  //     const month = dateStr.substring(4, 6);
  //     const day = dateStr.substring(6, 8);
  //     return `${day}/${month}/${year}`;
  //   };
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
          option={params.value}
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
    { key: "PENDING", label: "Pending", color: "warning" as const },
    { key: "APPROVED", label: "Approved", color: "success" as const },
    { key: "REJECTED", label: "Rejected", color: "error" as const },
  ];

  const [onCreateRequest, setOnCreateRequest] = useState(false);

  const employees: Array<{ id: number; name: string; email: string }> = [
    { id: 1, name: "Nguyen Ho", email: "nguyenho@example.com" },
    { id: 2, name: "Be Y Nhi", email: "beynhi@example.com" },
    { id: 3, name: "Tran An", email: "tran.an@example.com" },
    { id: 4, name: "Le Minh", email: "le.minh@example.com" },
    { id: 5, name: "Pham Lan", email: "pham.lan@example.com" },
  ];

  if (onCreateRequest) {
    return <CreateLeaveRequestForm employees={employees} />;
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: "white",
      }}
    >
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold" color="primary.main">
          Danh sách đơn xin nghỉ phép
        </Typography>
        <Box>
          <Button onClick={() => setOnCreateRequest(true)} />
        </Box>
      </Box>

      <Box
        mt={3}
        p={2}
        sx={{
          backgroundColor: "grey.50",
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
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
                <Chip label={count} color={status.color} size="small" />
                <Typography variant="body2">{status.label}</Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ height: "30rem", width: "100%" }}>
        <TableData rows={rowData()} columns={columns} />
      </Box>

      <RequestLeaveActionModal
        selectedRows={selectedRow}
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          refetchGetLeaveRequest();
        }}
      />
    </Paper>
  );
};

export default memo(LeaveRequestGrid);
