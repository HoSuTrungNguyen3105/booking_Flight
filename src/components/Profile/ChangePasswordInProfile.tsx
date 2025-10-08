import {
  Box,
  Typography,
  FormControl,
  Button,
  CardContent,
  Divider,
  Avatar,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import { memo, useState } from "react";
import { KeyOutlined, LockOpenOutlined } from "@mui/icons-material";
import VerifyOpt from "../Auth/VerifyOpt";
import { useChangePasswordInProfile } from "../Api/usePostApi";
import InputTextField from "../../common/Input/InputTextField";
import { useAuth } from "../../context/AuthContext";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface FormDataType {
  userId?: number;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface IUserIdNumber {
  onClose: () => void;
  userId: number;
  email: string;
}

const ChangePasswordInProfile = () => {
  const passwordSchema = yup.object().shape({
    currentPassword: yup.string().required("Vui lòng nhập mật khẩu hiện tại"),
    newPassword: yup
      .string()
      .required("Vui lòng nhập mật khẩu mới")
      .min(8, "Mật khẩu phải ít nhất 8 ký tự")
      .matches(/[A-Z]/, "Phải có ít nhất 1 chữ hoa")
      .matches(/[a-z]/, "Phải có ít nhất 1 chữ thường")
      .matches(/[0-9]/, "Phải có ít nhất 1 chữ số")
      .matches(/[^A-Za-z0-9]/, "Phải có ít nhất 1 ký tự đặc biệt"),
    confirmPassword: yup
      .string()
      .required("Vui lòng nhập lại mật khẩu")
      .oneOf([yup.ref("newPassword")], "Mật khẩu xác nhận không khớp"),
  });

  const { refetchChangePassword } = useChangePasswordInProfile();
  //const [userId, setUserId] = useState<number | undefined>(undefined);

  const [verifyOTPcode, setVerifyOTPcode] = useState(false);
  // const [email, setEmail] = useState<string | undefined>(undefined);
  const { user } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataType>({
    resolver: yupResolver(passwordSchema),
  });

  const userId = user?.id;
  const email = user?.email;

  const onSubmit = async (data: FormDataType) => {
    if (!userId) {
      console.error("UserId không hợp lệ");
      return;
    }
    try {
      const response = await refetchChangePassword({ ...data, userId });
      if (response?.resultCode === "00") {
        // onClose();
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
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
      {/* Change password */}
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Đổi mật khẩu
        </Typography>

        <Grid container spacing={4}>
          {/* Current Password */}
          <Grid size={6}>
            <Typography>currentPassword</Typography>
            <FormControl fullWidth>
              <Controller
                control={control}
                name="currentPassword"
                render={({ field }) => (
                  <InputTextField
                    {...field}
                    type="password"
                    showEyeIcon
                    error={!!errors.currentPassword}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                )}
              />
            </FormControl>
          </Grid>

          {/* New Password */}
          <Grid size={6}>
            <Typography>newPassword</Typography>
            <FormControl fullWidth>
              <Controller
                control={control}
                name="newPassword"
                render={({ field }) => (
                  <InputTextField
                    {...field}
                    type="password"
                    showEyeIcon
                    error={!!errors.newPassword}
                    placeholder="Nhập mật khẩu mới"
                  />
                )}
              />
            </FormControl>
          </Grid>

          {/* Confirm New Password */}
          <Grid size={6}>
            <Typography>confirmPassword</Typography>
            <FormControl fullWidth>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <InputTextField
                    {...field}
                    type="password"
                    showEyeIcon
                    error={!!errors.confirmPassword}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                )}
                // {...errors.confirmPassword}
              />
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      {/* Two-factor authentication */}
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <KeyOutlined color="primary" sx={{ mr: 2 }} />
          <Typography variant="h6">Xác thực hai lớp</Typography>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Avatar
            variant="rounded"
            sx={{
              width: 56,
              height: 56,
              color: "common.white",
              bgcolor: user?.mfaEnabledYn === "N" ? "grey.500" : "success.main",
              mb: 2,
            }}
          >
            <LockOpenOutlined sx={{ fontSize: "1.75rem" }} />
          </Avatar>

          {user?.mfaEnabledYn === "N" ? (
            <>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Bạn chưa bật xác thực hai lớp
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                maxWidth={400}
                mx="auto"
              >
                Tăng cường bảo mật bằng cách bật xác thực hai lớp. Khi đăng
                nhập, bạn cần nhập thêm mã OTP ngoài mật khẩu.{" "}
                <a href="#">Tìm hiểu thêm</a>.
              </Typography>
            </>
          ) : (
            <Typography variant="subtitle1" fontWeight={600}>
              Bạn đã bật xác thực hai lớp
            </Typography>
          )}
        </Box>

        {/* Action buttons */}
        <Box sx={{ mt: 6, display: "flex", gap: 2 }}>
          <Button variant="contained" type="submit">
            Lưu thay đổi
          </Button>
          <Button type="reset" variant="outlined" color="secondary">
            Reset
          </Button>
        </Box>
      </CardContent>
    </Box>
  );
};

export default memo(ChangePasswordInProfile);
