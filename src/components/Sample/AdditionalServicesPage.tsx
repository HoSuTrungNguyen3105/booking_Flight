import React, { useMemo } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { useGetBaggageData } from "../Api/useGetApi";
import theme from "../../scss/theme";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import TableSection from "../../common/CustomRender/TableSection";

const getBaggageStatusStyle = (status: string) => {
  switch (status) {
    case "CHECKED_IN":
      return {
        label: "Đã ký gửi",
        // sx: {
        //   background: "linear-gradient(135deg, #43a047, #66bb6a)", // xanh lá
        //   color: "#fff",
        //   fontWeight: 600,
        //   borderRadius: "8px",
        //   px: 1.5,
        //   py: 0.5,
        // },
      };

    case "LOADED":
      return {
        label: "Đã lên máy bay",
        sx: {
          background: "linear-gradient(135deg, #2196f3, #42a5f5)", // xanh dương
          color: "#fff",
          fontWeight: 600,
          borderRadius: "8px",
          px: 1.5,
          py: 0.5,
        },
      };

    case "CLAIMED":
      return {
        label: "Đã nhận hành lý",
        sx: {
          background: "linear-gradient(135deg, #8e24aa, #ab47bc)", // tím
          color: "#fff",
          fontWeight: 600,
          borderRadius: "8px",
          px: 1.5,
          py: 0.5,
        },
      };

    case "LOST":
      return {
        label: "Thất lạc",
        sx: {
          background: "linear-gradient(135deg, #ef5350, #e53935)", // đỏ
          color: "#fff",
          fontWeight: 600,
          borderRadius: "8px",
          px: 1.5,
          py: 0.5,
        },
      };

    default:
      return {
        label: "Không rõ",
        sx: {
          background: "linear-gradient(135deg, #bdbdbd, #9e9e9e)",
          color: "#fff",
          fontWeight: 600,
          borderRadius: "8px",
          px: 1.5,
          py: 0.5,
        },
      };
  }
};

const AdditionalServicesPage: React.FC = () => {
  const { dataBaggage } = useGetBaggageData();

  const rowData = useMemo(
    () =>
      dataBaggage?.list?.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [dataBaggage]
  );

  const columns: GridColDef[] = [
    {
      field: "flightNo",
      headerName: "Chuyến bay",
      flex: 0.5,
      renderCell: (params: GridRenderCellParams) =>
        params.row?.flight?.flightNo ?? "---",
    },
    {
      field: "flightTerminal",
      headerName: "Terminal",
      flex: 0.5,
      renderCell: (params: GridRenderCellParams) =>
        params.row?.flight?.terminal ?? "---",
    },
    {
      field: "ticket",
      headerName: "Thong tin ghế",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const seatNo = params.row?.ticket?.seatNo ?? "---";
        const seatClass = params.row?.ticket?.seatClass ?? "---";
        return `${seatNo} (${seatClass})`;
      },
    },
    {
      field: "weight",
      headerName: "Khối lượng (kg)",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => `${params.value ?? 0} kg`,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1,
      renderCell: (params) => {
        const statusStyle = getBaggageStatusStyle(params.value);
        return (
          <Chip
            label={statusStyle.label}
            sx={{
              ...statusStyle.sx,
              textTransform: "capitalize",
              fontSize: 13,
            }}
            size="small"
          />
        );
      },
    },
  ];

  if (!dataBaggage) {
    return <Typography>No value</Typography>;
  }

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
        Baggage Management
      </Typography>
      <Box sx={{ width: "100%" }}>
        <TableSection
          rows={rowData}
          columns={columns}
          isLoading={false}
          setRows={() => {}}
          nextRowClick
          largeThan
        />
      </Box>
    </Box>
  );
};

export default AdditionalServicesPage;
