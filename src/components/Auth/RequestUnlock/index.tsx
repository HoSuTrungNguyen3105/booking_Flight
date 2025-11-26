import { memo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import InputTextArea from "../../../common/Input/InputTextArea";
import { ResponseCode } from "../../../utils/response";
import { useToast } from "../../../context/ToastContext";
import { useRequestUnlockAccount } from "../../../context/Api/RequestApi";

const RequestUnlock = ({
  userId,
  onClose,
}: {
  userId: number;
  onClose: () => void;
}) => {
  const toast = useToast();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const { refetchRequestUnlockAccount } = useRequestUnlockAccount();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await refetchRequestUnlockAccount({ userId, reason });
      if (res?.resultCode === ResponseCode.SUCCESS) {
        toast(res?.resultMessage, "success");
        onClose();
      } else {
        toast(res?.resultMessage || "Error");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ textAlign: "center" }}>
        <Typography
          sx={{ fontSize: "1.25rem", fontWeight: 600, color: "#1e293b" }}
        >
          Tài khoản đã bị khóa
        </Typography>
        <Typography sx={{ fontSize: "0.9rem", color: "#64748b" }}>
          Vui lòng nhập lý do để gửi yêu cầu mở khóa tài khoản.
        </Typography>
      </Box>

      <Box component={"form"} onSubmit={handleSubmit}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ fontSize: "0.9rem", color: "#672222" }}
        >
          Return
        </Button>
        <InputTextArea
          placeholder="Nhập lý do..."
          value={reason}
          onChange={(e) => {
            setReason(e);
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading || reason.trim() === ""}
        >
          {loading ? "Đang gửi..." : "Gửi yêu cầu"}
        </Button>
      </Box>
    </>
  );
};
export default memo(RequestUnlock);
