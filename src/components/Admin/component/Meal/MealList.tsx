import { useMemo, useState } from "react";
import { type GridColDef, type GridRowId } from "@mui/x-data-grid";
import { useGetMeal } from "../../../Api/useGetApi";
import { Box, Button, Typography } from "@mui/material";
import { type GridRowDef } from "../../../../common/DataGrid/index";
import TableSection from "../../../../common/CustomRender/TableSection";
import { Download } from "@mui/icons-material";
import { useAuth } from "../../../../context/AuthContext";
import { UserRole } from "../../../../utils/type";
import BulkMealCreator from "./BulkMealCreator";

export default function MealList() {
  const { refetchMealData, mealData, loadingMealData } = useGetMeal();

  const { user } = useAuth();

  const [selectedFlightRows, setSelectedFlightRows] = useState<GridRowDef[]>(
    []
  );

  const [flightRows, setFlightRows] = useState<GridRowDef[]>([]);

  const [createBulkMeal, setCreateBulkMeal] = useState<boolean>(false);

  const handleFlightRowSelection = (selectedIds: GridRowId[]) => {
    const newSelectedRows = flightRows.filter((row) =>
      selectedIds.includes(row.id)
    );
    setSelectedFlightRows(newSelectedRows);
  };

  const rowsFlightMealData: GridRowDef[] = useMemo(
    () =>
      mealData?.list?.map((f) => ({
        ...f,
        id: f.id,
        checkYn: false,
      })) ?? [],
    [mealData]
  );

  const columnFlightMealData: GridColDef[] = [
    { field: "mealCode", headerName: "Meal Code", flex: 1 },
    { field: "name", headerName: "Tên món", flex: 1 },
    { field: "mealType", headerName: "Loại", flex: 1 },
    { field: "price", headerName: "Giá ($)", flex: 1 },
    { field: "description", headerName: "Mô tả", flex: 1.5 },
  ];

  if (createBulkMeal) {
    return (
      <BulkMealCreator
        onSuccess={() => {
          setCreateBulkMeal(false);
          refetchMealData();
        }}
      />
    );
  }

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Meal List
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "start", gap: 1 }}>
        <Button
          variant="contained"
          onClick={() => setCreateBulkMeal(true)}
          disabled={user?.role === UserRole.USER}
          startIcon={<Download />}
        >
          Create Multi meal
        </Button>
      </Box>

      <TableSection
        columns={columnFlightMealData}
        setRows={setFlightRows}
        isLoading={loadingMealData}
        rows={rowsFlightMealData}
        onSelectedRowIdsChange={handleFlightRowSelection}
        nextRowClick
        largeThan
      />

      {selectedFlightRows.length > 0 && (
        <Box sx={{ my: 2, p: 2, bgcolor: "grey.100" }}>
          <Typography>Selected Flights: {selectedFlightRows.length}</Typography>
          <ul>
            {selectedFlightRows.map((row) => (
              <li key={row.id}>{row.flightNo || row.id}</li>
            ))}
          </ul>
          <Button
            variant="outlined"
            onClick={() => setSelectedFlightRows([])}
            sx={{ mt: 1 }}
          >
            Clear Flight Selection
          </Button>
        </Box>
      )}
    </Box>
  );
}
