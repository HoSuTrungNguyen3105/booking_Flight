import { useState, useCallback, memo } from "react";
import { Box, Typography, Chip, Button } from "@mui/material";
import { type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { DateFormatEnum, formatDate } from "../../../../hooks/format";
import CustomPopover from "../../../../common/Button/Popover";
import RequestLeaveActionModal from "./RequestLeaveActionModal";
import { type LeaveRequest } from "../../../../utils/type";
import CreateLeaveRequestForm from "./CreateLeaveRequestForm";
import { useAuth } from "../../../../context/AuthContext";
import theme from "../../../../scss/theme";
import TableSection from "../../../../common/CustomRender/TableSection";
import { useGetLeaveRequest } from "../../../../context/Api/useGetApi";

const LeaveRequestTable = () => {
  const { user } = useAuth();
  const {
    dataGetLeaveRequest,
    refetchGetLeaveRequest,
    loadingGetLeaveRequest,
  } = useGetLeaveRequest();

  const rowData = useCallback(() => {
    return (
      dataGetLeaveRequest?.list?.map((req) => ({
        ...req,
        id: req.id,
      })) ?? []
    );
  }, [dataGetLeaveRequest]);

  const [open, setOpen] = useState(false);
  // const [modalType, setModalType] = useState<"view" | null>(null);
  const [selectedRow, setSelectedRow] = useState<LeaveRequest | null>(null);

  const handleView = (row: LeaveRequest) => {
    setSelectedRow(row);
    // setModalType("view");
    setOpen(true);
  };

  const statuses = [
    {
      key: "PENDING",
      label: "Pending",
      sx: {
        bgcolor: theme.palette.warning.light,
        color: "warning.dark",
        fontWeight: 500,
      },
    },
    {
      key: "APPROVED",
      label: "Approved",
      sx: {
        bgcolor: theme.palette.success.light,
        color: "success.dark",
        fontWeight: 500,
      },
    },
    {
      key: "REJECTED",
      label: "Rejected",
      sx: {
        bgcolor: theme.palette.error.light,
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
        <Box sx={{ mt: 1 }}>
          <CustomPopover
            text="Detail"
            hideSubmitButton
            handleAction={() => {}}
            option={[params.value]}
          />
        </Box>
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
        <Box sx={{ mt: 1 }}>
          <CustomPopover
            hideSubmitButton
            text="Detail"
            handleAction={(opt) => {
              if (opt === "View") handleView(params.row);
            }}
            option={["View"]}
          />
        </Box>
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
      <Typography variant="h5" fontWeight="bold" color="primary.main">
        Danh sách đơn xin nghỉ phép
      </Typography>
      <Button
        size="medium"
        variant="contained"
        onClick={() => setOnCreateRequest(true)}
      >
        Create Request leave
      </Button>

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

      <TableSection
        rows={rowData()}
        nextRowClick
        // largeThan
        isLoading={loadingGetLeaveRequest}
        setRows={() => {}}
        columns={columns}
      />

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

export default memo(LeaveRequestTable);
