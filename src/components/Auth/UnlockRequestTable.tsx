import { Chip, Box, Button, Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import TableData, { type GridRowDef } from "../../common/DataGrid/index";
import { useGetUnlockRequests } from "../Api/useGetApi";
import { useCallback, useMemo, useState } from "react";
import TableSection from "../../common/CustomRender/TableSection";

enum TypeColor {
  REJECTED = "REJECTED",
  APPROVED = "APPROVED",
  PENDING = "PENDING",
}

const UnlockRequestTable = () => {
  const { getUnlockRequests } = useGetUnlockRequests();
  const [unlockRows, setUnlockRows] = useState<GridRowDef[]>([]);

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

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Unlock Request
      </Typography>
      <TableSection
        isLoading={false}
        setRows={setUnlockRows}
        rows={rowData}
        columns={columns}
        largeThan
        nextRowClick
      />
    </Box>
  );
};

export default UnlockRequestTable;
