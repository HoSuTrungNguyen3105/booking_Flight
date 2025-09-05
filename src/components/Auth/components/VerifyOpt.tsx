import { useCallback, useState } from "react";
import OTPInput from "../../User/OTPInput";
import { Box, Button, Typography } from "@mui/material";
import type { EmailProps } from "../../../utils/type";
import { useVerifyOTPCode } from "../../Api/usePostApi";
import MfaSetup from "../MFA";
import { useToast } from "../../../context/ToastContext";

const VerifyOpt = ({ email, userId }: EmailProps) => {
  const [otpText, setOtpText] = useState<string>("");
  const { refetchVerifyOTPcode } = useVerifyOTPCode();
  const [hasValidate, sethasValidate] = useState(false);
  const toast = useToast();
  const handleCheckOTPYn = useCallback(async () => {
    if (typeof otpText !== "string" || otpText.trim() === "") {
      toast("Invalid OTP", "error"); // Hoặc một thông báo lỗi phù hợp hơn
      return; // Dừng hàm nếu OTP không hợp lệ
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
  }, [otpText, userId, sethasValidate, refetchVerifyOTPcode, toast]); // Đảm bảo các dependencies được khai báo đúng

  if (hasValidate) {
    return <MfaSetup userId={userId} email={email} />;
  }

  return (
    <Box
      component="form"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        sx={(theme) => ({
          width: "456px",
          mx: "auto",
          border: `1px solid ${theme.palette.grey[200]}`,
        })}
      >
        <Box
          sx={(theme) => ({
            backgroundColor: theme.palette.grey[50],
            py: 2,
            borderBottom: `1px solid ${theme.palette.grey[200]}`,
          })}
        >
          <Typography variant="h4" component="h4" align="center">
            Service {userId}
          </Typography>
        </Box>
        <Box
          sx={(theme) => ({
            backgroundColor: theme.palette.grey[50],
            py: 2,
            borderBottom: `1px solid ${theme.palette.grey[200]}`,
          })}
        >
          <OTPInput
            value={otpText}
            onChange={setOtpText}
            onComplete={(val) => console.log("Done OTP:", val)}
          />
        </Box>
        <Box>
          <Button onClick={handleCheckOTPYn}>Confirm</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default VerifyOpt;
