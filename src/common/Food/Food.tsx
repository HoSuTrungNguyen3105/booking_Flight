import { Box, Typography } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import type { FlightMeal, Seat } from "../../utils/type";
import { useFlightMeals } from "../../components/Api/useGetApi";
import DataTable from "../DataGrid/index.tsx";
import SeatManager, { type SeatType } from "../Input/SeatManager.tsx";

const Food = () => {
  const { fetchFlightMeals } = useFlightMeals();
  const [rows, setRows] = useState<FlightMeal[]>([]);

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

  const flightList = [
    { id: 1, flightNo: "VN123" },
    { id: 2, flightNo: "VN456" },
    { id: 3, flightNo: "VN789" },
  ];

  const seatData: Record<number, Seat[]> = {
    1: [
      { id: 1, seatRow: "A", seatNumber: 1, isBooked: false, type: "ECONOMY" },
      { id: 2, seatRow: "A", seatNumber: 2, isBooked: true, type: "ECONOMY" },
      { id: 3, seatRow: "B", seatNumber: 1, isBooked: false, type: "BUSINESS" },
      { id: 4, seatRow: "B", seatNumber: 2, isBooked: true, type: "BUSINESS" },
    ],
    2: [
      { id: 5, seatRow: "A", seatNumber: 1, isBooked: false, type: "ECONOMY" },
      { id: 6, seatRow: "A", seatNumber: 2, isBooked: false, type: "ECONOMY" },
      { id: 7, seatRow: "B", seatNumber: 1, isBooked: true, type: "FIRST" },
    ],
    3: [
      { id: 8, seatRow: "C", seatNumber: 1, isBooked: false, type: "ECONOMY" },
      { id: 9, seatRow: "C", seatNumber: 2, isBooked: false, type: "ECONOMY" },
      { id: 10, seatRow: "C", seatNumber: 3, isBooked: false, type: "ECONOMY" },
    ],
  };
  // fetchSeats giả lập lấy ghế theo flightId
  const fetchSeats = async (flightId: number): Promise<Seat[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(seatData[flightId] || []), 300);
    });
  };

  // addSeat giả lập thêm ghế mới
  const addSeat = async (
    flightId: number,
    seatRow: string,
    seatNumber: number,
    type: SeatType
  ) => {
    const newSeat: Seat = {
      id: Math.floor(Math.random() * 1000),
      seatRow,
      seatNumber,
      type,
      isBooked: false,
    };
    if (!seatData[flightId]) seatData[flightId] = [];
    seatData[flightId].push(newSeat);
  };

  return (
    <Box p={2} display="flex" flexDirection="column" gap={4}>
      {/* <SeatManager
        flightList={flightList}
        fetchSeats={fetchSeats}
        addSeat={addSeat}
      /> */}

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
            id: r.flight.flightId,
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
