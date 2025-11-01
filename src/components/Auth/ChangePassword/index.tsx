import { Box, Typography, Stack, FormControl, Button } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import InputTextField from "../../../common/Input/InputTextField";
import { useChangePassword } from "../../../context/Api/usePostApi";
import { memo, useState } from "react";
import VerifyOpt from "../MFA/VerifyOTP";
import type { ChangePasswordProps } from "../../../utils/type";

interface IUserIdNumber {
  onClose: () => void;
  userId: number;
  email: string;
}

const ChangePassword = ({ userId, email, onClose }: IUserIdNumber) => {
  const { refetchChangePassword } = useChangePassword();
  const [verifyOTPcode, setVerifyOTPcode] = useState(false);

  const { control, handleSubmit } = useForm<ChangePasswordProps>({
    defaultValues: {
      userId: userId,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordProps) => {
    try {
      const response = await refetchChangePassword(data);
      if (response?.resultCode === "00") {
        onClose();
        setVerifyOTPcode(true);
      }
    } catch (err) {
      console.error("error:", err);
    }
  };

  if (verifyOTPcode) {
    return <VerifyOpt userId={userId} email={email} />;
  }

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="grey.50"
    >
      <Box
        sx={{
          width: 420,
          p: 4,
          bgcolor: "white",
        }}
      >
        <Stack component="form" spacing={3} onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="subtitle2" component="h6" align="center">
            Set New Password
          </Typography>

          <Typography
            variant="body2"
            component="h6"
            color="grey.500"
            align="center"
          >
            You are currently using a temporary password or your password has{" "}
            <br />
            expired. Please create a new one.
          </Typography>

          {/* New password */}
          <FormControl fullWidth>
            <Typography variant="body1" mb={0.5}>
              New Password
            </Typography>
            <Controller
              control={control}
              name="newPassword"
              render={({ field }) => (
                <InputTextField
                  {...field}
                  showEyeIcon
                  type="password"
                  placeholder="Enter new password"
                />
              )}
            />
          </FormControl>

          {/* Confirm password */}
          <FormControl fullWidth>
            <Typography variant="body1" mb={0.5}>
              Confirm Password
            </Typography>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <InputTextField
                  {...field}
                  showEyeIcon
                  type="password"
                  placeholder="Re-enter password"
                />
              )}
            />
            <Box display="flex" alignItems="flex-start" gap={1} mt={1}>
              <Typography variant="subtitle2" color="error">
                Password must contain a mix of uppercase and lowercase letters,
                <br />
                numbers, and special characters, and be 8–20 characters long.
              </Typography>
            </Box>
          </FormControl>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="contained" type="submit">
              Set Password
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default memo(ChangePassword);
