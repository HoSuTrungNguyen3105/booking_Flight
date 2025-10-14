import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useToast } from "../../../context/ToastContext";
import { useRequestChangeRole } from "../../../components/Api/usePostApi";

interface TransferAdminModalProps {
  open: boolean;
  onClose: () => void;
  userId: number;
  fromUserId: number;
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
  const { refetchRequestChangeRole } = useRequestChangeRole();

  const handleSubmit = async () => {
    if (!employeeNo) {
      toast("Vui lòng nhập mã nhân viên (employeeNo)!", "error");
      return;
    }

    setLoading(true);
    try {
      //   const res = await axios.post("/transfer-admin/request-change-role", {
      //     userId,
      //     fromUserId,
      //     employeeNo,
      //   });

      const res = await refetchRequestChangeRole({
        userId,
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

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" mb={2}>
          Chuyển quyền Admin
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Mã nhân viên (employeeNo)"
            value={employeeNo}
            onChange={(e) => setEmployeeNo(e.target.value)}
            fullWidth
          />

          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button variant="outlined" onClick={onClose}>
              Hủy
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Xác nhận"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default TransferAdminModal;
