import { useMemo, useState, useEffect } from "react";
import { type GridColDef, type GridRowId } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import { type GridRowDef } from "../../../../common/DataGrid/index";
import { DateFormatEnum, formatDate } from "../../../../hooks/format";
import FlightModalTriggerManagement from "./FlightModalTriggerManagement";
import TableSection from "../../../../common/AdditionalCustomFC/TableSection";
import { Download } from "@mui/icons-material";
import FlightWithSeatLayout from "./components/FlightWithSeatLayout";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import FlightStatus from "./FlightStatus";
import { useToast } from "../../../../context/ToastContext";
import { ResponseCode } from "../../../../utils/response";
import {
  useDeleteManyFlightIds,
  useExportFlightExcel,
  useGetFlightData,
} from "../../../../context/Api/FlightApi";

export default function FlightList() {
  const { getFlightData, refetchGetFlightData, loadingFlightData } =
    useGetFlightData();
  const { exportExcel, loading } = useExportFlightExcel();

  const [flightRows, setFlightRows] = useState<GridRowDef[]>([]);

  const [selectedFlightToViewInfo, setSelectedFlightToViewInfo] = useState<
    number | null
  >(null);
  const toast = useToast();
  const [selectViewDetail, setSelectViewDetail] = useState<boolean>(false);
  const [selectUpdateFlightStatus, setSelectUpdateFlightStatus] =
    useState<boolean>(false);
  const { refetchDeleteManyFlightIds } = useDeleteManyFlightIds();
  const [selectedFlightIds, setSelectedFlightIds] = useState<number[]>([]);

  const handleFlightRowSelection = (selectedIds: GridRowId[]) => {
    const selectedRows = flightRows.filter((row) =>
      selectedIds.includes(row.id)
    );
    const ids = selectedRows.map((row) => row.flightId); // hoặc row.id
    setSelectedFlightIds(ids);
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

  const handleDeleteIds = async (selectedIds: GridRowId[]) => {
    if (!selectedIds || selectedIds.length === 0) {
      toast("Chưa chọn chuyến bay nào", "info");
      return;
    }

    const ids = selectedIds.map((id) => Number(id)).filter((id) => !isNaN(id));

    if (ids.length === 0) {
      toast("Không có chuyến bay hợp lệ", "info");
      return;
    }

    const res = await refetchDeleteManyFlightIds(ids);

    if (res?.resultCode === ResponseCode.SUCCESS) {
      toast(res.resultMessage);
    } else {
      toast(res?.resultMessage || "Error", "error");
    }
  };

  useEffect(() => {
    setFlightRows(rowsGetFlightData);
  }, [rowsGetFlightData]);

  const columnsFlightData: GridColDef[] = [
    { field: "flightNo", headerName: "Flight No", flex: 1 },
    {
      field: "scheduledDeparture",
      headerName: "Departure",
      flex: 1,
      valueFormatter: (params: string) =>
        params
          ? formatDate(DateFormatEnum.MMMM_D_YYYY_HH_MM_SS, Number(params))
          : "-",
    },
    {
      field: "scheduledArrival",
      headerName: "Arrival",
      flex: 1,
      valueFormatter: (params: string) =>
        params
          ? formatDate(DateFormatEnum.MMMM_D_YYYY_HH_MM_SS, Number(params))
          : "-",
    },
    { field: "departureAirport", headerName: "From", flex: 0.5 },
    { field: "arrivalAirport", headerName: "To", flex: 0.5 },
    { field: "flightType", headerName: "Type", flex: 0.5 },
    {
      field: "seat",
      headerName: "seat",
      flex: 0.5,
      renderCell: (params: GridRenderCellParams) => params.row._count.seats,
    },
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

        {selectedFlightIds.length > 0 && (
          <Button
            variant="contained"
            onClick={() => handleDeleteIds(selectedFlightIds)}
            disabled={loading}
            startIcon={<Download />}
          >
            Delete Flights
          </Button>
        )}

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
