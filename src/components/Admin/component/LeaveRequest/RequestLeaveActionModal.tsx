import { Box, Button, Typography } from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import BaseModal from "../../../../common/Modal/BaseModal";
import InputTextField from "../../../../common/Input/InputTextField";
import { useAuth } from "../../../../context/AuthContext";
import {
  useApproveLeaveRequest,
  useRejectLeaveRequest,
  type SendRequestProps,
} from "../../../Api/usePostApi";
import type { LeaveRequest } from "../../../../utils/type";

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

  // ✅ Gộp logic chung cho 2 hành động
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

  // ✅ Render nội dung modal
  const renderContent = (
    <Box display="flex" flexDirection="column" gap={2} maxHeight="30rem">
      <Typography variant="body2" fontWeight={500}>
        Leave Request ID
      </Typography>
      <InputTextField value={String(selectedRows?.id ?? "")} disabled />

      <Typography variant="body2" fontWeight={500}>
        Ghi chú
      </Typography>
      <InputTextField
        value={note}
        onChange={setNote}
        placeholder="Nhập ghi chú cho yêu cầu"
      />

      <Typography variant="body2" fontWeight={500}>
        Approver ID
      </Typography>
      <InputTextField value={String(user?.id ?? "")} disabled />

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
