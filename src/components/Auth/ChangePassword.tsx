import { Box, Typography, Stack, Link as MuiLink } from "@mui/material";
import { Button } from "../../common/Button/Button";
import { Controller, useForm } from "react-hook-form";
import InputTextField from "../../common/Input/InputTextField";
import { useChangePassword } from "../Api/usePostApi";

interface FormDataType {
  userId: number;
  newPassword: string;
  confirmPassword: string;
}

interface IUserIdNumber {
  onClose: () => void;
  userId: number;
}

const ChangePassword = ({ userId, onClose }: IUserIdNumber) => {
  const { refetchChangePassword } = useChangePassword();
  const { control, handleSubmit } = useForm<FormDataType>({
    defaultValues: {
      userId: userId,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      console.log("data:", data);
      const response = await refetchChangePassword(data);
      if (response?.resultCode === "00") {
        onClose();
      }
    } catch (err: any) {
      console.error("error:", err.message);
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="grey.50"
    >
      <Box
        sx={(theme) => ({
          width: 420,
          p: 4,
          bgcolor: "white",
          borderRadius: 3,
          boxShadow: theme.shadows[3],
        })}
      >
        <Typography variant="h5" fontWeight={600} mb={1} textAlign="center">
          Đặt lại mật khẩu
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          mb={3}
          textAlign="center"
        >
          Nhập mật khẩu mới của bạn và xác nhận để tiếp tục.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            <Controller
              control={control}
              name="newPassword"
              render={({ field }) => (
                <InputTextField
                  {...field}
                  type="password"
                  placeholder="Mật khẩu mới"
                />
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <InputTextField
                  {...field}
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                />
              )}
            />
            <Button label="Đổi mật khẩu" type="submit" sx={{ width: "100%" }} />
          </Stack>
        </form>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mt={3}
        >
          Đã có tài khoản?{" "}
          <MuiLink href="/login" underline="hover" color="primary">
            Đăng nhập tại đây
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default ChangePassword;
