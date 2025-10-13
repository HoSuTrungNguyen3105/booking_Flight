import { memo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useToast } from "../../context/ToastContext";
import { Link } from "react-router-dom";
import InputTextField from "../../common/Input/InputTextField";
import { useCheckMfaAvailable } from "../Api/usePostApi";

interface FormDataType {
  email: string;
  mfaCode?: string;
}

const ForgetPasswordFromMFA = () => {
  const { control, watch } = useForm<FormDataType>({
    defaultValues: { email: "", mfaCode: "" },
  });
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [requireMfa, setRequireMfa] = useState(false);
  const { refetchMfaCheck } = useCheckMfaAvailable();
  const email = watch("email");

  const onHandleValueHasValid = async () => {
    try {
      setLoading(true);
      const res = await refetchMfaCheck({ email });

      if (res?.resultCode === "00") {
        setRequireMfa(true);
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

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <form>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quên mật khẩu
        </Typography>

        <InputTextField name="email" placeholder="Email" />

        {requireMfa && (
          <Box sx={{ mt: 2 }}>
            <Typography>MFA Code</Typography>
            <InputTextField name="mfaCode" placeholder="Nhập MFA code" />
          </Box>
        )}

        <Button
          type="submit"
          onClick={onHandleValueHasValid}
          disabled={loading || !email}
          sx={{ mt: 2 }}
        >
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </Button>
      </form>

      <Box sx={{ mt: 2 }}>
        <Link to="/init/loginPage">Đã có tài khoản? Đăng nhập ngay</Link>
      </Box>
    </Box>
  );
};

export default memo(ForgetPasswordFromMFA);
