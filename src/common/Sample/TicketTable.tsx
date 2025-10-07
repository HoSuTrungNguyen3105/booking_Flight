import React, { useEffect, useMemo, useState } from "react";
import { Box, Chip, Typography, Stack } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import TableSection from "../Setting/TableSection";
import type { Baggage } from "../../utils/type";
import { useGetAllTicketInfo } from "../../components/Api/useGetApi";
import { DateFormatEnum, formatDate } from "../../hooks/format";

const TicketTable: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { getTicketInfo } = useGetAllTicketInfo();
  const rowData = useMemo(
    () =>
      getTicketInfo?.list?.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [getTicketInfo]
  );

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      //   const res = await axios.get("http://localhost:3000/api/tickets");
      //   setTickets(res.data);
    } catch (err) {
      setError("Không thể tải danh sách vé!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

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
    { field: "ticketNo", headerName: "Mã vé", flex: 1 },
    { field: "passengerId", headerName: "Hành khách", flex: 1 },
    { field: "flightId", headerName: "Mã Bay", flex: 0.5 },
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
    { field: "seatNo", headerName: "Số ghế", flex: 0.5 },
    {
      field: "bookedAt",
      headerName: "Ngày đặt",
      flex: 1.2,
      renderCell: (params) => {
        const timestamp = Number(params.value);
        const date = new Date(timestamp);
        return date.toLocaleString("vi-VN");
      },
    },
    {
      field: "boardingPass",
      headerName: "Thẻ lên máy bay",
      flex: 2,
      renderCell: (params) =>
        params.value ? (
          <Stack spacing={0.5}>
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
      flex: 2,
      renderCell: (params) =>
        params.value && params.value.length > 0 ? (
          <Stack spacing={0.5}>
            {params.value.map((b: Baggage) => {
              const { label, sx } = getBaggageStatusColor(b.status);
              return (
                <Chip
                  key={b.id}
                  label={`${b.weight}kg - ${label}`}
                  size="medium"
                  sx={{
                    ...sx,
                    borderRadius: "6px",
                    // boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                />
              );
            })}
          </Stack>
        ) : (
          <Typography color="text.secondary">Không có</Typography>
        ),
    },
  ];

  return (
    <Box sx={{ height: 700, width: "100%", mt: 3 }}>
      {error && (
        <Typography color="error" mb={1}>
          {error}
        </Typography>
      )}
      <TableSection
        rows={rowData}
        columns={columns}
        isLoading={loading}
        setRows={() => {}}
        nextRowClick
        largeThan
      />
    </Box>
  );
};

export default TicketTable;
