import { Badge, Box, Button, Chip, Typography } from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import BaseModal from "../../../../common/Modal/BaseModal";
import InputTextField from "../../../../common/Input/InputTextField";
import { useAuth } from "../../../../context/AuthContext";
import type { LeaveRequest } from "../../../../utils/type";
import { Note, Person } from "@mui/icons-material";
import InputTextArea from "../../../../common/Input/InputTextArea";
import {
  useApproveLeaveRequest,
  useRejectLeaveRequest,
  type SendRequestProps,
} from "../../../../context/Api/RequestApi";

interface IRequestLeaveActionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedRows: LeaveRequest | null;
}

const RequestLeaveActionModal = ({
  open,
  onClose,
  onSuccess,
  selectedRows,
}: IRequestLeaveActionModalProps) => {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  const { fetchApproveLeaveRequest } = useApproveLeaveRequest(
    selectedRows?.id ?? 0
  );
  const { fetchRejectLeaveRequest } = useRejectLeaveRequest(
    selectedRows?.id ?? 0
  );

  // Reset state khi modal mở
  useEffect(() => {
    if (open) {
      setNote("");
      setError("");
    }
  }, [open]);

  const handleSubmit = useCallback(
    async (type: "approve" | "reject") => {
      if (!user?.id || !selectedRows?.id) return;
      setError("");

      const data: SendRequestProps = {
        approverId: user.id,
        requestId: selectedRows.id,
        note,
      };

      const res =
        type === "approve"
          ? await fetchApproveLeaveRequest(data)
          : await fetchRejectLeaveRequest(data);

      if (res?.resultCode === "00") {
        onSuccess();
        setNote("");
      } else {
        setNote("");
        setError(res?.resultMessage || "Đã xảy ra lỗi, vui lòng thử lại.");
      }
    },
    [
      user?.id,
      selectedRows?.id,
      note,
      fetchApproveLeaveRequest,
      fetchRejectLeaveRequest,
      onSuccess,
    ]
  );

  const renderActions = (
    <Box
      display="flex"
      gap={1}
      justifyContent="flex-end"
      alignItems="center"
      mt={2}
    >
      {error && (
        <Typography color="error" fontSize={"15px"} fontWeight={500}>
          {error}
        </Typography>
      )}
      <Button variant="contained" onClick={() => handleSubmit("approve")}>
        Approve
      </Button>
      <Button variant="outlined" onClick={() => handleSubmit("reject")}>
        Reject
      </Button>
    </Box>
  );

  const renderContent = (
    <Box display="flex" flexDirection="column" gap={3} maxHeight="30rem">
      {/* Header */}
      <Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Xử lý yêu cầu nghỉ phép
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Vui lòng xem xét và phê duyệt yêu cầu nghỉ phép
        </Typography>
      </Box>

      <Box>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Badge color="primary" />
          <Typography variant="body2" fontWeight={500}>
            Mã yêu cầu
          </Typography>
        </Box>
        <InputTextField
          value={String(selectedRows?.id ?? "")}
          disabled
          sx={{
            "& .MuiInputBase-input": {
              fontWeight: 500,
              backgroundColor: "action.hover",
            },
          }}
        />
      </Box>

      <Box>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Note fontSize="small" color="primary" />
          <Typography variant="body2" fontWeight={500}>
            Ghi chú
          </Typography>
          <Chip
            label="Tùy chọn"
            size="small"
            variant="outlined"
            color="default"
          />
        </Box>
        <InputTextArea
          value={note}
          onChange={setNote}
          placeholder="Nhập ghi chú cho yêu cầu nghỉ phép..."
        />
      </Box>

      {/* Approver Info */}
      <Box>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Person fontSize="small" color="primary" />
          <Typography variant="body2" fontWeight={500}>
            Người phê duyệt
          </Typography>
        </Box>
        <InputTextField value={String(user?.id ?? "")} disabled />
        {user?.name && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: "block" }}
          >
            {user.name}
          </Typography>
        )}
      </Box>

      {/* Actions */}
      {renderActions}
    </Box>
  );

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`Chi tiết yêu cầu nghỉ (${selectedRows?.id ?? "N/A"})`}
      subtitle="Bạn có chắc chắn muốn phê duyệt hoặc từ chối yêu cầu này?"
      Icon={PrivacyTipIcon}
      slots={{ content: renderContent }}
    />
  );
};

export default memo(RequestLeaveActionModal);
