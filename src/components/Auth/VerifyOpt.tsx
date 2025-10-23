import { memo, useCallback, useState } from "react";
import OTPInput from "../../common/Input/OTPInput";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { EmailProps } from "../../utils/type";
import { useVerifyOTPCode } from "../../context/Api/usePostApi";
import MfaSetup from "./MfaSetup";
import { useToast } from "../../context/ToastContext";

const VerifyOpt = ({ email, userId }: EmailProps) => {
  const [otpText, setOtpText] = useState<string>("");
  const { refetchVerifyOTPcode } = useVerifyOTPCode();
  const [hasValidate, sethasValidate] = useState(false);
  const toast = useToast();

  const handleCheckOTPYn = useCallback(async () => {
    if (typeof otpText !== "string" || otpText.trim() === "") {
      toast("Invalid OTP", "error");
      return;
    }
    try {
      const res = await refetchVerifyOTPcode({
        otp: otpText,
        userId: userId,
      });
      console.log("res", res);
      if (res?.resultCode == "00") {
        sethasValidate(true);
      } else {
        toast("Error", "error");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
    }
  }, [otpText, userId, sethasValidate, refetchVerifyOTPcode, toast]);

  if (hasValidate) {
    return <MfaSetup authType="login" email={email} />;
  }

  return (
    <Box
      component="form"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="background.default"
    >
      <Stack
        sx={{
          width: 420,
          p: 4,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box textAlign="center">
          <Typography variant="h5" fontWeight={600}>
            Xác thực OTP
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vui lòng nhập mã OTP được gửi đến email/sđt cho tài khoản #{email}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center">
          <OTPInput
            value={otpText}
            onChange={setOtpText}
            onComplete={(val) => console.log("Done OTP:", val)}
          />
        </Box>

        <Button
          onClick={handleCheckOTPYn}
          variant="contained"
          size="large"
          sx={{ borderRadius: 2 }}
        >
          Xác nhận
        </Button>
      </Stack>
    </Box>
  );
};

export default memo(VerifyOpt);
