import { useState } from "react";
import { useLoginByMfa, useSetUpMfa, useVerifyMfa } from "../Api/usePostApi";
import { Box, Button, Typography } from "@mui/material";
// import InputField from "../../common/Input/InputField";
import { useToast } from "../../context/ToastContext";
import InputTextField from "../../common/Input/InputTextField";
import { useAuth } from "../../context/AuthContext";
import type { EmailProps } from "../../utils/type";

export default function MfaSetup({ email, onClose, authType }: EmailProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [loginMfa, setLoginMfaUi] = useState(false);
  const { refetchVerifyMfa } = useVerifyMfa();
  const { loginWithGGAuthenticator } = useAuth();
  const { refetchSetUpMfa } = useSetUpMfa();
  const toast = useToast();
  const [isSetMfa, setIsSetMfa] = useState(false);

  const fetchQrCode = async () => {
    if (!email) {
      toast("Vui lòng nhập email để tạo MFA");
      return;
    }
    try {
      const data = await refetchSetUpMfa({ email });
      if (data?.data?.hasVerified === "Y") {
        setLoginMfaUi(true);
        setIsSetMfa(true);
        setQrCode(null);
      } else if (data?.data?.hasVerified === "N" && data?.data?.qrCodeDataURL) {
        setQrCode(data.data.qrCodeDataURL);
        setLoginMfaUi(false);
        setIsSetMfa(false);
      } else if (data?.resultCode === "09") {
        toast(data?.resultMessage);
      }
    } catch (err) {
      setCode("");
    }
  };

  const handleVerify = async () => {
    if (!code) {
      toast("Vui lòng nhập mã MFA");
      return;
    }
    // if (isSetMfa) {
    //   refetchSetLoginMfa();
    //   return;
    // }
    const res = await refetchVerifyMfa({
      email: email ?? "",
      code: code,
    });

    if (res?.resultCode === "00") {
      setQrCode(null);
      setLoginMfaUi(true);
      setCode("");
    } else {
      toast(res?.resultMessage || "Error");
      setCode("");
    }
  };

  const handleLoginMfa = async () => {
    if (!code) {
      toast("Vui lòng nhập mã MFA");
      return;
    }

    const res = await loginWithGGAuthenticator({
      email: email ?? "",
      code: code,
      authType: authType,
    });

    if (res?.resultCode === "00") {
      toast("Đăng nhập thành công");
      setQrCode(null);
      setLoginMfaUi(true);
    } else {
      // toast(res.resultMessage);
      setQrCode(null);
    }
  };

  return (
    <Box
      sx={{
        // textAlign: "center",
        // justifyContent: "center",
        // mt: 4,

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 3,
        p: 3,
      }}
    >
      <InputTextField
        sx={{ width: "50%" }}
        value={email}
        disabled
        // onChange={(e) => setEmail(e.target.value)}
        placeholder="Nhập email"
      />
      <Button variant="contained" onClick={fetchQrCode}>
        Render QR MFA
      </Button>

      <Button variant="outlined" onClick={onClose}>
        Return to register user then set up MFA
      </Button>

      {qrCode && (
        <Box sx={{ marginTop: 20 }}>
          <Typography>Quét QR code với Google Authenticator:</Typography>
          <Box component="img" src={qrCode} alt="QR Code MFA" />
          <Box>
            <InputTextField
              sx={{ width: "50%" }}
              value={code}
              onChange={(e) => setCode(e)}
            />
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleVerify}>
              Xác thực
            </Button>
          </Box>
        </Box>
      )}

      {loginMfa && (
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            textAlign: "center",
            p: 3,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "background.paper",
          }}
        >
          <Typography variant="h6" gutterBottom color="primary.main">
            Xác thực đăng nhập
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Vui lòng nhập mã xác thực từ ứng dụng Authenticator
          </Typography>

          <InputTextField
            sx={{ width: "50%", padding: "10px" }}
            value={code}
            placeholder="Nhập mã 6 số"
            onChange={(e) => setCode(e)}
          />

          <Button
            variant="contained"
            onClick={handleLoginMfa}
            fullWidth
            size="large"
            disabled={!code || code.length !== 6}
          >
            Đăng nhập
          </Button>
        </Box>
      )}

      {/* {loginMfa && (
        <Box>
          <p>Login MFA </p>
          <InputTextField
            sx={{ width: "20%" }}
            value={code}
            onChange={(e) => setCode(e)}
          />
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleLoginMfa}>
            Xác thực
          </Button>
        </Box>
      )} */}
    </Box>
  );
}
