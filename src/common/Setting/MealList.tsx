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

  const [rows, setRows] = useState<GridRowDef[]>([]);

  const handleSetRows = (newRows: React.SetStateAction<GridRowDef[]>) => {
    setRows(newRows);
  };

  const rowsFlightBookingData: GridRowDef[] = useMemo(
    () =>
      flightBookingData?.list?.map((f) => ({
        ...f,
        id: f.id,
      })) ?? [],
    [flightBookingData]
  );

  const rowsGetFlightData: GridRowDef[] = useMemo(
    () =>
      getFlightData?.list?.map((f) => ({
        ...f,
        id: f.flightId,
      })) ?? [],
    [flightBookingData]
  );

  const columnFlightBookingData: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Tên món", flex: 1 },
    { field: "mealType", headerName: "Loại", width: 130 },
    { field: "price", headerName: "Giá ($)", width: 120, type: "number" },
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
          <>
            {
              <FlightModalTriggerManagement
                onSuccess={() => refetchGetFlightData()}
                id={params.row.id}
              />
            }
          </>
        );
      },
    },
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
      <TableSection
        rows={rowsFlightBookingData}
        columns={columnFlightBookingData}
        isLoading={loadingFlightBookingData}
        setRows={setRows}
        nextRowClick
        largeThan
      />
      {
        <FlightModalTriggerManagement
          onSuccess={() => refetchGetFlightData()}
        />
      }
      <Typography>Flight list</Typography>
      {rows && rows.length > 0 && (
        <Box>
          <Typography>Selected Rows: {rows.length}</Typography>
          <Button onClick={() => handleSetRows([])}>Clear Selection</Button>
        </Box>
      )}
      <TableSection
        columns={columnsFlightData}
        setRows={setRows}
        isLoading={loadingFlightData}
        rows={rowsGetFlightData}
        nextRowClick
        largeThan
      />
    </div>
  );
}
