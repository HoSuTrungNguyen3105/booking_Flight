import { memo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useToast } from "../../context/ToastContext";
import InputTextField from "../../common/Input/InputTextField";
import { useForgotPassword } from "../Api/usePostApi";

const ForgetPassword = ({ onClose }: { onClose: () => void }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { refetchForgotPassword } = useForgotPassword();
  const [email, setEmail] = useState<string>("");

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast("Vui lòng nhập email", "info");
      return;
    }

    try {
      setLoading(true);
      const res = await refetchForgotPassword({ email });
      console.log("res forget", res);
      if (res?.resultCode === "00") {
        // setUserId(res.data?.userId ?? null);
        // setNavigateOTP(true);
        toast(res.resultMessage, "info");
        onClose();
      } else {
        toast(res?.resultMessage || "Không thể đặt lại mật khẩu", "error");
      }
    } catch (err) {
      console.error("Reset error:", err);
    } finally {
      setLoading(false);
    }
  };

  // if (navigateOTP && userId) {
  //   return <VerifyOpt email={email} userId={userId} />;
  // }

  return (
    <Box sx={{ textAlign: "center", m: 2, mt: 2 }}>
      <form onSubmit={handleSubmitForm}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quên mật khẩu
        </Typography>

        <InputTextField
          name="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e)}
          sx={{ width: "20rem" }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading || !email}
          // sx={{ mt: 1, pl: 2 }}
        >
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </Button>
      </form>
    </Box>
  );
};

export default memo(ForgetPassword);
