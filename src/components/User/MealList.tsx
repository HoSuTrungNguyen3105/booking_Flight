import { useMemo, useState, useEffect, useCallback } from "react";
import { type GridColDef, type GridRowId } from "@mui/x-data-grid";
import { useGetFlightData, useGetMeal } from "../Api/useGetApi";
import { Box, Button, Typography } from "@mui/material";
import { type GridRowDef } from "../../common/DataGrid/index";
import { DateFormatEnum, formatDateKR } from "../../hooks/format";
import FlightModalTriggerManagement from "../../common/Setting/FlightModalTriggerManagement";
import TableSection from "../../common/Setting/TableSection";
import SeatBooking from "./SeatBooking";
import SeatLayout from "../Admin/component/SeatLayout";
import MealFlightRelation from "./Security/MealFlightRelation";

export default function MealList() {
  const { flightBookingData, loadingFlightBookingData } = useGetMeal();
  const { getFlightData, refetchGetFlightData, loadingFlightData } =
    useGetFlightData();
  const [openModalFlightMealRows, setOpenModalFlightMealRows] =
    useState<boolean>(false);

  const [selectedMealRows, setSelectedMealRows] = useState<GridRowDef[]>([]);
  const [selectedFlightRows, setSelectedFlightRows] = useState<GridRowDef[]>(
    []
  );
  const [mealRows, setMealRows] = useState<GridRowDef[]>([]);
  const [flightRows, setFlightRows] = useState<GridRowDef[]>([]);

  const [selectedFlightForSeat, setSelectedFlightForSeat] = useState<
    number | null
  >(null);

  const [selectedFlightToViewInfo, setSelectedFlightToViewInfo] = useState<
    number | null
  >(null);

  const [selectViewDetail, setSelectViewDetail] = useState<boolean>(false);
  const [selectMealRowId, setSelectMealRowId] = useState<number>(0);
  const handleMealFlightClickButton = (id: number) => {
    console.log("id", id);
    setSelectMealRowId(id);
    setOpenModalFlightMealRows(true);
  };

  const handleMealRowSelection = (selectedIds: GridRowId[]) => {
    const newSelectedRows = mealRows.filter((row) =>
      selectedIds.includes(row.id)
    );
    setSelectedMealRows(newSelectedRows);
  };

  const handleFlightRowSelection = (selectedIds: GridRowId[]) => {
    const newSelectedRows = flightRows.filter((row) =>
      selectedIds.includes(row.id)
    );
    setSelectedFlightRows(newSelectedRows);
  };

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
        id: f.flightId as number,
        checkYn: false,
      })) ?? [],
    [getFlightData]
  );

  useEffect(() => {
    setMealRows(rowsFlightBookingData);
  }, [rowsFlightBookingData]);

  useEffect(() => {
    setFlightRows(rowsGetFlightData);
  }, [rowsGetFlightData]);

  const handleDeleteMeals = useCallback((mealIds: GridRowDef[]) => {
    console.log("Deleting meals with IDs:", mealIds);
  }, []);

  const columnFlightBookingData: GridColDef[] = [
    { field: "mealCode", headerName: "Meal Code", flex: 1 },
    { field: "name", headerName: "Tên món", flex: 1 },
    { field: "mealType", headerName: "Loại", flex: 1 },
    { field: "price", headerName: "Giá ($)", flex: 1 },
    { field: "description", headerName: "Mô tả", flex: 1.5 },
    {
      field: "flightMeals",
      headerName: "Flight Meals",
      flex: 2,
      renderCell: (params) =>
        Array.isArray(params.value) && params.value.length > 0 ? (
          <Button
            onClick={() => {
              const flightMealId = params.row.flightMeals[0].id;
              handleMealFlightClickButton(flightMealId);
              setOpenModalFlightMealRows(true);
            }}
          >
            Xem chi tiết
          </Button>
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
      renderCell: (params) => (
        <FlightModalTriggerManagement
          onSuccess={() => refetchGetFlightData()}
          id={params.row.id}
        />
      ),
    },
    {
      field: "info",
      headerName: "Detail",
      flex: 1,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setSelectViewDetail(true);
            setSelectedFlightToViewInfo(params.row.id);
          }}
        >
          Detail
        </Button>
      ),
    },
    {
      field: "seatOption",
      headerName: "Seat",
      flex: 1,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => setSelectedFlightForSeat(params.row.id)}
        >
          Manage Seats
        </Button>
      ),
    },
  ];

  if (selectViewDetail) {
    return (
      <SeatLayout
        id={selectedFlightToViewInfo as number}
        onReturn={() => setSelectViewDetail(false)}
      />
    );
  }

  if (selectedFlightForSeat) {
    return (
      <SeatBooking
        flightId={selectedFlightForSeat}
        onSuccess={() => refetchGetFlightData()}
        // seats={selectedFlightForSeat ?? []} // tùy vào API có trả seats hay không
        loadingFlightData={loadingFlightData}
      />
    );
  }

  return (
    <div style={{ height: 500, width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Meal List
      </Typography>

      <TableSection
        rows={mealRows}
        columns={columnFlightBookingData}
        isLoading={loadingFlightBookingData}
        setRows={setMealRows}
        onSelectedRowIdsChange={handleMealRowSelection}
        nextRowClick
        largeThan
      />

      <MealFlightRelation
        flightMealId={selectMealRowId}
        open={openModalFlightMealRows}
        onClose={() => {}}
        onSuccess={() => {}}
      />

      {selectedMealRows.length > 0 && (
        <Box sx={{ my: 2, p: 2, bgcolor: "grey.100" }}>
          <Typography>Selected Meals: {selectedMealRows.length}</Typography>
          <ul>
            {selectedMealRows.map((row) => (
              <li key={row.id}>{row.name || row.id}</li>
            ))}
          </ul>
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedMealRows([]);
              setMealRows([]);
            }}
            sx={{ mt: 1 }}
          >
            Clear Meal Selection
          </Button>
          <Button
            variant="contained"
            onClick={() => handleDeleteMeals(selectedMealRows)}
            sx={{ mt: 1 }}
          >
            Delete Meal
          </Button>
        </Box>
      )}

      <FlightModalTriggerManagement onSuccess={() => refetchGetFlightData()} />

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Flight List
      </Typography>

      <TableSection
        columns={columnsFlightData}
        setRows={setFlightRows}
        isLoading={loadingFlightData}
        rows={flightRows}
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
    </div>
  );
}
