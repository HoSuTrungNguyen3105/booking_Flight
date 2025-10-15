import React, { useMemo, useState } from "react";
import { Box, Button, Chip, IconButton, Tooltip } from "@mui/material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DateFormatEnum, formatDate } from "../../../hooks/format";
import TableSection from "../../CustomRender/TableSection";
import type { TypeStatus } from "../../../utils/type";
import { usefindAllTransferRequests } from "../../../components/Api/useGetApi";
import { useApproveTransfer } from "../../../components/Api/usePostApi";
import RejectIcon from "../../../svgs/deny-svgrepo-com.svg";

const TransferAdminTable = () => {
  const {
    dataFindAllTransferRequests,
    loadingFindAllTransferRequests,
    refetchFindAllTransferRequests,
  } = usefindAllTransferRequests();
  const [transferRequestId, setTransferRequestId] = useState<number | null>(
    null
  );
  const [actionTransfer, setActionTransfer] = useState<"approve" | "reject">(
    "approve"
  );
  const [openDialog, setOpenDialog] = useState(false);
  const { refetchApproveTransfer } = useApproveTransfer({
    id: transferRequestId as number,
  });

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

  const handleApprove = (id: number) => {
    setActionTransfer("reject");
    setTransferRequestId(id);
    setOpenDialog(true);
  };

  const handleReject = (id: number) => {
    setActionTransfer("reject");
    setTransferRequestId(id);
    setOpenDialog(true);
  };

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
      {
        field: "actions",
        headerName: "Thao tác",
        flex: 1,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Reject">
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleReject(params.row)}
                size="small"
              >
                <Box
                  component="img"
                  sx={{ height: 12, width: 12 }}
                  src={RejectIcon}
                  alt="reject"
                />
              </Button>
            </Tooltip>
            <Tooltip title="Approve">
              <Button
                variant="contained"
                color="error"
                onClick={() => handleApprove(params.row.code)}
                size="small"
              ></Button>
            </Tooltip>
          </Box>
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
        handleRowClick={(params) => {
          console.log("Clicked row ID:", params.id);
          setTransferRequestId(params.id as number);
        }}
      />
    </Box>
  );
};

export default TransferAdminTable;
