import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
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

  const { dataGetLeaveRequest } = useGetLeaveRequest();

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
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(
    null
  );
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const toast = useToast();

  const handleView = (row: any) => {
    setSelectedRow(row);
    setModalType("view");
    toast("view");
    setOpen(true);
  };

  const handleEdit = (row: any) => {
    setSelectedRow(row);
    setModalType("edit");
    toast("edit");
    setOpen(true);
  };

  const handleDelete = (row: any) => {
    setSelectedRow(row);
    setModalType("delete");
    toast("delete");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModalType(null);
    setSelectedRow(null);
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

    // {
    //   field: "leaveType",
    //   headerName: "Loại nghỉ",
    //   flex: 1,
    //   renderCell: (params: GridRenderCellParams) => (
    //     <Chip
    //       label={getLeaveTypeLabel(params.value)}
    //       size="small"
    //       color="primary"
    //       variant="outlined"
    //     />
    //   ),
    // },
    {
      field: "startDate",
      headerName: "Ngày bắt đầu",
      flex: 2,
      //   valueGetter: (value, row) => formatDate(row.startDate),
      valueFormatter: (value) =>
        formatDateKR(DateFormatEnum.MM_DD_YYYY_HH_MM_SS, value),
    },
    {
      field: "endDate",
      headerName: "Ngày kết thúc",
      flex: 2,
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
      //   renderCell: (params) => (
      //     <Tooltip title={params.value} placement="top">
      //       <Typography
      //         variant="body2"
      //       >
      //         {params.value}
      //       </Typography>
      //     </Tooltip>
      //   ),
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
      field: "leaveType",
      headerName: "Trạng thái",
      flex: 1,
    },
    {
      field: "appliedAt",
      headerName: "Ngày đăng ký",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" gap={1}>
          <AccessTime color="action" fontSize="small" />
          <Typography variant="body2">
            {formatDateKR(DateFormatEnum.MMMM_D_YYYY_HH_MM_SS, params.value)}{" "}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      //   type: "actions",
      flex: 1,
      headerName: "Thao tác",
      renderCell: (params: GridRenderCellParams) => (
        <CustomPopover
          icon="Detail"
          handleAction={(opt) => {
            if (opt === "View") handleView(params);
            if (opt === "Edit") handleEdit(params);
            if (opt === "Delete") handleDelete(params);
          }}
          option={["View", "Edit", "Delete"]}
        />
      ),
      //   renderCell: (params) => [
      //     <GridActionsCellItem
      //       icon={
      //         <Tooltip title="Xem chi tiết">
      //           <Visibility />
      //         </Tooltip>
      //       }
      //       label="View"
      //       onClick={() => handleView(params.row)}
      //       color="primary"
      //     />,
      //     <GridActionsCellItem
      //       icon={
      //         <Tooltip title="Chỉnh sửa">
      //           <Edit />
      //         </Tooltip>
      //       }
      //       label="Edit"
      //       onClick={() => handleEdit(params.row)}
      //       //   color="warning"
      //       disabled={params.row.status !== "PENDING"}
      //     />,
      //     <GridActionsCellItem
      //       icon={
      //         <Tooltip title="Xóa">
      //           <Delete />
      //         </Tooltip>
      //       }
      //       label="Delete"
      //       onClick={() => handleDelete(params.row)}
      //       //   color="error"
      //       disabled={params.row.status !== "PENDING"}
      //     />,
      //   ],
    },
  ];

  const statuses = [
    { key: "PENDING", label: "Pending", color: "warning" as const },
    { key: "APPROVED", label: "Approved", color: "success" as const },
    { key: "REJECTED", label: "Rejected", color: "error" as const },
  ];

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
        <Typography variant="body2" color="text.secondary">
          Quản lý và theo dõi các đơn xin nghỉ phép của nhân viên
        </Typography>
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
    </Paper>
  );
};

export default LeaveRequestGrid;
