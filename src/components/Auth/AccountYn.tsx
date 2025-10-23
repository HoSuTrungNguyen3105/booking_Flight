import { Box, Button, FormControl, Paper, Typography } from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useCallback, useState } from "react";
import InputTextField from "../../common/Input/InputTextField";
import {
  getUserIdByEmail,
  useSendEmailToVerification,
} from "../../context/Api/usePostApi";
import { useToast } from "../../context/ToastContext";
import ChangePassword from "./ChangePassword";
import VerifyOpt from "./VerifyOpt";

type AccountModePageProps = {
  mode: "verify" | "change";
  onClose?: () => void;
};

const AccountModePage = ({ mode, onClose }: AccountModePageProps) => {
  const { control, handleSubmit } = useForm();
  const email = useWatch({ control, name: "email" });
  const { refetchUserEmailData } = getUserIdByEmail();
  const toast = useToast();

  const { refetchSendEmailToVerification } = useSendEmailToVerification();

  const [verifyOTPcode, setVerifyOTPcode] = useState(false);
  const [hasValidate, setHasValidate] = useState(false);
  const [userId, setUserId] = useState<number | undefined>();

  const handleSubmitEmailValue = useCallback(async () => {
    if (!email) {
      toast("Vui lòng nhập email!");
      return;
    }

    const res = await refetchUserEmailData({ email });

    if (mode === "verify") {
      if (res?.resultCode === "00") {
        const id = res?.data?.userId;
        if (!id) {
          toast("Không tìm thấy tài khoản, vui lòng thử lại!", "error");
          return;
        }
        setVerifyOTPcode(true);
        setUserId(id);
        await refetchSendEmailToVerification({ id });
      } else {
        toast("Email đã tồn tại, vui lòng đăng nhập!", "info");
      }
    }

    if (mode === "change") {
      if (res?.resultCode === "00") {
        setUserId(res?.data?.userId);
        setHasValidate(true);
      } else {
        toast("Không tìm thấy tài khoản!", "error");
      }
    }
  }, [email, refetchUserEmailData, mode, toast]);

  // if (registerUser) {
  //   return (
  //     <Registration email={email} onClose={() => setRegisterUser(false)} />
  //   );
  // }

  if (verifyOTPcode) {
    return <VerifyOpt authType="" userId={userId} email={email} />;
  }

  if (hasValidate && userId) {
    return (
      <ChangePassword
        onClose={onClose || (() => {})}
        email={email}
        userId={userId}
      />
    );
  }

  // --- Form nhập email ---
  return (
    <Box
      component="form"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="background.default"
    >
      <Paper
        elevation={3}
        sx={{
          width: "420px",
          p: 4,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600} textAlign="center" mb={1}>
          {mode === "change" ? "Tìm tài khoản" : "Xác minh tài khoản"}
        </Typography>

        <FormControl fullWidth>
          <Typography variant="body2" color="text.secondary" mb={0.5}>
            Nhập email của bạn
          </Typography>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <InputTextField {...field} placeholder="Nhập email" />
            )}
          />
        </FormControl>

        <Button
          onClick={handleSubmit(handleSubmitEmailValue)}
          variant="contained"
          sx={{ mt: 1 }}
        >
          Tiếp tục
        </Button>
      </Paper>
    </Box>
  );
};

export default AccountModePage;
