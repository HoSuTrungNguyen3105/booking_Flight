import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Button } from "../../common/Button/Button";
import Input from "../../common/CustomRender/Input";
import { useForm } from "react-hook-form";
import { useToast } from "../../context/ToastContext";
import { useCheckMfaAvailable } from "../Api/useGetApi";
import { useResetPasswordByMfa } from "../Api/usePostApi";

interface FormDataType {
  email: string;
  mfaCode?: string;
}

const ForgetPassword = () => {
  const { control, handleSubmit, watch } = useForm<FormDataType>({
    defaultValues: { email: "", mfaCode: "" },
  });
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [requireMfa, setRequireMfa] = useState(false);
  const { refetchMfaCheck } = useCheckMfaAvailable();
  const { refetchChangePassword } = useResetPasswordByMfa();
  const email = watch("email");

  const onHandleValueHasValid = async () => {
    try {
      setLoading(true);
      const res = await refetchMfaCheck({ email });

      if (res?.resultCode === "00") {
        setRequireMfa(true);
        toast("Tài khoản này có bật MFA, vui lòng nhập mã xác thực", "info");
        return;
      }
    } catch (err: any) {
      console.error("Reset error:", err.message);
      toast("Không thể đặt lại mật khẩu", "error");
    } finally {
      setLoading(false);
    }
  };

  //   const onSubmitSendMfaCode = async () => {
  //     try {
  //       setLoading(true);
  //         // const res = await refetchChangePassword({ email });

  //         if (res?.resultCode === "00") {
  //           setRequireMfa(true);
  //           toast("Tài khoản này có bật MFA, vui lòng nhập mã xác thực", "info");
  //           return;
  //         }

  //     } catch (err: any) {
  //       console.error("Reset error:", err.message);
  //       toast("Không thể đặt lại mật khẩu", "error");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <form>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quên mật khẩu
        </Typography>

        <Input name="email" control={control} placeholder="Email" />

        {requireMfa && (
          <Box sx={{ mt: 2 }}>
            <Typography>MFA Code</Typography>
            <Input
              name="mfaCode"
              control={control}
              placeholder="Nhập MFA code"
            />
          </Box>
        )}

        <Button
          label={loading ? "Đang xử lý..." : "Xác nhận"}
          type="submit"
          onClick={onHandleValueHasValid}
          disabled={loading || !email}
          sx={{ mt: 2 }}
        />
      </form>

      <Box sx={{ mt: 2 }}>
        <a href="/login">Đã có tài khoản? Đăng nhập ngay</a>
      </Box>
    </Box>
  );
};

export default ForgetPassword;
