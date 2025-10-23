import React, { useCallback, useState } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import { useToast } from "../../../context/ToastContext";
import { useRequestChangeRole } from "../../../context/Api/usePostApi";
import BaseModal from "../../Modal/BaseModal";
import { AddAlert } from "@mui/icons-material";
import type { UserData } from "../../../utils/type";
import InputTextField from "../../Input/InputTextField";

interface TransferAdminModalProps {
  open: boolean;
  onClose: () => void;
  userId: UserData;
  fromUserId: number; // UserData["id"]
}

const TransferAdminModal: React.FC<TransferAdminModalProps> = ({
  open,
  onClose,
  userId,
  fromUserId,
}) => {
  const [employeeNo, setEmployeeNo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { refetchRequestChangeRole, errorRequestChangeRole } =
    useRequestChangeRole();

  const handleSubmit = async () => {
    if (!employeeNo) {
      toast("Vui lòng nhập mã nhân viên (employeeNo)!", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await refetchRequestChangeRole({
        userId: userId.id,
        fromUserId,
        employeeNo,
      });

      if (res?.resultCode === "00") {
        toast("Yêu cầu chuyển quyền đã được gửi!");
        onClose();
      } else {
        toast(res?.resultMessage || "Có lỗi xảy ra!");
      }
    } catch (err) {
      toast((err as string) || "Có lỗi xảy ra!", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderActions = useCallback(
    () => (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        {errorRequestChangeRole && (
          <Typography color="error" variant="body2">
            {errorRequestChangeRole}
          </Typography>
        )}
        <Button variant="outlined" onClick={handleSubmit}>
          {loading ? "Đang gửi..." : "Xác nhận"}
        </Button>
      </Box>
    ),
    [handleSubmit, errorRequestChangeRole]
  );

  const renderContent = () => (
    <Box
      sx={{
        // position: "absolute" as const,
        // top: "50%",
        // left: "50%",
        // transform: "translate(-50%, -50%)",
        // width: 400,
        //   bgcolor: "background.paper",
        p: 4,
        //borderRadius: 2,
        //   boxShadow: 24,
      }}
    >
      <Typography variant="h6" mb={2}>
        Chuyển quyền Admin
      </Typography>

      <Stack spacing={2}>
        <InputTextField
          placeholder="Mã nhân viên (employeeNo)"
          value={employeeNo}
          onChange={(e) => setEmployeeNo(e)}
        />
      </Stack>
    </Box>
  );

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Chuyển quyền Admin"
      Icon={AddAlert}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default TransferAdminModal;
