import {
  Box,
  Typography,
  Stack,
  Link as MuiLink,
  FormControl,
  Button,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import InputTextField from "../../common/Input/InputTextField";
import { useChangePassword } from "../Api/usePostApi";
import { useGetUserId } from "../Api/useGetApi";
import { useState } from "react";

interface FormDataType {
  userId: number;
  newPassword: string;
  confirmPassword: string;
  email: string;
}

interface IUserIdNumber {
  onClose: () => void;
  userId: number;
}

const ChangePassword = ({ userId, onClose }: IUserIdNumber) => {
  const { refetchChangePassword } = useChangePassword();
  const { refetchUserIdData } = useGetUserId();
  const [hasAccount, setHasAccount] = useState(false);
  const { control, handleSubmit, getValues } = useForm<FormDataType>({
    defaultValues: {
      userId: userId,
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const findUserByEmail = async (email: string) => {
    try {
      const response = await refetchUserIdData({ email });
      console.log("getValues", response);
      if (response?.resultCode === "00") {
        setHasAccount(true);
      }
    } catch (err: any) {
      console.error("error:", err.message);
    }
  };

  const onSubmit = async (data: FormDataType) => {
    try {
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
        sx={{
          width: 420,
          p: 4,
          bgcolor: "white",
        }}
      >
        <Stack component="form" spacing={3} onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="subtitle2" component="h6" align="center">
            비밀번호 설정
          </Typography>

          <Typography
            variant="body2"
            component="h6"
            color="grey.500"
            align="center"
          >
            임시 패스워드 상태거나 비밀번호 유효기간이 만료되어 <br />
            신규 비밀번호를 생성합니다.
          </Typography>

          {/* Nếu chưa có userId thì nhập email */}
          {!userId && (
            <FormControl fullWidth>
              <Typography variant="body1" mb={0.5}>
                Email
              </Typography>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <InputTextField {...field} placeholder="Nhập email của bạn" />
                )}
              />
            </FormControl>
          )}

          {hasAccount && (
            <>
              <FormControl fullWidth>
                <Typography variant="body1" mb={0.5}>
                  비밀번호
                </Typography>
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
              </FormControl>

              <FormControl fullWidth>
                <Typography variant="body1" mb={0.5}>
                  비밀번호 확인
                </Typography>
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
                <Box display="flex" alignItems="flex-start" gap={1} mt={1}>
                  {/* <img src="/assets/icons/error.svg" alt="error" /> */}
                  <Typography variant="subtitle2" color="error">
                    비밀번호는 영문 대/소문자, 숫자, 특수문자 조합 <br />
                    8자 이상 ~ 20자 이하
                  </Typography>
                </Box>
              </FormControl>
            </>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {!userId ? (
              <Button
                variant="contained"
                type="button"
                onClick={() => findUserByEmail(getValues("email"))}
              >
                Tìm tài khoản
              </Button>
            ) : (
              <Button variant="contained" type="submit">
                Đổi mật khẩu
              </Button>
            )}
          </Box>

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
        </Stack>
      </Box>
    </Box>
  );
};

export default ChangePassword;
