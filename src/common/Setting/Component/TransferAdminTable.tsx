import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DateFormatEnum, formatDate } from "../../../hooks/format";
import TableSection from "../../CustomRender/TableSection";
import type { TypeStatus } from "../../../utils/type";
import { usefindAllTransferRequests } from "../../../components/Api/useGetApi";
import { useApproveTransfer } from "../../../components/Api/usePostApi";
import { CheckCircle, Cancel } from "@mui/icons-material";

const TransferAdminTable = () => {
  const { dataFindAllTransferRequests, loadingFindAllTransferRequests } =
    usefindAllTransferRequests();
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

  // Status UI
  const renderStatus = (status: TypeStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <Chip
            icon={<CheckCircle />}
            label="Approved"
            color="success"
            size="small"
          />
        );
      case "REJECTED":
        return (
          <Chip icon={<Cancel />} label="Rejected" color="error" size="small" />
        );
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
    setActionTransfer("approve");
    setTransferRequestId(id);
    setOpenDialog(true);
  };

  const handleReject = (id: number) => {
    setActionTransfer("reject");
    setTransferRequestId(id);
    setOpenDialog(true);
  };

  const handleConfirm = () => {
    if (actionTransfer === "approve") {
      refetchApproveTransfer();
    } else {
      console.log("Reject API call...");
    }
    setOpenDialog(false);
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
        width: 150,
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
            <Tooltip title="Approve">
              <IconButton
                color="success"
                onClick={() => handleApprove(params.row.id)}
              >
                <CheckCircle />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reject">
              <IconButton
                color="error"
                onClick={() => handleReject(params.row.id)}
              >
                <Cancel />
              </IconButton>
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
        boxShadow: 3,
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Xác nhận thao tác</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn{" "}
            <strong
              style={{ color: actionTransfer === "approve" ? "green" : "red" }}
            >
              {actionTransfer === "approve" ? "APPROVE" : "REJECT"}
            </strong>{" "}
            yêu cầu này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button
            variant="contained"
            color={actionTransfer === "approve" ? "success" : "error"}
            onClick={handleConfirm}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransferAdminTable;
