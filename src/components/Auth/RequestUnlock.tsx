import { useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useRequestUnlockAccount } from "../Api/usePostApi";
import InputTextArea from "../../common/Input/InputTextArea";

const RequestUnlock = ({
  userId,
  onClose,
}: {
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
      if (res?.resultCode !== "00") {
        setMessage(res?.resultMessage || null);
        setError(null);
      } else {
        setMessage(res?.resultMessage || null);
        setError(null);
        onClose();
      }
    } catch (error) {
      setMessage("Có lỗi xảy ra, vui lòng thử lại.");
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mx: "auto", borderRadius: 2 }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
        <form onSubmit={handleSubmit} className="space-y-3">
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
        </form>

        {message && (
          <Box sx={{ textAlign: "start", mt: 2 }}>
            <Typography variant="body2" color="success.main">
              {message}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
export default RequestUnlock;
