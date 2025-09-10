import { Chip, Box, Button, Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import TableData from "../DataGrid/index";
import { useGetUnlockRequests } from "../../components/Api/useGetApi";
import { useCallback, useMemo } from "react";
import SingleDateRangePickerComponent from "../DayPicker/date-range-field";
import { useToast } from "../../context/ToastContext";

enum TypeColor {
  REJECTED = "REJECTED",
  APPROVED = "APPROVED",
  PENDING = "PENDING",
}

const UnlockRequestTable = () => {
  const { getUnlockRequests } = useGetUnlockRequests();

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
        return "#567B7A";
      case TypeColor.REJECTED:
        return "#B46674";
      case TypeColor.PENDING:
        return "#FFF4CC";
      default:
        return "default";
    }
  }, []);
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "userId", headerName: "User ID", width: 100 },
    {
      field: "reason",
      headerName: "Lý do",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          sx={{
            border: "none",
            color: getStatusColor(params.value),
          }}
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      width: 200,
      valueFormatter: (params) => new Date(Number(params)).toLocaleString(),
    },
    {
      field: "approvedAt",
      headerName: "Ngày duyệt",
      width: 200,
      valueFormatter: (params) =>
        params ? new Date(Number(params)).toLocaleString() : "-",
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 180,
      sortable: false,
      renderCell: (params) => {
        if (params.row.status === "PENDING") {
          return (
            <Box display="flex" pt={1.5} gap={1}>
              <Button
                size="small"
                variant="contained"
                onClick={() => console.log("Duyệt", params.row.id)}
              >
                Duyệt
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => console.log("Từ chối", params.row.id)}
              >
                Từ chối
              </Button>
            </Box>
          );
        }
        return null;
      },
    },
  ];

  const toast = useToast();

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Unlock Request
      </Typography>
      <TableData rows={rowData} columns={columns} />

      <SingleDateRangePickerComponent
        language="vn"
        sx={{ mb: 2 }}
        value={[1745388800.078, 1704067199.999]}
        onChange={(dateRange) => {
          toast(String(dateRange[1]), "info");
          toast(String(dateRange[0]), "info");
        }}
      />
    </Box>
  );
};

export default UnlockRequestTable;
