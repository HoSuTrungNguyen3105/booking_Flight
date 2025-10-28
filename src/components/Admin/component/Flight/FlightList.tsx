import { useMemo, useState, useEffect } from "react";
import { type GridColDef, type GridRowId } from "@mui/x-data-grid";
import {
  useExportFlightExcel,
  useGetFlightData,
} from "../../../../context/Api/useGetApi";
import { Box, Button, Typography } from "@mui/material";
import { type GridRowDef } from "../../../../common/DataGrid/index";
import { DateFormatEnum, formatDate } from "../../../../hooks/format";
import FlightModalTriggerManagement from "./FlightModalTriggerManagement";
import TableSection from "../../../../common/CustomRender/TableSection";
import { Download } from "@mui/icons-material";
// import FlightStatus from "./FlightStatus";
import FlightWithSeatLayout from "./FlightWithSeatLayout";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import FlightStatus from "./FlightStatus";

export default function FlightList() {
  const { getFlightData, refetchGetFlightData, loadingFlightData } =
    useGetFlightData();
  const { exportExcel, loading } = useExportFlightExcel();

  const [flightRows, setFlightRows] = useState<GridRowDef[]>([]);

  const [selectedFlightToViewInfo, setSelectedFlightToViewInfo] = useState<
    number | null
  >(null);

  const [selectViewDetail, setSelectViewDetail] = useState<boolean>(false);
  const [selectUpdateFlightStatus, setSelectUpdateFlightStatus] =
    useState<boolean>(false);

  const handleFlightRowSelection = (selectedIds: GridRowId[]) => {
    flightRows.filter((row) => selectedIds.includes(row.id));
  };

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
      flex: 1,
      valueFormatter: (params: number) =>
        params ? formatDate(DateFormatEnum.MMMM_D_YYYY_HH_MM_SS, params) : "-",
    },
    {
      field: "scheduledArrival",
      headerName: "Arrival",
      flex: 1,
      valueFormatter: (params: number) =>
        params ? formatDate(DateFormatEnum.MMMM_D_YYYY_HH_MM_SS, params) : "-",
    },
    { field: "departureAirport", headerName: "From", flex: 0.5 },
    { field: "arrivalAirport", headerName: "To", flex: 0.5 },
    { field: "status", headerName: "Status", flex: 0.5 },
    {
      field: "update",
      headerName: "Update",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Box mt={1} display={"flex"} justifyContent={"space-around"} gap={1}>
          <FlightModalTriggerManagement
            onSuccess={() => refetchGetFlightData()}
            id={params.row.id}
          />
          <Button
            size="large"
            variant="outlined"
            onClick={() => {
              setSelectViewDetail(true);
              setSelectedFlightToViewInfo(params.row.id);
            }}
          >
            Detail
          </Button>
        </Box>
      ),
    },
  ];

  if (selectViewDetail) {
    return (
      <FlightWithSeatLayout
        id={selectedFlightToViewInfo as number}
        onReturn={() => setSelectViewDetail(false)}
      />
    );
  }

  if (selectUpdateFlightStatus) {
    return <FlightStatus onReturn={() => setSelectUpdateFlightStatus(false)} />;
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

        <Button
          variant="contained"
          onClick={() => setSelectUpdateFlightStatus(true)}
          disabled={loading}
          startIcon={<Download />}
        >
          Update FlightStatus
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
    </>
  );
}
