import { memo, useCallback, useState } from "react";
import OTPInput from "../../../common/Input/OTPInput";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { EmailProps } from "../../../utils/type";
import { useVerifyOTPCode } from "../../../context/Api/usePostApi";
import MfaSetup from ".";
import { useToast } from "../../../context/ToastContext";
import { ResponseCode } from "../../../utils/response";
import type { AuthType } from "../Login";

const VerifyOpt = ({ email, userId, authType }: EmailProps) => {
  const [otpText, setOtpText] = useState<string>("");
  const { refetchVerifyOTPcode } = useVerifyOTPCode();
  const [hasValidate, sethasValidate] = useState(false);
  const toast = useToast();

  console.log("user", userId, email);

  const handleCheckOTPYn = useCallback(async () => {
    if (typeof otpText !== "string" || otpText.trim() === "") {
      toast("Invalid OTP", "error");
      return;
    }
    try {
      // const typeSaved = localStorage.getItem("stateLogin") as
      //   | "ADMIN"
      //   | "ID,PW"
      //   | null;

      if (!authType) {
        toast("Không xác định được loại đăng nhập", "error");
        return;
      }

      const payload = {
        otp: otpText.trim(),
        userId: String(userId),
        type: authType as AuthType,
      };
      const res = await refetchVerifyOTPcode(payload);

      if (res?.resultCode == ResponseCode.SUCCESS) {
        sethasValidate(true);
      } else {
        toast(res?.resultMessage || "Error", "error");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
    }
  }, [otpText, userId, sethasValidate, refetchVerifyOTPcode, toast]);

  if (hasValidate) {
    return <MfaSetup authType="qrSetup" email={email} />;
  }

  return (
    <Box
      component="div"
      height="30vh"
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
