import React, { useCallback, useEffect, useState } from "react";
import { useFlightList } from "../Api/useGetApi";
import type { GridColDef } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import DataTable from "../../common/DataGrid/index";
import theme from "../../scss/theme";
import type { Flight } from "../../common/Setting/type";
import SelectDropdown from "../../common/Dropdown/SelectDropdown";
import type { DataFlight } from "../../utils/type";

const Setting_flight = () => {
  const [rows, setRows] = useState<DataFlight[]>([]);
  const { fetchFlightList } = useFlightList();

  // useEffect(() => {
  //   if (fetchFlightList?.list) {
  //     setRows(fetchFlightList.list);
  //   }
  // }, [fetchFlightList]);

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
    {
      field: "actions",
      headerName: "설정",
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        //   row.id !== user?.id && (
        <SelectDropdown
          key={row.id}
          defaultValue="관리"
          value="관리"
          onChange={(value) => handleSelectAction(row, value as ActionType)}
          sx={{
            width: "20px",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
          options={[
            { label: "정보 수정", value: "addUser" },
            { label: "잠금/해금", value: "lock_unlockAccount" },
            {
              label: "삭제",
              value: "deleteUser",
              color: theme.palette.error.main,
            },
          ]}
        />
      ),
    },
  ];

  const [selectedRow, setSelectedRow] = useState<Flight | null>(null);
  type ActionType = "food" | "passenger" | "delete";

  const [openModal, setOpenModal] = useState<{ [key in ActionType]: boolean }>({
    food: false,
    passenger: false,
    delete: false,
  });
  const toggleOpenModal = useCallback((action: ActionType) => {
    setOpenModal((prev) => ({
      ...prev,
      [action]: !prev[action],
    }));
  }, []);

  const closeModal = useCallback((action: ActionType) => {
    setOpenModal((prev) => ({
      ...prev,
      [action]: false,
    }));
  }, []);

  const handleSelectAction = useCallback(
    (row: Flight, action: ActionType) => {
      setSelectedRow(row);
      toggleOpenModal(action);
    },
    [toggleOpenModal]
  );
  return (
    <div>
      <Typography variant="h6" mb={1}>
        Flight Info
      </Typography>
      <DataTable
        rows={rows.map((r, index) => ({
          id: r.flightId ?? index,
          ...r,
        }))}
        columns={flightCols}
        checkboxSelection
      />
    </div>
  );
};

export default Setting_flight;
