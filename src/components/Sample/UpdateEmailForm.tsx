import { useState } from "react";
import { Box, Button, TextField, Typography, Stack } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import {
  useChangeEmailPassenger,
  useVerifyOtpToAccessEmail,
} from "../../context/Api/usePostApi";
import { ResponseCode } from "../../utils/response";
import OTPInput from "../../common/Input/OTPInput";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import InputTextField from "../../common/Input/InputTextField";

export const UpdateEmailForm = () => {
  const { passenger } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { refetchChangeEmailPassenger } = useChangeEmailPassenger();
  const { refetchVerifyOtp } = useVerifyOtpToAccessEmail();

  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);

  const handleChangeEmail = async () => {
    if (!newEmail || !passenger?.id) return;
    setLoading(true);
    try {
      const res = await refetchChangeEmailPassenger({
        // email: passenger.email,
        id: passenger.id,
        newEmail,
      });
      if (res?.resultCode === ResponseCode.SUCCESS) {
        setStep("otp");
        toast(res.resultMessage);
      } else {
        toast(res?.resultMessage || "Có lỗi xảy ra");
      }
    } catch (err: any) {
      toast(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !passenger?.id) return;
    setLoading(true);
    try {
      const res = await refetchVerifyOtp({ id: passenger.id, otp });
      if (res?.resultCode === ResponseCode.SUCCESS) {
        toast(res.resultMessage);
        // setStep("email");
        navigate("/profile");
        setOtp("");
      } else {
        toast(res?.resultMessage || "OTP không hợp lệ");
      }
    } catch (err: any) {
      toast(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "0 auto",
        padding: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h6">Cập nhật Email</Typography>

      {step === "email" && (
        <Stack spacing={2}>
          <InputTextField
            placeholder="Old Email"
            // type="email"
            value={passenger?.email}
            disabled
          />
          <TextField
            label="New Email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleChangeEmail}
            disabled={loading}
          >
            Gửi yêu cầu
          </Button>
        </Stack>
      )}

      {step === "otp" && (
        <Stack spacing={2}>
          <OTPInput
            // label="Nhập OTP"
            value={otp}
            onChange={(e) => setOtp(e)}
            // fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleVerifyOtp}
            disabled={loading}
          >
            Xác nhận OTP
          </Button>
        </Stack>
      )}
    </Box>
  );
};
