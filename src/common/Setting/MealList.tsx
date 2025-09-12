import { useMemo } from "react";
import { type GridColDef } from "@mui/x-data-grid";
import { useGetFlightData, useGetMeal } from "../../components/Api/useGetApi";
import { Button, Typography } from "@mui/material";
import DateRangePickerComponent from "../DayPicker/date-range-picker";
import DataTable, { type GridRowDef } from "../DataGrid/index";
import { DateFormatEnum, formatDateKR } from "../../hooks/format";
import FlightModalTriggerManagement from "./FlightModalTriggerManagement";

export default function MealList() {
  const { flightBookingData } = useGetMeal();
  const { getFlightData, refetchGetFlightData } = useGetFlightData();

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
      field: "meals",
      headerName: "Meals",
      flex: 1,
      renderCell: (params) => {
        const meals = (params.value as { id: number }[] | undefined) ?? [];
        return <Button>{meals.length > 0 ? "Info Meals" : "No meals"}</Button>;
      },
    },
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
      <DataTable
        rows={rowsFlightBookingData}
        columns={columnFlightBookingData}
      />
      {
        <FlightModalTriggerManagement
          onSuccess={() => refetchGetFlightData()}
        />
      }
      {/* <DateRangePickerComponent language="kr" /> */}
      <Typography>Flight list</Typography>
      <DataTable columns={columnsFlightData} rows={rowsGetFlightData} />
      {/* <pre
        style={{ background: "#f5f5f5", padding: "10px", borderRadius: "8px" }}
      >
        {JSON.stringify(getFlightData, null, 2)}
      </pre> */}
    </div>
  );
}
