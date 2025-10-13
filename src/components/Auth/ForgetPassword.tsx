import { memo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useToast } from "../../context/ToastContext";
import InputTextField from "../../common/Input/InputTextField";
import { useForgotPassword } from "../Api/usePostApi";
import VerifyOpt from "./VerifyOpt";

interface FormDataType {
  email: string;
}

const ForgetPassword = () => {
  const { control, watch } = useForm<FormDataType>({
    defaultValues: { email: "" },
  });
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [navigateOTP, setNavigateOTP] = useState(false);
  const { refetchForgotPassword } = useForgotPassword();
  const [userId, setUserId] = useState<number | null>(null);
  const email = watch("email");

  const onHandleValueHasValid = async () => {
    try {
      setLoading(true);
      const res = await refetchForgotPassword({ email });

      if (res?.resultCode === "00") {
        setNavigateOTP(true);
        setUserId(res.data?.userId ?? null);
        toast(res.resultMessage, "info");
        return;
      }
    } catch (err) {
      console.error("Reset error:", err);
      toast("Không thể đặt lại mật khẩu", "error");
    } finally {
      setLoading(false);
    }
  };

  if (navigateOTP && userId) {
    return <VerifyOpt email={email} userId={userId} />;
  }

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <form>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quên mật khẩu
        </Typography>

        <InputTextField name="email" placeholder="Email" />

        <Button
          type="submit"
          onClick={onHandleValueHasValid}
          disabled={loading || !email}
          sx={{ mt: 2 }}
        >
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </Button>
      </form>
    </Box>
  );
};

export default memo(ForgetPassword);
