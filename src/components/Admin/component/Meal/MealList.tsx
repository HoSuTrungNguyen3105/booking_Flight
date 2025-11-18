import { useMemo, useState } from "react";
import { type GridColDef, type GridRowId } from "@mui/x-data-grid";
import { useGetMeal } from "../../../../context/Api/useGetApi";
import { Box, Button } from "@mui/material";
import { type GridRowDef } from "../../../../common/DataGrid/index";
import TableSection from "../../../../common/AdditionalCustomFC/TableSection";
import { AddBoxOutlined } from "@mui/icons-material";
import { useAuth } from "../../../../context/AuthContext";
import { UserRole } from "../../../../utils/type";
import BulkMealCreator from "./BulkMealCreator";
import { useLocation } from "react-router-dom";

export default function MealList() {
  const { refetchMealData, mealData, loadingMealData } = useGetMeal();
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const flightId = searchParams.get("flightId") || "";
  const hotelId = searchParams.get("hotelId") || "";
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

  const getMealImage = (meal: Meal) => {
    const key = meal.name.toLowerCase();
    if (key.includes("chicken")) return mealImages.chicken;
    if (key.includes("pasta") || key.includes("vegetarian"))
      return mealImages.pasta;
    if (key.includes("salmon") || key.includes("fish"))
      return mealImages.salmon;
    return chickenMealImage;
  };

  const handleContinue = () => {
    const params = new URLSearchParams({
      flightId,
      passengers: passengers.toString(),
      departureDate,
    });
    if (hotelId) params.append("hotelId", hotelId);
    if (selectedMeals.length > 0)
      params.append("mealIds", selectedMeals.join(","));

    setLocation(`/review?${params.toString()}`);
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
