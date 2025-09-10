import { Box, Button, FormControl, Paper, Typography } from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useCallback, useState } from "react";
import Registration from "./Registration";
import InputTextField from "../../common/Input/InputTextField";
import { useToast } from "../../context/ToastContext";
import { getUserIdByEmail } from "../Api/usePostApi";

const AccountYn = () => {
  const { control, handleSubmit } = useForm();
  const [registerUser, setRegisterUser] = useState(false);
  const { refetchUserEmailData } = getUserIdByEmail();
  const toast = useToast();
  const email = useWatch({ control, name: "email" });
  const handleSubmitEmailValue = useCallback(async () => {
    if (!email) return;
    const res = await refetchUserEmailData({ email });
    if (res?.resultCode !== "00") {
      setRegisterUser(true);
    } else {
      toast(res?.resultMessage as string, "info");
    }
  }, [email, refetchUserEmailData]);

  if (registerUser) {
    return (
      <Registration email={email} onClose={() => setRegisterUser(false)} />
    );
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
          Tìm tài khoản
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

export default AccountYn;
