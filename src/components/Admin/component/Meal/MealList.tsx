import { useMemo, useState } from "react";
import { type GridColDef, type GridRowId } from "@mui/x-data-grid";
import { useGetMeal } from "../../../../context/Api/useGetApi";
import { Box, Button } from "@mui/material";
import { type GridRowDef } from "../../../../common/DataGrid/index";
import TableSection from "../../../../common/CustomRender/TableSection";
import { AddBoxOutlined} from "@mui/icons-material";
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
        onClose={() => {
          setCreateBulkMeal(false);
        }}
        onSuccess={() => {
          setCreateBulkMeal(false);
          refetchMealData();
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* <Stack direction="row" alignItems="center" spacing={1}>
        <Fastfood color="primary" />
        <Typography variant="h6" fontWeight={600}>
          Meal List
        </Typography>
      </Stack> */}

      <Button
        variant="contained"
        startIcon={<AddBoxOutlined />}
        onClick={() => setCreateBulkMeal(true)}
        disabled={user?.role === UserRole.USER}
        sx={{
          // borderRadius: 2,
          width: "15rem",
          textTransform: "none",
          px: 2.5,
          py: 1,
          mt: 2,
        }}
      >
        Create Multi Meal
      </Button>

      <TableSection
        columns={columnFlightMealData}
        setRows={setFlightRows}
        isLoading={loadingMealData}
        rows={rowsFlightMealData}
        onSelectedRowIdsChange={handleFlightRowSelection}
        nextRowClick
        largeThan
      />
    </Box>
  );
}
