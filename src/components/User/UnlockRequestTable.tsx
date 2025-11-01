import { Chip, Box, Button, Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useGetUnlockRequests } from "../../context/Api/useGetApi";
import { memo, useCallback, useMemo } from "react";
import TableSection from "../../common/CustomRender/TableSection";
import { DateFormatEnum, formatDate } from "../../hooks/format";
import theme from "../../scss/theme";
import {
  useApproveUnlock,
  useRejectUnlock,
} from "../../context/Api/usePostApi";
import { useToast } from "../../context/ToastContext";
import { ResponseCode } from "../../utils/response";

enum TypeColor {
  REJECTED = "REJECTED",
  APPROVED = "APPROVED",
  PENDING = "PENDING",
}

const UnlockRequestTable = () => {
  const { getUnlockRequests, refetchGetUnlockRequests } =
    useGetUnlockRequests();
  const rowData = useMemo(
    () =>
      getUnlockRequests?.list?.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [getUnlockRequests]
  );

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case TypeColor.APPROVED:
        return theme.palette.background.default;
      case TypeColor.REJECTED:
        return theme.palette.primary.light;
      case TypeColor.PENDING:
        return theme.palette.grey[700];
      default:
        return theme.palette.error.dark;
    }
  }, []);

  const { refetchApproveUnlock } = useApproveUnlock();
  const { refetchRejectUnlock } = useRejectUnlock();
  const toast = useToast();

  const handleActionUnlock = async (
    id: number,
    state: "REJECTED" | "APPROVED"
  ) => {
    let res;

    if (state === "APPROVED") {
      res = await refetchApproveUnlock({ id });
    } else {
      res = await refetchRejectUnlock({ id });
    }

    if (res?.resultCode === ResponseCode.SUCCESS) {
      toast(res.resultMessage || "");
      refetchGetUnlockRequests();
    } else {
      toast(res?.resultMessage || "", "error");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "employeeId", headerName: "Employee ID", flex: 1 },
    {
      field: "reason",
      headerName: "Lý do",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="filled"
          sx={{
            mb: 0.5,
            border: "none",
            bgcolor: getStatusColor(params.value),
          }}
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      flex: 1,
      valueFormatter: (params: number) =>
        params ? formatDate(DateFormatEnum.DD_MM_YYYY_HH_MM_SS, params) : "-",
    },
    {
      field: "approvedAt",
      headerName: "Ngày duyệt",
      flex: 1,
      valueFormatter: (params: number) =>
        params ? formatDate(DateFormatEnum.DD_MM_YYYY_HH_MM_SS, params) : "-",
    },
    {
      field: "actions",
      headerName: "Hành động",
      flex: 1,
      renderCell: (params) => {
        if (params.row.status === "PENDING") {
          return (
            <Box display="flex" pt={1.5} gap={1}>
              <Button
                size="small"
                variant="contained"
                onClick={() => handleActionUnlock(params.row.id, "APPROVED")}
              >
                Duyệt
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleActionUnlock(params.row.id, "REJECTED")}
              >
                Từ chối
              </Button>
            </Box>
          );
        }
        return <Typography variant="inherit">Has completed</Typography>;
      },
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Typography sx={{ ml: 1 }} variant="h5" fontWeight="bold" gutterBottom>
        Unlock Request Management
      </Typography>
      <TableSection
        isLoading={false}
        setRows={() => {}}
        rows={rowData}
        columns={columns}
        largeThan
        nextRowClick
      />
    </Box>
  );
};

export default memo(UnlockRequestTable);
