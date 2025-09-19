import { useState } from "react";
import { useLoginByMfa, useSetUpMfa, useVerifyMfa } from "../Api/usePostApi";
import { Box, Button, Typography } from "@mui/material";
import InputField from "../../common/Input/InputField";
import { useToast } from "../../context/ToastContext";
import InputTextField from "../../common/Input/InputTextField";
import { useAuth } from "../../context/AuthContext";
import type { EmailProps } from "../../utils/type";

export default function MfaSetup({ email }: EmailProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  // const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState("");
  const [loginMfa, setLoginMfaUi] = useState(false);
  const { refetchSetLoginMfa } = useLoginByMfa();
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
      toast("Có lỗi khi tạo MFA");
      setCode("");
    }
  };

  const handleVerify = async () => {
    if (!code) {
      toast("Vui lòng nhập mã MFA");
      return;
    }
    if (isSetMfa) {
      refetchSetLoginMfa();
      return;
    }
    const res = await refetchVerifyMfa({
      email: email ?? "",
      code: code,
    });

    if (res?.resultCode === "00") {
      setQrCode(null);
      setLoginMfaUi(true);
      setCode("");
    } else {
      toast("Sai mã MFA, thử lại!");
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
    });

    if (res?.resultCode === "00") {
      toast("Đăng nhập thành công");
      setQrCode(null);
      setLoginMfaUi(true);
    } else if (res.requireUnlock) {
    } else {
      toast("Sai mã MFA, thử lại!");
    }
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        justifyContent: "center",
        mt: 4,
      }}
    >
      <InputField
        sx={{ width: "50%" }}
        value={email}
        disabled
        // onChange={(e) => setEmail(e.target.value)}
        placeholder="Nhập email"
      />
      <Button variant="contained" onClick={fetchQrCode}>
        Tạo QR MFA
      </Button>

      {qrCode && (
        <Box sx={{ marginTop: 20 }}>
          <Typography>Quét QR code với Google Authenticator:</Typography>
          <Box component="img" src={qrCode} alt="QR Code MFA" />
          <Box>
            <InputTextField
              sx={{ width: "20%" }}
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
      )}
    </Box>
  );
}
