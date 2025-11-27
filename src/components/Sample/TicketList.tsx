import React, { useMemo, useState } from "react";
import { Box, Chip, Typography, Stack, Button } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import TableSection from "../../common/AdditionalCustomFC/TableSection";
import type { Baggage, TicketResponseMessage } from "../../utils/type";
import { DateFormatEnum, formatDate } from "../../hooks/format";
import TicketListManagement from "./TicketCard";
import { useGetAllTicketInfo } from "../../context/Api/FlightApi";

const TicketList: React.FC = () => {
  const { getTicketInfo, loadingGetTicketInfo } = useGetAllTicketInfo();
  const [allInfoTicket, setAllInfoTicket] = useState(false);
  const rowData = useMemo(
    () =>
      getTicketInfo?.list?.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [getTicketInfo]
  );

  const getBaggageStatusColor = (status: string) => {
    switch (status) {
      case "CHECKED_IN":
        return {
          label: "Đã ký gửi",
          sx: {
            background: "linear-gradient(135deg, #81c784, #66bb6a)",
            color: "#fff",
            fontWeight: 500,
          },
        };
      case "LOADED":
        return {
          label: "Đã lên máy bay",
          sx: {
            background: "linear-gradient(135deg, #42a5f5, #1e88e5)",
            color: "#fff",
            fontWeight: 500,
          },
        };
      case "CLAIMED":
        return {
          label: "Đã nhận hành lý",
          sx: {
            background: "linear-gradient(135deg, #ffca28, #fbc02d)",
            color: "#000",
            fontWeight: 600,
          },
        };
      case "LOST":
        return {
          label: "Thất lạc",
          sx: {
            background: "linear-gradient(135deg, #ef5350, #e53935)",
            color: "#fff",
            fontWeight: 600,
          },
        };
      default:
        return {
          label: "Không rõ",
          sx: {
            background: "linear-gradient(135deg, #bdbdbd, #9e9e9e)",
            color: "#fff",
          },
        };
    }
  };

  const columns: GridColDef[] = [
    {
      field: "ticketNo",
      headerName: "Mã vé",
      flex: 1,
    },
    {
      field: "passenger",
      headerName: "Hành khách",
      flex: 1,
      renderCell: (params) => params.value.fullName,
    },
    {
      field: "seatClass",
      headerName: "Hạng ghế",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value === "BUSINESS" ? "Thương gia" : "Phổ thông"}
          color={params.value === "BUSINESS" ? "secondary" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "bookedAt",
      headerName: "Ngày đặt",
      flex: 1,
      renderCell: (params) =>
        formatDate(DateFormatEnum.DD_MM_YYYY_HH_MM_SS, params.value),
    },
    {
      field: "boardingPass",
      headerName: "Thẻ lên máy bay",
      flex: 1,
      // valueGetter: (params) => {
      //   const bp = params.row.boardingPass;
      //   return bp ? Number(bp.boardingTime) || 0 : 0;
      // },
      renderCell: (params) =>
        params.value ? (
          <Stack spacing={0.2}>
            <Typography variant="body2">
              Cổng: <b>{params.value.gate}</b>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Giờ lên máy bay:{" "}
              {formatDate(
                DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
                params.value.boardingTime
              )}
            </Typography>
          </Stack>
        ) : (
          <Typography color="text.secondary">Chưa phát hành</Typography>
        ),
    },
    {
      field: "baggage",
      headerName: "Hành lý",
      flex: 1,
      valueGetter: (_, row) =>
        row.baggage?.reduce(
          (sum: number, b: Baggage) => sum + (b.weight || 0),
          0
        ) || 0,
      renderCell: (params) =>
        params.row?.baggage?.length > 0 ? (
          <>
            {params.row.baggage.map((b: Baggage) => {
              const { label, sx } = getBaggageStatusColor(b.status);
              return (
                <Chip
                  key={b.id}
                  label={`${b.weight}kg - ${label}`}
                  size="medium"
                  sx={{
                    ...sx,
                    borderRadius: "6px",
                  }}
                />
              );
            })}
          </>
        ) : (
          <Typography color="text.secondary">Không có</Typography>
        ),
    },
  ];

  if (allInfoTicket) {
    return (
      <TicketListManagement data={getTicketInfo as TicketResponseMessage} />
    );
  }

  return (
    <>
      <Box display="flex" gap={1} justifyContent="flex-start" mt={1} mb={1}>
        <Typography variant="h6" gutterBottom>
          Ticket List
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => setAllInfoTicket(true)}
        >
          Management
        </Button>
      </Box>
      <TableSection
        rows={rowData}
        columns={columns}
        isLoading={loadingGetTicketInfo}
        setRows={() => {}}
        nextRowClick
        largeThan
      />
    </>
  );
};

export default TicketList;
