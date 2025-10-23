import { memo, useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useRequestUnlockAccount } from "../../context/Api/usePostApi";
import InputTextArea from "../../common/Input/InputTextArea";

const RequestUnlock = ({
  userId,
  onClose,
}: // onClose,
{
  userId: number;
  onClose: () => void;
}) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { refetchRequestUnlockAccount } = useRequestUnlockAccount();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await refetchRequestUnlockAccount({ userId, reason });
      if (res?.resultCode === "00") {
        setMessage(res?.resultMessage || null);
        // setError(null);
        onClose();
      } else {
        setMessage(res?.resultMessage || null);
        setError(null);
      }
    } catch (error) {
      setMessage("Có lỗi xảy ra, vui lòng thử lại.");
      setError(null);
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
            if (error) setError(null);
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

      {message && (
        <Box sx={{ textAlign: "start", mt: 2 }}>
          <Typography variant="body2" color="success.main">
            {message}
          </Typography>
        </Box>
      )}
    </>
  );
};
export default memo(RequestUnlock);
