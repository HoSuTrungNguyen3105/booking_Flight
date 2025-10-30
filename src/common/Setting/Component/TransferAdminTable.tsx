import { useCallback, useMemo, useState } from "react";
import { Box, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DateFormatEnum, formatDate } from "../../../hooks/format";
import TableSection from "../../CustomRender/TableSection";
import type { TypeStatus } from "../../../utils/type";
import { usefindAllTransferRequests } from "../../../context/Api/useGetApi";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { useApproveOrRejectTransfer } from "../../../context/Api/usePostApi";
import { useToast } from "../../../context/ToastContext";
import DialogConfirm from "../../Modal/DialogConfirm";

const TransferAdminTable = () => {
  const {
    dataFindAllTransferRequests,
    refetchFindAllTransferRequests,
    loadingFindAllTransferRequests,
  } = usefindAllTransferRequests();
  const [transferRequestId, setTransferRequestId] = useState<number | null>(
    null
  );
  const [actionTransfer, setActionTransfer] = useState<"approve" | "reject">(
    "approve"
  );
  const [openDialog, setOpenDialog] = useState(false);

  // const { refetchApproveTransfer } = useApproveTransfer({
  //   id: transferRequestId as number,
  // });

  const { refetchApproveOrRejectTransfer } = useApproveOrRejectTransfer();
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
  const toast = useToast();

  const handleConfirm = useCallback(async () => {
    if (!transferRequestId) return;

    try {
      const res = await refetchApproveOrRejectTransfer({
        userId: transferRequestId,
        mode: actionTransfer,
      });

      if (res?.resultCode === "00") {
        toast(res?.resultMessage || "Success");
        refetchFindAllTransferRequests();
      }
    } catch (error) {
      console.error("Error approving/rejecting transfer:", error);
      toast("Something went wrong!");
    } finally {
      setOpenDialog(false);
    }
  }, [
    actionTransfer,
    transferRequestId,
    refetchApproveOrRejectTransfer,
    toast,
  ]);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", flex: 1 },
      { field: "userId", headerName: "User ID", flex: 1 },
      { field: "fromUserId", headerName: "From User ID", flex: 1 },
      { field: "toUserId", headerName: "To User ID", flex: 1 },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        renderCell: (params) => renderStatus(params.value as TypeStatus),
      },
      {
        field: "requestedAt",
        headerName: "Requested At",
        flex: 1,
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
        height: "auto",
        width: "100%",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: "10px 16px",
          border: 1,
          borderColor: "grey.200",
          borderLeft: "none",
          borderRight: "none",
        }}
      >
        <Typography component="p" variant="subtitle1" fontWeight="600">
          Transfer Admin Authority
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You can request or approve the transfer of admin privileges.
        </Typography>
      </Box>
      <TableSection
        rows={rowAllTransferRequests}
        columns={columns}
        isLoading={loadingFindAllTransferRequests}
        setRows={() => {}}
        nextRowClick
        largeThan
        handleRowClick={(params) => {
          setTransferRequestId(params.userId as number);
        }}
      />
      <DialogConfirm
        cancelLabel="Cancel"
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirm}
        title={`Are you sure you want to ${
          actionTransfer === "approve" ? "APPROVE" : "REJECT"
        } this request?`}
        message="Are you sure you want to save the changes to your personal information?"
        confirmLabel={actionTransfer === "approve" ? "APPROVE" : "REJECT"}
      />
    </Box>
  );
};

export default TransferAdminTable;
