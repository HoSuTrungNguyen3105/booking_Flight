import { Box, Button, FormControl, Paper, Typography } from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import InputTextField from "../../../common/Input/InputTextField";
import ChangePassword from "../ChangePassword";
import { getUserIdByEmail } from "../../Api/usePostApi";
import { useCallback, useState } from "react";
import { useToast } from "../../../context/ToastContext";

interface FindAccountProps {
  onClose: () => void;
}

const FindAccount = ({ onClose }: FindAccountProps) => {
  const { control } = useForm();
  const [hasValidate, setHasValidate] = useState(false);
  const [userId, setUserId] = useState<number | undefined>();
  const { refetchUserEmailData } = getUserIdByEmail();
  const toast = useToast();
  const email = useWatch({ control, name: "email" });
  const handleSubmitEmailValue = useCallback(async () => {
    if (!email) return;
    const res = await refetchUserEmailData({ email });
    if (res?.resultCode === "00") {
      setUserId(res?.data?.userId);
      setHasValidate(true);
    } else {
      toast(
        (res?.resultMessage as string) || "Error while connect to server",
        "info"
      );
    }
  }, [email, refetchUserEmailData]);

  if (hasValidate && userId) {
    return <ChangePassword onClose={onClose} email={email} userId={userId} />;
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
          onClick={handleSubmitEmailValue}
          variant="contained"
          sx={{ mt: 1 }}
        >
          Tiếp tục
        </Button>
      </Paper>
    </Box>
  );
};

export default FindAccount;
