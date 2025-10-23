import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from "@mui/material";
import {
  QrCode2,
  Security,
  Login,
  ArrowBack,
  VerifiedUser,
} from "@mui/icons-material";
import { useSetUpMfa, useVerifyMfa } from "../../context/Api/usePostApi";
import { useToast } from "../../context/ToastContext";
import InputTextField from "../../common/Input/InputTextField";
import { useAuth } from "../../context/AuthContext";
import type { EmailProps } from "../../utils/type";

type MfaState = "initial" | "qrSetup" | "verification" | "login" | "success";

export default function MfaSetup({ email, onClose, authType }: EmailProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [currentState, setCurrentState] = useState<MfaState>("initial");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { refetchVerifyMfa } = useVerifyMfa();
  const { loginWithGGAuthenticator } = useAuth();
  const { refetchSetUpMfa } = useSetUpMfa();
  const toast = useToast();
  const [isSetMfa, setIsSetMfa] = useState(false);
  const [canLoginMfa, setCanLoginMfa] = useState(false);

  const resetState = () => {
    setCode("");
    setError(null);
    setIsLoading(false);
  };

  // const fetchQrCode = async () => {
  //   if (!email) {
  //     toast("Vui lòng nhập email để tạo MFA");
  //     return;
  //   }

  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     const data = await refetchSetUpMfa({ email });

  //     if (data?.data?.hasVerified === "Y") {
  //       setCurrentState("login");
  //       setQrCode(null);
  //       toast("Tài khoản đã được thiết lập MFA. Vui lòng đăng nhập.");
  //     } else if (data?.data?.hasVerified === "N" && data?.data?.qrCodeDataURL) {
  //       setQrCode(data.data.qrCodeDataURL);
  //       setCurrentState("qrSetup");
  //       toast("QR code đã được tạo. Vui lòng quét mã và xác thực.");
  //     } else if (data?.resultCode === "09") {
  //       setError(data?.resultMessage || "Có lỗi xảy ra khi tạo QR code");
  //       toast(data?.resultMessage);
  //     } else {
  //       setError("Không thể tạo QR code. Vui lòng thử lại.");
  //     }
  //   } catch (err) {
  //     setError("Lỗi kết nối. Vui lòng thử lại.");
  //     toast("Lỗi kết nối đến server");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchQrCode = async () => {
    if (!email) {
      toast("Vui lòng nhập email để tạo MFA");
      return;
    }
    try {
      const data = await refetchSetUpMfa({ email });
      if (data?.data?.hasVerified === "Y") {
        setCurrentState("login");
        setCanLoginMfa(true);
        setIsSetMfa(true);
        setQrCode(null);
      } else if (data?.data?.hasVerified === "N" && data?.data?.qrCodeDataURL) {
        setQrCode(data.data.qrCodeDataURL);
        setCanLoginMfa(false);
        setIsSetMfa(false);
      } else if (data?.resultCode === "09") {
        toast(data?.resultMessage);
      }
    } catch (err) {
      setCode("");
    }
  };

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      setError("Vui lòng nhập mã xác thực 6 số");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await refetchVerifyMfa({
        email: email ?? "",
        code: code,
      });

      if (res?.resultCode === "00") {
        // setCurrentState("success");
        setQrCode(null);
        setCanLoginMfa(true);
        setCode("");
      } else {
        setError(res?.resultMessage || "Mã xác thực không đúng");
        setCode("");
      }
    } catch (err) {
      setError("Lỗi xác thực. Vui lòng thử lại.");
      setCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginMfa = async () => {
    if (!code || code.length !== 6) {
      setError("Vui lòng nhập mã xác thực 6 số");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await loginWithGGAuthenticator({
        email: email ?? "",
        code: code,
        authType: authType as string,
      });

      if (res?.resultCode === "00") {
        // setCurrentState("success");
        // toast("Đăng nhập thành công!");
        // You might want to call onClose here or redirect
        toast("Đăng nhập thành công");
        setQrCode(null);
        setCanLoginMfa(true);
      } else {
        setError(res?.resultMessage || "Mã xác thực không đúng");
        setCode("");
      }
    } catch (err) {
      setError("Lỗi đăng nhập. Vui lòng thử lại.");
      setCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    resetState();
    setCurrentState("initial");
    setQrCode(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "auto",
        gap: 3,
        p: 3,
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Security sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
        {/* <Typography
          variant="h4"
          fontWeight="bold"
          color="primary.main"
          gutterBottom
        >
          Bảo mật đa nhân tố (MFA)
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {currentState === "initial" &&
            "Thiết lập xác thực 2 bước để bảo vệ tài khoản"}
          {currentState === "qrSetup" &&
            "Quét mã QR để thiết lập ứng dụng xác thực"}
          {currentState === "verification" && "Xác thực mã từ ứng dụng"}
          {currentState === "login" && "Nhập mã xác thực để đăng nhập"}
          {currentState === "success" && "Thiết lập thành công!"}
        </Typography> */}
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ width: "100%", maxWidth: 400 }}>
          {error}
        </Alert>
      )}

      {/* Initial State */}
      {currentState === "initial" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxWidth: 400,
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={isLoading ? <CircularProgress size={20} /> : <QrCode2 />}
            onClick={fetchQrCode}
            disabled={isLoading}
            sx={{ py: 1.5 }}
          >
            {isLoading ? "Đang tạo QR code..." : "Tạo QR Code MFA"}
          </Button>

          <Button
            variant="outlined"
            onClick={onClose}
            startIcon={<ArrowBack />}
            sx={{ py: 1.5 }}
          >
            Quay lại đăng ký
          </Button>
        </Box>
      )}

      {/* QR Setup State */}
      {currentState === "qrSetup" && qrCode && (
        <Paper
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 400,
            textAlign: "center",
          }}
        >
          {/* <Typography variant="h6" gutterBottom fontWeight="bold">
            Quét mã QR
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Mở ứng dụng Google Authenticator và quét mã QR bên dưới
          </Typography> */}

          <Box
            component="img"
            src={qrCode}
            alt="QR Code MFA"
            sx={{
              width: 200,
              height: 200,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              mb: 3,
            }}
          />

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              hoặc nhập mã thủ công
            </Typography>
          </Divider>

          <InputTextField
            value={code}
            onChange={setCode}
            placeholder="Nhập mã xác thực 6 số"
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={isLoading}
              sx={{ flex: 1 }}
            >
              Quay lại
            </Button>
            <Button
              variant="contained"
              onClick={handleVerify}
              disabled={isLoading || code.length !== 6}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
              sx={{ flex: 1 }}
            >
              {isLoading ? "Đang xác thực..." : "Xác thực"}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Login State */}
      {currentState === "login" && (
        <Paper
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 400,
            textAlign: "center",
          }}
        >
          <Login sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />

          {/* <Typography variant="h6" gutterBottom fontWeight="bold">
            Xác thực đăng nhập
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Mở ứng dụng Authenticator và nhập mã 6 số
          </Typography> */}

          <InputTextField
            value={code}
            onChange={setCode}
            placeholder="000000"
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            size="large"
            onClick={handleLoginMfa}
            disabled={isLoading || code.length !== 6}
            startIcon={
              isLoading ? <CircularProgress size={20} /> : <Security />
            }
            fullWidth
            sx={{ py: 1.5 }}
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </Paper>
      )}

      {/* Success State */}
      {/* {currentState === "success" && (
        <Paper
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 400,
            textAlign: "center",
          }}
        >
          <VerifiedUser sx={{ fontSize: 64, color: "success.main", mb: 2 }} />

          <Typography
            variant="h5"
            gutterBottom
            fontWeight="bold"
            color="success.main"
          >
            Thành công!
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {currentState === "success" &&
              "Thiết lập MFA đã hoàn tất. Tài khoản của bạn đã được bảo vệ."}
          </Typography>

          <Button
            variant="contained"
            onClick={onClose}
            size="large"
            sx={{ py: 1.5, px: 4 }}
          >
            Hoàn tất
          </Button>
        </Paper>
      )} */}
    </Box>
  );
}
