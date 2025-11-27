import { memo, useCallback, useState } from "react";
import OTPInput from "../../../common/Input/OTPInput";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { EmailProps } from "../../../utils/type";
import MfaSetup from ".";
import { useToast } from "../../../context/ToastContext";
import { ResponseCode } from "../../../utils/response";
import type { AuthType } from "../Login";
import { useVerifyOTPCode } from "../../../context/Api/AuthApi";
import theme from "../../../scss/theme";
import { useSendEmailToVerification } from "../../../context/Api/UserApi";

const VerifyOpt = ({ email, userId, authType }: EmailProps) => {
  const [otpText, setOtpText] = useState<string>("");
  const { refetchVerifyOTPcode, loadingVerifyOTP } = useVerifyOTPCode();
  const [hasValidate, sethasValidate] = useState(false);
  const toast = useToast();
  const { refetchSendEmailToVerification } = useSendEmailToVerification();

  const handleCheckOTPYn = useCallback(async () => {
    if (typeof otpText !== "string" || otpText.trim() === "") {
      toast("Invalid OTP", "error");
      return;
    }
    try {
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

  const handleResendOTP = useCallback(async () => {
    const res = await refetchSendEmailToVerification({ id: Number(userId) });
    if (res?.resultCode === ResponseCode.SUCCESS) {
      toast(res.resultMessage || "Success", "success");
    }
  }, [toast, userId, refetchSendEmailToVerification]);

  if (hasValidate) {
    return <MfaSetup state="qrSetup" authType={authType} email={email} />;
  }

  return (
    <Box
      component="div"
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="background.default"
      py={4}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "30rem",
          mx: "auto",
          border: `1px solid ${theme.palette.grey[200]}`,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: theme.shadows[3],
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.grey[50],
            py: 3,
            px: 4,
            borderBottom: `1px solid ${theme.palette.grey[200]}`,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            color="primary.main"
            gutterBottom
          >
            Xác thực OTP
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            Vui lòng nhập mã OTP được gửi đến email/sđt cho tài khoản <br />
            <Typography component="span" fontWeight={600} color="text.primary">
              {email}
            </Typography>
          </Typography>
        </Box>

        <Stack spacing={3} sx={{ p: 4 }}>
          <Box>
            <OTPInput
              value={otpText}
              onChange={setOtpText}
              onComplete={(val) => console.log("Done OTP:", val)}
            />
            <Box display="flex" justifyContent="flex-end" mt={1}>
              <Button
                variant="text"
                size="small"
                onClick={handleResendOTP}
                sx={{ textTransform: "none", fontSize: "0.875rem" }}
              >
                Gửi lại mã?
              </Button>
            </Box>
          </Box>

          <Button
            onClick={handleCheckOTPYn}
            variant="contained"
            size="large"
            fullWidth
            disabled={loadingVerifyOTP}
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            {loadingVerifyOTP ? "Đang xác thực..." : "Xác nhận"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default memo(VerifyOpt);
