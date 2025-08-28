import { useEffect, useState } from "react";
import { useLoginByMfa, useSetUpMfa, useVerifyMfa } from "../Api/usePostApi";
import { Box, Button } from "@mui/material";
import InputField from "../../common/Input/InputField";
import { useToast } from "../../context/ToastContext";
import InputTextField from "../../common/Input/InputTextField";
import { useAuth } from "../../context/AuthContext";

export default function MfaSetup() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState("");
  const [loginMfa, setLoginMfaUi] = useState(false);
  const { setLoginMfa, refetchSetLoginMfa } = useLoginByMfa();
  const { refetchVerifyMfa } = useVerifyMfa();
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
        // Nếu MFA đã được kích hoạt
        setLoginMfaUi(true);
        setIsSetMfa(true);
        setQrCode(null);
        return;
      } else if (data?.data?.hasVerified === "N" && data?.data?.qrCodeDataURL) {
        // MFA chưa bật, tạo QR code để user quét
        setQrCode(data.data.qrCodeDataURL);
        setLoginMfaUi(false);
        setIsSetMfa(false);
      }
    } catch (err) {
      toast("Có lỗi khi tạo MFA");
    }
  };

  useEffect(() => {
    if (code.length > 6) {
      toast("Mã MFA chỉ gồm 6 chữ số");
    }
  }, [code]);

  const handleVerify = async () => {
    if (!code) {
      toast("Vui lòng nhập mã MFA");
      return;
    }
    if (isSetMfa) {
      refetchSetLoginMfa();
      return;
    }
    // let res = "09";
    const res = await refetchVerifyMfa({
      email,
      code: code,
    });
    if (res?.resultCode === "00") {
      // toast("Đăng nhập thành công 🎉");
      setQrCode(null);
      setLoginMfaUi(true);
    } else {
      toast("Sai mã MFA, thử lại!");
    }
  };

  const handleLoginMfa = async () => {
    if (!code) {
      toast("Vui lòng nhập mã MFA");
      return;
    }
    // let res = "09";
    const res = await refetchVerifyMfa({
      email,
      code: code,
    });

    if (res?.resultCode === "00") {
      toast("Đăng nhập thành công 🎉");
      setQrCode(null);
      setLoginMfaUi(true);
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
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Nhập email"
      />
      <Button variant="contained" onClick={fetchQrCode}>
        Tạo QR MFA
      </Button>

      {qrCode && (
        <div style={{ marginTop: 20 }}>
          <p>Quét QR code với Google Authenticator:</p>
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
        </div>
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
