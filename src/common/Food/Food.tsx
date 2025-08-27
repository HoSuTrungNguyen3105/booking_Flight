import { Box, Typography } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import type { FlightMeal } from "../../utils/type";
import { useFlightMeals } from "../../components/Api/useGetApi";
import DataTable from "../DataGrid/index.tsx";

const Food = () => {
  const { fetchFlightMeals, refetchFlightMeals } = useFlightMeals();
  const [rows, setRows] = useState<FlightMeal[]>([]);

  useEffect(() => {
    refetchFlightMeals();
  }, []);

  useEffect(() => {
    if (fetchFlightMeals?.list) {
      setRows(fetchFlightMeals.list);
    }
  }, [fetchFlightMeals]);

  const flightMealCols: GridColDef<FlightMeal>[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "flightId", headerName: "Flight ID", width: 100 },
    { field: "mealId", headerName: "Meal ID", width: 100 },
    { field: "quantity", headerName: "Số lượng", width: 120 },
    { field: "price", headerName: "Giá ($)", width: 120 },
  ];

  const flightCols: GridColDef[] = [
    { field: "flightId", headerName: "Flight ID", width: 100 },
    { field: "flightNo", headerName: "Số hiệu", width: 120 },
    {
      field: "scheduledDeparture",
      headerName: "Khởi hành",
      width: 200,
      valueFormatter: (p) => new Date(p).toLocaleString(),
    },
    {
      field: "scheduledArrival",
      headerName: "Hạ cánh",
      width: 200,
      valueFormatter: (p) => new Date(p).toLocaleString(),
    },
    { field: "departureAirport", headerName: "Sân đi", width: 120 },
    { field: "arrivalAirport", headerName: "Sân đến", width: 120 },
    { field: "status", headerName: "Trạng thái", width: 120 },
    { field: "aircraftCode", headerName: "Máy bay", width: 120 },
  ];

  // ==== Bảng 3: Meal Info ====
  const mealCols: GridColDef[] = [
    { field: "id", headerName: "Meal ID", width: 100 },
    { field: "name", headerName: "Tên món", flex: 1 },
    { field: "mealType", headerName: "Loại", width: 120 },
    { field: "description", headerName: "Mô tả", flex: 1 },
    { field: "price", headerName: "Giá ($)", width: 120 },
    { field: "isAvailable", headerName: "Có sẵn", width: 120 },
  ];

  return (
    <Box p={2} display="flex" flexDirection="column" gap={4}>
      <Box>
        <Typography variant="h6" mb={1}>
          Flight Meals
        </Typography>
        <DataTable
          rows={rows}
          columns={flightMealCols}
          checkboxSelection
          loading={false}
        />
      </Box>

      <Box>
        <Typography variant="h6" mb={1}>
          Flight Info
        </Typography>
        <DataTable
          rows={rows.map((r) => ({
            ...r.flight,
            id: r.flight.flightId, // Thêm id cho DataGrid
          }))}
          columns={flightCols}
          checkboxSelection
        />
      </Box>

      <Box>
        <Typography variant="h6" mb={1}>
          Meal Info
        </Typography>
        <DataTable
          checkboxSelection
          selectedRows={[]}
          rows={rows.map((r) => r.meal)}
          columns={mealCols}
        />
      </Box>
    </Box>
  );
};

export default Food;
