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
import { Box, Typography, Divider, Button } from "@mui/material";

import type { UserWithRelationsData } from "../Sample/type";
import {
  useDeleteAttendance,
  useDeleteLeaveRequest,
  useDeletePayroll,
  useDeleteRequestUnlockById,
} from "../../context/Api/usePostApi";
import { DateFormatEnum, formatDate } from "../../hooks/format";
import type { GridColDef } from "@mui/x-data-grid";
import TableSection from "../../common/CustomRender/TableSection";
import type { GridRowDef } from "../../common/DataGrid";
import type { IDetailItem } from "../../common/CustomRender/DetailSection";
import DetailSection from "../../common/CustomRender/DetailSection";
import type { UserRoleType } from "../../utils/type";
import { useGetUserWithRelations } from "../../context/Api/useGetApi";

interface IModalGeneratePayrollProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  id: number;
}

type TableSelectionKey =
  | "transferAdmin"
  | "attendance"
  | "payroll"
  | "leaveRequests"
  | "unlockRequests";

type TableSelections = Record<TableSelectionKey, GridRowDef[]>;

const ConfirmDeleteModal = ({
  open,
  onClose,
  onSuccess,
  id,
}: IModalGeneratePayrollProps) => {
  const { dataGetUserWithRelations, refetchGetUserWithRelations } =
    useGetUserWithRelations({ id });

  const [selectedRows, setSelectedRows] = useState<TableSelections>({
    attendance: [],
    payroll: [],
    leaveRequests: [],
    unlockRequests: [],
    transferAdmin: [],
  });

  const updateSelectedRows = (
    key: TableSelectionKey,
    rows: SetStateAction<GridRowDef[]>
  ) => {
    setSelectedRows((prev) => ({
      ...prev,
      [key]:
        typeof rows === "function" ? (rows(prev[key]) as GridRowDef[]) : rows,
    }));
  };

  const { refetchDeleteLeaveRequest } = useDeleteLeaveRequest();

  useEffect(() => {
    if (open) {
      refetchGetUserWithRelations();
    }
  }, [open, id, refetchGetUserWithRelations]);

  const { refetchDeletePayroll } = useDeletePayroll();
  const { refetchRequestUnlockAccount } = useDeleteRequestUnlockById();
  const { refetchDeleteAttendance } = useDeleteAttendance();

  const handleDeleteRow = async (table: keyof TableSelections, id: number) => {
    // setSelectDelete(table);

    switch (table) {
      case "attendance": {
        await refetchDeleteAttendance({ id });
        break;
      }
      case "unlockRequests": {
        await refetchRequestUnlockAccount({ id });
        break;
      }
      case "leaveRequests": {
        await refetchDeleteLeaveRequest({ id });
        break;
      }
      case "payroll": {
        await refetchDeletePayroll({ id });
        break;
      }
      default: {
        console.warn("Không có loại bảng hợp lệ để xoá");
        break;
      }
    }
  };

  const userData: UserWithRelationsData | null = useMemo(() => {
    const d = dataGetUserWithRelations?.data;
    if (!d) return null;

    return {
      name: d.name ?? "",
      email: d.email ?? "",
      phone: d.phone ?? "",
      role: d.role as UserRoleType,
      rank: d.rank ?? undefined,
      status: d.status ?? "",

      position: d.position ?? "",
      lastLoginDate: d.lastLoginDate ?? 0,
      department: d.department ?? "",

      employeeNo: d.employeeNo ?? "",
      hireDate: d.hireDate ?? undefined,
      transferAdmin: d.transferAdmin ?? [],
      attendance: d.attendance ?? [],
      leaveRequests: d.leaveRequests ?? [],
      payrolls: d.payrolls ?? [],
      unlockRequests: d.unlockRequests ?? [],
    };
  }, [dataGetUserWithRelations]);

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
      {
        field: "actions",
        headerName: "Action",
        flex: 1,
        renderCell: ({ row }) => (
          <Button
            color="error"
            onClick={() => {
              handleDeleteRow("attendance", row.id);
              refetchGetUserWithRelations();
            }}
          >
            Delete
          </Button>
        ),
      },
    ],
    []
  );

  const transferAdminColumns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
    },
    {
      field: "userId",
      headerName: "User ID",
      flex: 1,
    },
    {
      field: "fromUserId",
      headerName: "From User",
      flex: 1,
    },
    {
      field: "toUserId",
      headerName: "To User",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const value = params.value as string;
        let color = "default";
        if (value === "APPROVED") color = "success";
        if (value === "REJECTED") color = "error";
        if (value === "PENDING") color = "warning";

        return (
          <Box
            style={{
              padding: "6px 12px",
              borderRadius: 1,
              backgroundColor:
                color === "success"
                  ? "#d1fae5"
                  : color === "error"
                  ? "#fee2e2"
                  : color === "warning"
                  ? "#fef3c7"
                  : "#f3f4f6",
              color:
                color === "success"
                  ? "#065f46"
                  : color === "error"
                  ? "#991b1b"
                  : color === "warning"
                  ? "#92400e"
                  : "#374151",
            }}
          >
            {value}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      renderCell: ({ row }) => (
        <Button
          color="error"
          onClick={() => {
            handleDeleteRow("transferAdmin", row.id);
            refetchGetUserWithRelations();
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const leaveRequestColumns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "leaveType", headerName: "Loại nghỉ", flex: 1 },
    {
      field: "startDate",
      headerName: "Ngày bắt đầu",
      flex: 1.2,
      renderCell: ({ value }) => (
        <Typography variant="body2">{formatDate(value)}</Typography>
      ),
    },
    {
      field: "endDate",
      headerName: "Ngày kết thúc",
      flex: 1.2,
      renderCell: ({ value }) => (
        <Typography variant="body2">{formatDate(value)}</Typography>
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          color={
            value === "APPROVED"
              ? "green"
              : value === "REJECTED"
              ? "red"
              : "orange"
          }
        >
          {value}
        </Typography>
      ),
    },
    {
      field: "decidedAt",
      headerName: "Ngày quyết định",
      flex: 1.2,
      renderCell: ({ value }) => (
        <Typography variant="body2">{formatDate(value)}</Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      renderCell: ({ row }) => (
        <Button
          color="error"
          onClick={() => {
            handleDeleteRow("leaveRequests", row.id);
            refetchGetUserWithRelations();
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const unlockRequestColumns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          color={
            value === "APPROVED"
              ? "green"
              : value === "REJECTED"
              ? "red"
              : "orange"
          }
        >
          {value}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      flex: 1.5,
      renderCell: ({ value }) => (
        <Typography variant="body2">{formatDate(value)}</Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      renderCell: ({ row }) => (
        <Button
          color="error"
          onClick={() => {
            handleDeleteRow("unlockRequests", row.id);
            refetchGetUserWithRelations();
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  /** Payroll columns */
  const columnPayrolls: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "Payroll ID", flex: 1 },
      { field: "year", headerName: "Year", flex: 1 },
      { field: "month", headerName: "Month", flex: 1 },
      { field: "netPay", headerName: "Net Pay", flex: 1 },
      {
        field: "actions",
        headerName: "Action",
        flex: 1,
        renderCell: ({ row }) => (
          <Button
            color="error"
            onClick={() => {
              handleDeleteRow("payroll", row.id);
              refetchGetUserWithRelations();
            }}
          >
            Delete
          </Button>
        ),
      },
    ],
    []
  );

  /** Table rows */
  const rowDataAttendance = useMemo(
    () =>
      userData?.attendance?.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [userData?.attendance]
  );

  const rowDataPayrolls = useMemo(
    () =>
      userData?.payrolls?.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [userData?.payrolls]
  );

  const rowTransferAdmin = useMemo(() => {
    if (!userData?.transferAdmin) return [];
    const transfer = userData.transferAdmin;
    return Array.isArray(transfer) ? transfer : [transfer];
  }, [userData?.transferAdmin]);

  const rowDataUnlockRequests = useMemo(
    () =>
      userData?.unlockRequests?.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [userData?.attendance]
  );

  const rowDataLeaveRequests = useMemo(
    () =>
      userData?.leaveRequests?.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [userData?.payrolls]
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
  const renderContent = useCallback(
    (data: UserWithRelationsData) => {
      const employeeInfo: IDetailItem[] = [
        { title: "Email", description: data.email, size: 8 },
        { title: "Mã NV", description: data.employeeNo, size: 6 },
        { title: "Tên", description: data.name, size: 6 },
        { title: "Điện thoại", description: data.phone, size: 6 },
        { title: "Chức vụ", description: data.role, size: 6 },
        { title: "Cấp bậc", description: data.rank, size: 5 },
        {
          title: "Department",
          description: data.department,
          size: 6,
        },
        { title: "position", description: data.position, size: 6 },
        {
          title: "Last Login Date",
          description: (
            <Typography>
              {formatDate(
                DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
                data?.lastLoginDate
              )}
            </Typography>
          ),
          size: 5,
        },
        {
          title: "Ngày vào làm",
          description: (
            <Typography>
              {formatDate(DateFormatEnum.DD_MM_YYYY_HH_MM_SS, data?.hireDate)}
            </Typography>
          ),
          size: 5,
        },
      ];

      return (
        <Box height={"60vh"} width={"50rem"}>
          <Typography variant="h6" gutterBottom>
            Thông tin nhân viên
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <DetailSection data={employeeInfo} />

          {selectedRows.payroll.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Danh sách Payrolls
              </Typography>
              <TableSection
                setRows={(rows) => updateSelectedRows("payroll", rows)}
                isLoading={false}
                nextRowClick
                rows={rowDataPayrolls}
                columns={columnPayrolls}
              />
            </Box>
          )}

          {selectedRows.transferAdmin && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Transfer Admin
              </Typography>
              <TableSection
                setRows={(rows) => updateSelectedRows("transferAdmin", rows)}
                isLoading={false}
                nextRowClick
                rows={rowTransferAdmin}
                columns={transferAdminColumns}
              />
            </Box>
          )}

          {/* Attendance */}
          {selectedRows.attendance?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Attendance
              </Typography>
              <TableSection
                setRows={(rows) => updateSelectedRows("attendance", rows)}
                isLoading={false}
                nextRowClick
                rows={rowDataAttendance}
                columns={columnAttendanceList}
              />
            </Box>
          )}

          {selectedRows.payroll?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Payroll
              </Typography>
              <TableSection
                setRows={(rows) => updateSelectedRows("payroll", rows)}
                isLoading={false}
                nextRowClick
                rows={rowDataPayrolls}
                columns={columnPayrolls}
              />
            </Box>
          )}

          {selectedRows.unlockRequests?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Danh sách unlock Requests
              </Typography>
              <TableSection
                setRows={(rows) => updateSelectedRows("unlockRequests", rows)}
                isLoading={false}
                nextRowClick
                rows={rowDataUnlockRequests}
                columns={unlockRequestColumns}
              />
            </Box>
          )}

          {/* Attendance */}
          {selectedRows.leaveRequests?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Leave Requests
              </Typography>
              <TableSection
                setRows={(rows) => updateSelectedRows("leaveRequests", rows)}
                isLoading={false}
                nextRowClick
                rows={rowDataLeaveRequests}
                columns={leaveRequestColumns}
              />
            </Box>
          )}
        </Box>
      );
    },
    [rowDataPayrolls, selectedRows, rowDataAttendance]
  );

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Chi tiết nhân viên"
      Icon={AddIcon}
      maxWidth="lg"
      slots={{
        content: userData ? (
          renderContent(userData)
        ) : (
          <Typography>Không có dữ liệu</Typography>
        ),
        actions: renderActions(),
      }}
    />
  );
};

export default memo(ConfirmDeleteModal);
