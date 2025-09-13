import { Box, Button, Grid, Typography } from "@mui/material";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import BaseModal from "../../../common/Modal/BaseModal";
import InputTextField from "../../../common/Input/InputTextField";
import { useAuth } from "../../../context/AuthContext";
import {
  useApproveLeaveRequest,
  useRejectLeaveRequest,
  type SendRequestProps,
} from "../../Api/usePostApi";
import type { LeaveRequest } from "../../../utils/type";

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
  const { user } = useAuth();
  const { fetchApproveLeaveRequest } = useApproveLeaveRequest(
    selectedRows?.id as number
  );

  const { fetchRejectLeaveRequest } = useRejectLeaveRequest(
    selectedRows?.id as number
  );

  useEffect(() => {
    if (open) {
      setNote("");
    }
  }, [open]);

  const handleApproveSubmit = useCallback(async () => {
    const data: SendRequestProps = {
      approverId: user?.id as number,
      requestId: selectedRows?.employee.id as number,
      note: note,
    };
    const res = await fetchApproveLeaveRequest({
      ...data,
    });
    if (res?.resultCode == "00") {
      onSuccess();
      setNote("");
    } else setNote("");
  }, [onSuccess, fetchApproveLeaveRequest]);

  const handleRejectSubmit = useCallback(async () => {
    const data: SendRequestProps = {
      approverId: user?.id as number,
      requestId: selectedRows?.employee.id as number,
      note: note,
    };
    const res = await fetchRejectLeaveRequest({
      ...data,
    });
    if (res?.resultCode == "00") {
      onSuccess();
      setNote("");
    } else setNote("");
  }, [onSuccess, fetchRejectLeaveRequest]);

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button onClick={handleApproveSubmit}>Approve</Button>
        <Button onClick={handleRejectSubmit}>Reject</Button>
      </Box>
    );
  }, [handleApproveSubmit, handleRejectSubmit]);

  const renderContent = useCallback(() => {
    return (
      <Box maxHeight="30rem">
        <Box>
          <InputTextField value={String(selectedRows?.id)} disabled />
          <InputTextField value={note} onChange={(e) => setNote(e)} />
          <Typography component="p" variant="body2">
            임시 비밀번호
          </Typography>
          <InputTextField value={String(user?.id)} disabled />
        </Box>
        {renderActions()}
      </Box>
    );
  }, [selectedRows, note]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`원본 데이터, 통계 데이터 학습 Seq${selectedRows} 상세 정보`}
      subtitle="-선택된 원본 데이터의 상세 정보를 확인합니다.-"
      Icon={PrivacyTipIcon}
      slots={{ content: renderContent() }}
    />
  );
};

export default memo(RequestLeaveActionModal);
