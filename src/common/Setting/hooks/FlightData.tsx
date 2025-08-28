import * as React from "react";
import type { Flight } from "../type";
import type { GridColDef } from "@mui/x-data-grid";
import DataTable, { type GridRowDef } from "../../DataGrid/index";
import { Button } from "../../Button/Button";
import { Typography } from "@mui/material";
import { DateFormatEnum, formatDateKR } from "../../../hooks/format";

type Props = {
  flights: Flight[];
};

const FlightTable: React.FC<Props> = ({ flights }) => {
  const rows = flights.map((f) => ({
    id: f.flightId,
    ...f,
  }));
  const columns: GridColDef[] = [
    { field: "flightNo", headerName: "Flight No", flex: 1 },
    { field: "scheduledDeparture", headerName: "Departure", flex: 1 },
    {
      field: "scheduledArrival",
      headerName: "Arrival",
      renderCell: (params) => {
        console.log(params.value as number);
        return (
          <Typography>
            {formatDateKR(DateFormatEnum.MMMM_D_YYYY_HH_MM_SS, params.value)}
          </Typography>
        );
      },
    },
    { field: "departureAirport", headerName: "From", flex: 1 },
    { field: "arrivalAirport", headerName: "To", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "meals",
      headerName: "Meals",
      flex: 1,
      renderCell: (params) => {
        const meals = params.row.meals as { id: number }[];
        return (
          <Button label={`${meals.length > 0 ? "Info Meals" : "No meals"}`} />
        );
      },
    },
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataTable rows={rows} columns={columns} />
    </div>
  );
};

export default FlightTable;
