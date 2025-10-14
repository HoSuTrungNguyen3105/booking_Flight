import React, { useMemo } from "react";
import { Box, Chip } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { DateFormatEnum, formatDate } from "../../../hooks/format";
import TableSection from "../../CustomRender/TableSection";
import type { TypeStatus } from "../../../utils/type";
import { usefindAllTransferRequests } from "../../../components/Api/useGetApi";

const TransferAdminTable = () => {
  const {
    dataFindAllTransferRequests,
    loadingFindAllTransferRequests,
    refetchFindAllTransferRequests,
  } = usefindAllTransferRequests();
  const renderStatus = (status: TypeStatus) => {
    switch (status) {
      case "APPROVED":
        return <Chip label="Approved" color="success" size="small" />;
      case "REJECTED":
        return <Chip label="Rejected" color="error" size="small" />;
      default:
        return <Chip label="Pending" color="warning" size="small" />;
    }
  };

  const rowAllTransferRequests = useMemo(
    () =>
      dataFindAllTransferRequests?.list?.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [dataFindAllTransferRequests]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 80 },
      { field: "userId", headerName: "User ID", width: 120 },
      { field: "fromUserId", headerName: "From User ID", width: 150 },
      { field: "toUserId", headerName: "To User ID", width: 150 },
      {
        field: "status",
        headerName: "Status",
        width: 130,
        renderCell: (params) => renderStatus(params.value as TypeStatus),
      },
      {
        field: "requestedAt",
        headerName: "Requested At",
        width: 180,
        valueFormatter: (params) =>
          formatDate(
            DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
            params as string | number
          ),
      },
      {
        field: "approvedAt",
        headerName: "Approved At",
        width: 180,
        valueFormatter: (params) =>
          formatDate(
            DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
            params as string | number
          ),
      },
    ],
    []
  );

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        bgcolor: "background.paper",
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <TableSection
        rows={rowAllTransferRequests}
        columns={columns}
        isLoading={loadingFindAllTransferRequests}
        setRows={() => {}}
      />
    </Box>
  );
};

export default TransferAdminTable;
