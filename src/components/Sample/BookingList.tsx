import React, { memo, useEffect, useMemo, useState } from "react";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import { useGetBookingList } from "../../context/Api/useGetApi";
import theme from "../../scss/theme";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import TableSection from "../../common/AdditionalCustomFC/TableSection";
import { DateFormatEnum, formatDate } from "../../hooks/format";
import type { Booking, Passenger, Seat } from "../../utils/type";
import { Edit, Visibility } from "@mui/icons-material";
import { ResponseCode } from "../../utils/response";

const BookingList: React.FC = () => {
  const { dataBookingList } = useGetBookingList();
  const [data, setData] = useState<Booking[]>([]); // default rỗng thay vì null

  useEffect(() => {
    if (
      dataBookingList?.resultCode === ResponseCode.SUCCESS &&
      Array.isArray(dataBookingList.list)
    ) {
      setData(dataBookingList.list);
    }
  }, [dataBookingList]);

  console.log("dataBookingList", dataBookingList);
  const rowData = useMemo(
    () =>
      data?.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [data]
  );

  const bookingColumns: GridColDef[] = [
    {
      field: "id",
      headerName: "Booking ID",
      flex: 1,
    },
    {
      field: "bookingTime",
      headerName: "Booking time",
      flex: 1,
      valueGetter: (params: number) =>
        formatDate(DateFormatEnum.DD_MM_YYYY_HH_MM_SS, params),
    },
    {
      field: "flightNo",
      headerName: "Flight No",
      flex: 1,
      renderCell: (params: GridRenderCellParams) =>
        params.row?.flight?.flightNo ?? "-",
    },
    {
      field: "flightId",
      headerName: "Flight No",
      flex: 1,
      renderCell: (params: GridRenderCellParams) =>
        params.row?.flight?.flightId ?? "-",
    },
    {
      field: "aircraftCode",
      headerName: "Aircraft",
      flex: 1,
      renderCell: (params: GridRenderCellParams) =>
        params.row?.flight?.aircraftCode ?? "-",
    },
    {
      field: "route",
      headerName: "Route",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const dep = params.row.flight?.departureAirport ?? "-";
        const arr = params.row.flight?.arrivalAirport ?? "-";
        return `${dep} → ${arr}`;
      },
    },
    {
      field: "scheduledDeparture",
      headerName: "Depart (sched.)",
      flex: 1,
      renderCell: (params: GridRenderCellParams) =>
        formatDate(
          DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
          params?.row?.flight?.scheduledDeparture
        ),
    },
    {
      field: "scheduledArrival",
      headerName: "Arrive (sched.)",
      flex: 1,
      renderCell: (params: GridRenderCellParams) =>
        formatDate(
          DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
          params?.row?.flight?.scheduledArrival
        ),
    },
    {
      field: "seat",
      headerName: "Seat",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const s: Seat | undefined = params?.row?.seats;
        if (!s) return "-";
        const num = s.seatNumber ?? "";
        const row = s.seatRow ?? "";
        return row || num ? `${row}${num}` : "-";
      },
    },
    {
      field: "seatType",
      headerName: "Seat type",
      flex: 1,
      renderCell: (params: GridRenderCellParams) =>
        params?.row?.seats?.type ?? "-",
    },
    {
      field: "seatPrice",
      headerName: "Seat price",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const p =
          params?.row?.seats?.price ??
          params?.row?.flight?.priceEconomy ??
          null;
        return p == null ? "-" : Number(p).toLocaleString();
      },
      //   align: "right",
      //   headerAlign: "right",
    },
    {
      field: "passenger",
      headerName: "Passenger",
      flex: 2,
      renderCell: (params: GridRenderCellParams) => {
        const p: Passenger | undefined = params?.row?.passenger;
        const name = p?.fullName ?? params?.row?.passengerId ?? "-";
        const email = p?.email ? ` — ${p.email}` : "";
        return `${name}${email}`;
      },
    },
    {
      field: "mealOrders",
      headerName: "Meals",
      flex: 1,
      renderCell: (params: GridRenderCellParams) =>
        Array.isArray(params?.row?.mealOrders)
          ? params?.row?.mealOrders.length
          : 0,
      //   align: "center",
      //   headerAlign: "center",
    },
    // optional status/flags column (cancelled, delay)
    {
      field: "isCancelled",
      headerName: "Cancelled",
      flex: 1,
      renderCell: (params: GridRenderCellParams) =>
        params?.row?.flight?.isCancelled ? "Yes" : "No",
      //   align: "center",
      //   headerAlign: "center",
    },
    {
      field: "delayMinutes",
      headerName: "Delay (min)",
      flex: 1,
      renderCell: (params: GridRenderCellParams) =>
        params?.row?.flight?.delayMinutes ?? 0,
      //   align: "right",
      //   headerAlign: "right",
    },
    // action column
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const onView = () => {
          // you can navigate or open modal using params.row
          console.log("view", params.row);
        };
        const onEdit = () => {
          console.log("edit", params.row);
        };

        return (
          <div>
            <Tooltip title="View">
              <IconButton size="small" onClick={onView}>
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={onEdit}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  //   if (!dataBaggage) {
  //     return <Typography>No value</Typography>;
  //   }

  return (
    <Box sx={{ maxWidth: "100%", mx: "auto" }}>
      <Typography
        variant="h4"
        sx={{
          color: theme.palette.primary.main,
          fontWeight: "bold",
          mb: 1,
        }}
      >
        Booking Management
      </Typography>

      <TableSection
        rows={rowData}
        columns={bookingColumns}
        isLoading={false}
        setRows={() => {}}
        nextRowClick
        largeThan
      />
    </Box>
  );
};

export default memo(BookingList);
