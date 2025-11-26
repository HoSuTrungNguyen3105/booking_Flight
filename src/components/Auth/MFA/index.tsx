import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import { QrCode2, Security, Login, ArrowBack } from "@mui/icons-material";
import { useToast } from "../../../context/ToastContext";
import InputTextField from "../../../common/Input/InputTextField";
import { useAuth } from "../../../context/AuthContext";
import type { EmailProps } from "../../../utils/type";
import { ResponseCode } from "../../../utils/response";
import {
  useSetUpMfa,
  useSetUpMfaFromAdmin,
  useVerifyMfa,
} from "../../../context/Api/AuthApi";

type MfaState = "initial" | "qrSetup" | "verification" | "login" | "success";

export default function MfaSetup({ email, onClose, authType }: EmailProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [currentState, setCurrentState] = useState<MfaState>("initial");
  const [isLoading, setIsLoading] = useState(false);

  const { refetchVerifyMfa } = useVerifyMfa();
  const { loginWithGGAuthenticator } = useAuth();
  const { refetchSetUpMfa } = useSetUpMfa();
  const { refetchSetUpMfaFromAdmin } = useSetUpMfaFromAdmin();
  const toast = useToast();

  const resetState = () => {
    setCode("");
    setIsLoading(false);
  };

  const fetchQrCode = useCallback(async () => {
    if (!email || !authType) {
      toast("Loi ko co authtype hoac chua nhập email để tạo MFA");
      return;
    }
    try {
      const isAdmin = ["DEV", "ADMIN"].includes(authType);
      console.log("isADMIN", isAdmin);
      const data = isAdmin
        ? await refetchSetUpMfa({ email })
        : await refetchSetUpMfaFromAdmin({ email });

      if (data?.data?.hasVerified === "Y") {
        setCurrentState("login");
      } else if (data?.data?.hasVerified === "N" && data?.data?.qrCodeDataURL) {
        setQrCode(data.data.qrCodeDataURL);
        setCurrentState("qrSetup");
      } else if (data?.resultCode !== ResponseCode.SUCCESS) {
        setCode("");
      }
    } catch (err) {
      setCode("");
    }
  }, [email, authType]);

  useEffect(() => {
    if (authType === "MFA") {
      setCurrentState("login");
      fetchQrCode();
    }
  }, [authType, fetchQrCode]);

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      toast("Vui lòng nhập mã xác thực 6 số");
      return;
    }

    setIsLoading(true);

    try {
      const res = await refetchVerifyMfa({
        email: email ?? "",
        code: code,
      });

      if (res?.resultCode === ResponseCode.SUCCESS) {
        // setCurrentState("success");
        setQrCode(null);
        setCurrentState("login");
        // setCanLoginMfa(true);
        setCode("");
      } else {
        toast(res?.resultMessage || "Mã xác thực không đúng", "error");
        setCode("");
      }
    } catch (err) {
      toast("Lỗi xác thực. Vui lòng thử lại.", "error");
      setCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginMfa = async () => {
    if (!code || code.length !== 6) {
      toast("Vui lòng nhập mã xác thực 6 số");
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginWithGGAuthenticator({
        email: email ?? "",
        code: code,
        authType: authType as string,
      });

      if (res?.resultCode === ResponseCode.SUCCESS) {
        toast("Đăng nhập thành công");
        setQrCode(null);
      } else {
        // toast(res?.resultMessage || "Mã xác thực không đúng", "error");
        setCode("");
      }
    } catch (err) {
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
      {/* {email} */}
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
          <Button variant="contained" onClick={onClose}>
            {" "}
            Return
          </Button>
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
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 400,
            textAlign: "center",
            mx: "auto",
            borderRadius: 3,
          }}
        >
          <Login sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />

          <InputTextField
            value={code}
            onChange={setCode}
            placeholder="000000"
            sx={{ mb: 3 }}
          />

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={onClose}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Trở về
            </Button>

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleLoginMfa}
              disabled={isLoading || code.length !== 6}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Security />
                )
              }
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </Stack>
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
