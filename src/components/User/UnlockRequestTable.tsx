import { Chip, Box, Button, Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useGetUnlockRequests } from "../Api/useGetApi";
import { useCallback, useMemo } from "react";
import TableSection from "../../common/CustomRender/TableSection";
import { DateFormatEnum, formatDate } from "../../hooks/format";

enum TypeColor {
  REJECTED = "REJECTED",
  APPROVED = "APPROVED",
  PENDING = "PENDING",
}

const UnlockRequestTable = () => {
  const { getUnlockRequests } = useGetUnlockRequests();
  // const [unlockRows, setUnlockRows] = useState<GridRowDef[]>([]);

  const rowData = useMemo(
    () =>
      getUnlockRequests?.list?.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [getUnlockRequests]
  );

  console.log("rowData", rowData);

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

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
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

export default UnlockRequestTable;
