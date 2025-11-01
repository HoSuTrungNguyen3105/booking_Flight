import React, { memo, useMemo } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { useGetBaggageData } from "../../context/Api/useGetApi";
import theme from "../../scss/theme";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import TableSection from "../../common/CustomRender/TableSection";
import { Loading } from "../../common/Loading/Loading";

const getBaggageStatusStyle = (status: string) => {
  switch (status) {
    case "CHECKED_IN":
      return {
        label: "Đã ký gửi",
        sx: {
          background: theme.palette.info.dark,
          color: "#fff",
          fontWeight: 600,
          borderRadius: "8px",
        },
      };

    case "LOADED":
      return {
        label: "Đã lên máy bay",
        sx: {
          background: theme.palette.common.black,
          color: "#fff",
          fontWeight: 600,
          borderRadius: "8px",
        },
      };

    case "CLAIMED":
      return {
        label: "Đã nhận hành lý",
        sx: {
          background: theme.palette.action.active,
          color: "#fff",
          fontWeight: 600,
          borderRadius: "8px",
        },
      };

    case "LOST":
      return {
        label: "Thất lạc",
        sx: {
          background: theme.palette.error.dark,
          color: "#fff",
          fontWeight: 600,
          borderRadius: "8px",
        },
      };

    default:
      return {
        label: "Không rõ",
        sx: {
          background: theme.palette.warning.dark,
          color: "#fff",
          fontWeight: 600,
          borderRadius: "8px",
        },
      };
  }
};

const BaggageList: React.FC = () => {
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
        params.row?.flight?.flightNo ?? "-",
    },
    {
      field: "flightTerminal",
      headerName: "Terminal",
      flex: 0.5,
      renderCell: (params: GridRenderCellParams) =>
        params.row?.flight?.terminal ?? "-",
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
    return <Loading />;
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

      <TableSection
        rows={rowData}
        columns={columns}
        isLoading={false}
        setRows={() => {}}
        nextRowClick
        largeThan
      />
    </Box>
  );
};

export default memo(BaggageList);
