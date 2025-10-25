import { memo, useCallback, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useToast } from "../../context/ToastContext";
import InputTextField from "../../common/Input/InputTextField";
import { useForgotPassword } from "../../context/Api/usePostApi";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { refetchForgotPassword } = useForgotPassword();
  const [email, setEmail] = useState<string>("");

  const returnPage = useCallback(() => {
    navigate("/init/loginPage");
  }, [navigate]);

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await refetchForgotPassword({ email });
      if (res?.resultCode === "00") {
        toast(res.resultMessage, "info");
        returnPage();
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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Box component="form" onSubmit={handleSubmitForm}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quên mật khẩu
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            gap: 1,
            mt: 1,
            mb: 1,
          }}
        >
          <InputTextField
            name="email"
            placeholder="Nhập email của bạn"
            isEmail
            value={email}
            onChange={(e) => setEmail(e)}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !email}
            sx={{
              px: 3,
              py: 1,
              width: "10rem",
              height: "5vh",
            }}
          >
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </Box>
        <Button variant="contained" size="large" onClick={returnPage}>
          Return
        </Button>
      </Box>
    </Box>
  );
};

export default memo(ForgetPassword);
