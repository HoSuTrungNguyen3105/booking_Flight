import { useState } from "react";
import { Button, Card, CardContent } from "@mui/material";
import TextArea from "../../common/Input/TextArea";
import { useRequestUnlockAccount } from "../Api/usePostApi";

const RequestUnlock = ({ userId }: { userId: number }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { refetchRequestUnlockAccount } = useRequestUnlockAccount();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await refetchRequestUnlockAccount({ userId, reason });
      console.log("res", res);
      setMessage(res?.resultMessage || null);
    } catch (error) {
      setMessage("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <h2>Tài khoản bị khóa</h2>
        <p>Vui lòng gửi lý do để yêu cầu mở khóa tài khoản của bạn.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <TextArea
            placeholder="Nhập lý do..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="w-full"
            disabled={loading || reason.trim() === ""}
          >
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>
        </form>

        {message && (
          <p className="text-center text-sm text-green-600">{message}</p>
        )}
      </CardContent>
    </Card>
  );
};
export default RequestUnlock;
