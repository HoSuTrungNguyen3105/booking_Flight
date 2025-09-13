import { useMemo, useState } from "react";
import { type GridColDef } from "@mui/x-data-grid";
import { useGetFlightData, useGetMeal } from "../../components/Api/useGetApi";
import { Box, Button, Typography } from "@mui/material";
import { type GridRowDef } from "../DataGrid/index";
import { DateFormatEnum, formatDateKR } from "../../hooks/format";
import FlightModalTriggerManagement from "./FlightModalTriggerManagement";
import TableSection from "./TableSection";

export default function MealList() {
  const { flightBookingData, loadingFlightBookingData } = useGetMeal();
  const { getFlightData, refetchGetFlightData, loadingFlightData } =
    useGetFlightData();

  const [selectedMealRows, setSelectedMealRows] = useState<GridRowDef[]>([]);
  const [selectedFlightRows, setSelectedFlightRows] = useState<GridRowDef[]>(
    []
  );

  const rowsFlightBookingData: GridRowDef[] = useMemo(
    () =>
      flightBookingData?.list?.map((f) => ({
        ...f,
        id: f.id,
        checkYn: false,
      })) ?? [],
    [flightBookingData]
  );

  const rowsGetFlightData: GridRowDef[] = useMemo(
    () =>
      getFlightData?.list?.map((f) => ({
        ...f,
        id: f.flightId,
        checkYn: false,
      })) ?? [],
    [getFlightData]
  );

  const columnFlightBookingData: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Tên món", flex: 1 },
    { field: "mealType", headerName: "Loại", flex: 1 },
    { field: "price", headerName: "Giá ($)", flex: 1 },
    { field: "description", headerName: "Mô tả", flex: 1.5 },
    {
      field: "flightMeals",
      headerName: "Flight Meals",
      flex: 2,
      renderCell: ({ value }) =>
        Array.isArray(value) && value.length > 0 ? (
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {value.map((fm: any) => (
              <li key={fm.id}>
                Flight {fm.flightId} - Qty: {fm.quantity} - Price: ${fm.price}
              </li>
            ))}
          </ul>
        ) : (
          "Không có chuyến bay"
        ),
    },
  ];

  const columnsFlightData: GridColDef[] = [
    { field: "flightNo", headerName: "Flight No", flex: 1 },
    {
      field: "scheduledDeparture",
      headerName: "Departure",
      flex: 2,
      valueFormatter: (params: number) =>
        params
          ? formatDateKR(DateFormatEnum.MMMM_D_YYYY_HH_MM_SS, params)
          : "-",
    },
    {
      field: "scheduledArrival",
      headerName: "Arrival",
      flex: 2,
      valueFormatter: (params: number) =>
        params
          ? formatDateKR(DateFormatEnum.MMMM_D_YYYY_HH_MM_SS, params)
          : "-",
    },
    { field: "departureAirport", headerName: "From", flex: 1 },
    { field: "arrivalAirport", headerName: "To", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "update",
      headerName: "Update",
      flex: 1,
      renderCell: (params) => {
        return (
          <FlightModalTriggerManagement
            onSuccess={() => refetchGetFlightData()}
            id={params.row.id}
          />
        );
      },
    },
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
      {/* Bảng Meal */}
      <Typography variant="h6" gutterBottom>
        Meal List
      </Typography>
      <TableSection
        rows={rowsFlightBookingData}
        columns={columnFlightBookingData}
        isLoading={loadingFlightBookingData}
        setRows={setSelectedMealRows}
        nextRowClick
        largeThan
      />

      {selectedMealRows.length > 0 && (
        <Box sx={{ my: 2, p: 2, bgcolor: "grey.100" }}>
          <Typography>Selected Meals: {selectedMealRows.length}</Typography>
          <Button
            variant="outlined"
            onClick={() => setSelectedMealRows([])}
            sx={{ mt: 1 }}
          >
            Clear Meal Selection
          </Button>
        </Box>
      )}

      {/* Flight Modal Trigger */}
      <FlightModalTriggerManagement onSuccess={() => refetchGetFlightData()} />

      {/* Bảng Flight */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Flight List
      </Typography>
      <TableSection
        columns={columnsFlightData}
        setRows={setSelectedFlightRows}
        isLoading={loadingFlightData}
        rows={rowsGetFlightData}
        nextRowClick
        largeThan
      />

      {selectedFlightRows.length > 0 && (
        <Box sx={{ my: 2, p: 2, bgcolor: "grey.100" }}>
          <Typography>Selected Flights: {selectedFlightRows.length}</Typography>
          <Button
            variant="outlined"
            onClick={() => setSelectedFlightRows([])}
            sx={{ mt: 1 }}
          >
            Clear Flight Selection
          </Button>
        </Box>
      )}
    </div>
  );
}
