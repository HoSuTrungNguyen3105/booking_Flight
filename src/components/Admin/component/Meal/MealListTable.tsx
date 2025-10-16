import { useMemo, useState, useEffect, useCallback } from "react";
import { type GridColDef, type GridRowId } from "@mui/x-data-grid";
import {
  useExportFlightExcel,
  useGetFlightData,
  useGetMeal,
} from "../../../Api/useGetApi";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { type GridRowDef } from "../../../../common/DataGrid/index";
import { DateFormatEnum, formatDateKR } from "../../../../hooks/format";
import FlightModalTriggerManagement from "../Flight/FlightModalTriggerManagement";
import TableSection from "../../../../common/CustomRender/TableSection";
// import SeatBooking from "./SeatBooking";
import SeatLayout from "../Seat/SeatLayout";
import { Download } from "@mui/icons-material";

export default function MealList() {
  const { refetchMealData, mealData, loadingMealData } = useGetMeal();
  //   const { getFlightData, refetchGetFlightData, loadingFlightData } =
  //     useGetFlightData();
  const [openModalFlightMealRows, setOpenModalFlightMealRows] =
    useState<boolean>(false);
  //   const { exportExcel, loading } = useExportFlightExcel();
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

  const rowsFlightMealData: GridRowDef[] = useMemo(
    () =>
      mealData?.list?.map((f) => ({
        ...f,
        id: f.id,
        checkYn: false,
      })) ?? [],
    [mealData]
  );

  useEffect(() => {
    setMealRows(rowsFlightMealData);
  }, [rowsFlightMealData]);

  //   useEffect(() => {
  //     setFlightRows(rowsGetFlightData);
  //   }, [rowsGetFlightData]);

  const handleDeleteMeals = useCallback((mealIds: GridRowDef[]) => {
    console.log("Deleting meals with IDs:", mealIds);
  }, []);

  const columnFlightMealData: GridColDef[] = [
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

  if (selectViewDetail) {
    return (
      <SeatLayout
        id={selectedFlightToViewInfo as number}
        onReturn={() => setSelectViewDetail(false)}
      />
    );
  }

  return (
    <div style={{ height: 500, width: "100%" }}>
      <TableSection
        columns={columnFlightMealData}
        setRows={setFlightRows}
        isLoading={loadingMealData}
        rows={rowsFlightMealData}
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
