import { useState, useCallback, memo } from "react";
import { Box, Typography, Chip, Button, Stack } from "@mui/material";
import { type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import TableData from "../../../common/DataGrid/index";
import { useGetLeaveRequest } from "../../Api/usePostApi";
import {
  DateFormatEnum,
  formatDate,
  formatDateKR,
} from "../../../hooks/format";
import CustomPopover from "../../../common/Button/Popover";
import RequestLeaveActionModal from "./RequestLeaveActionModal";
import { UserRole, type LeaveRequest } from "../../../utils/type";
import CreateLeaveRequestForm from "../../User/CreateLeaveRequestForm";
import { useAuth } from "../../../context/AuthContext";

const LeaveRequestGrid = () => {
  const { user } = useAuth();
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
  const [modalType, setModalType] = useState<"view" | null>(null);
  const [selectedRow, setSelectedRow] = useState<LeaveRequest | null>(null);

  const handleView = (row: LeaveRequest) => {
    setSelectedRow(row);
    setModalType("view");
    setOpen(true);
  };

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
        formatDate(DateFormatEnum.MM_DD_YYYY_HH_MM_SS, value),
    },
    {
      field: "endDate",
      headerName: "Ngày kết thúc",
      flex: 1.5,
      valueFormatter: (value) =>
        formatDate(DateFormatEnum.MM_DD_YYYY_HH_MM_SS, value),
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
          hideSubmitButton
          handleAction={() => {}}
          option={[params.value]}
        />
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const status = statuses.find((s) => s.key === params.value);

        return (
          <Chip
            label={
              status?.key === "PENDING"
                ? "Chờ duyệt"
                : status?.key === "APPROVED"
                ? "Đã duyệt"
                : status?.key === "REJECTED"
                ? "Từ chối"
                : "Không xác định"
            }
            size="small"
            sx={{
              textTransform: "capitalize",
              ...status?.sx,
            }}
          />
        );
      },
    },
    {
      field: "appliedAt",
      headerName: "Ngày đăng ký",
      flex: 1,
      renderCell: (params: GridRenderCellParams) =>
        formatDate(DateFormatEnum.MMMM_D_YYYY_HH_MM_SS, params.value),
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

  const [onCreateRequest, setOnCreateRequest] = useState(false);

  if (onCreateRequest) {
    return (
      <CreateLeaveRequestForm
        onSuccess={() => {
          setOnCreateRequest(false);
          refetchGetLeaveRequest();
        }}
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
        {/* {user?.role === UserRole.USER && ( */}
        <Box>
          <Typography></Typography>
          <Button variant="contained" onClick={() => setOnCreateRequest(true)}>
            Create Request leave
          </Button>
        </Box>
        {/* )} */}
      </Stack>

      <Box p={2}>
        <Typography variant="subtitle2" fontWeight="bold" mb={1}>
          Thống kê nhanh
        </Typography>
        <Box display="flex" gap={3} flexWrap="wrap">
          {statuses.map((status) => {
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
