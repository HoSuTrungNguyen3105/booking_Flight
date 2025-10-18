import { useMemo, useState, useEffect } from "react";
import { type GridColDef, type GridRowId } from "@mui/x-data-grid";
import { useExportFlightExcel, useGetFlightData } from "../../../Api/useGetApi";
import { Box, Button, Typography } from "@mui/material";
import { type GridRowDef } from "../../../../common/DataGrid/index";
import { DateFormatEnum, formatDateKR } from "../../../../hooks/format";
import FlightModalTriggerManagement from "./FlightModalTriggerManagement";
import TableSection from "../../../../common/CustomRender/TableSection";
// import SeatBooking from "./SeatBooking";
import SeatLayout from "../Seat/SeatLayout";
import { Download } from "@mui/icons-material";

export default function FlightList() {
  // const { flightBookingData, loadingFlightBookingData } = useGetMeal();
  const { getFlightData, refetchGetFlightData, loadingFlightData } =
    useGetFlightData();
  // const [openModalFlightMealRows, setOpenModalFlightMealRows] =
  //   useState<boolean>(false);
  const { exportExcel, loading } = useExportFlightExcel();
  // const [selectedMealRows, setSelectedMealRows] = useState<GridRowDef[]>([]);
  const [selectedFlightRows, setSelectedFlightRows] = useState<GridRowDef[]>(
    []
  );
  // const [mealRows, setMealRows] = useState<GridRowDef[]>([]);
  const [flightRows, setFlightRows] = useState<GridRowDef[]>([]);

  // const [selectedFlightForSeat, setSelectedFlightForSeat] = useState<
  //   number | null
  // >(null);

  const [selectedFlightToViewInfo, setSelectedFlightToViewInfo] = useState<
    number | null
  >(null);

  const [selectViewDetail, setSelectViewDetail] = useState<boolean>(false);
  // const [selectMealRowId, setSelectMealRowId] = useState<number>(0);
  // const handleMealFlightClickButton = (id: number) => {
  //   console.log("id", id);
  //   setSelectMealRowId(id);
  //   setOpenModalFlightMealRows(true);
  // };

  // const handleMealRowSelection = (selectedIds: GridRowId[]) => {
  //   const newSelectedRows = mealRows.filter((row) =>
  //     selectedIds.includes(row.id)
  //   );
  //   setSelectedMealRows(newSelectedRows);
  // };

  const handleFlightRowSelection = (selectedIds: GridRowId[]) => {
    const newSelectedRows = flightRows.filter((row) =>
      selectedIds.includes(row.id)
    );
    setSelectedFlightRows(newSelectedRows);
  };

  // const rowsFlightBookingData: GridRowDef[] = useMemo(
  //   () =>
  //     flightBookingData?.list?.map((f) => ({
  //       ...f,
  //       id: f.id,
  //       checkYn: false,
  //     })) ?? [],
  //   [flightBookingData]
  // );

  const rowsGetFlightData: GridRowDef[] = useMemo(
    () =>
      getFlightData?.list?.map((f) => ({
        ...f,
        id: f.flightId as number,
        checkYn: false,
      })) ?? [],
    [getFlightData]
  );

  // useEffect(() => {
  //   setMealRows(rowsFlightBookingData);
  // }, [rowsFlightBookingData]);

  useEffect(() => {
    setFlightRows(rowsGetFlightData);
  }, [rowsGetFlightData]);

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
    // {
    //   field: "seatOption",
    //   headerName: "Seat",
    //   flex: 1,
    //   renderCell: (params) => (
    //     <Button
    //       size="small"
    //       variant="outlined"
    //       onClick={() => setSelectedFlightForSeat(params.row.id)}
    //     >
    //       Manage Seats
    //     </Button>
    //   ),
    // },
  ];

  if (selectViewDetail) {
    return (
      <SeatLayout
        id={selectedFlightToViewInfo as number}
        onReturn={() => setSelectViewDetail(false)}
      />
    );
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Flight List
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "start", gap: 1 }}>
        <Button
          variant="contained"
          onClick={exportExcel}
          disabled={loading}
          startIcon={<Download />}
        >
          Export Excel
        </Button>

        <FlightModalTriggerManagement
          onSuccess={() => refetchGetFlightData()}
        />
      </Box>

      <TableSection
        columns={columnsFlightData}
        setRows={setFlightRows}
        isLoading={loadingFlightData}
        rows={flightRows}
        onSelectedRowIdsChange={handleFlightRowSelection}
        nextRowClick
        largeThan
      />

      {/* {selectedFlightRows.length > 0 && (
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
      )} */}
    </>
  );
}
