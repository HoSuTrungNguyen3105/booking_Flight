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
import VerifyOpt from "../../Auth/components/VerifyOpt";
import { useChangePassword } from "../../Api/usePostApi";
import InputTextField from "../../../common/Input/InputTextField";
import { useAuth } from "../../../context/AuthContext";

interface FormDataType {
  userId: number;
  newPassword: string;
  confirmPassword: string;
}

interface IUserIdNumber {
  onClose: () => void;
  userId: number;
  email: string;
}

const ChangePasswordInProfile = () => {
  const { refetchChangePassword } = useChangePassword();
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [verifyOTPcode, setVerifyOTPcode] = useState(false);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const { user } = useAuth();
  const { control, handleSubmit } = useForm<FormDataType>({
    defaultValues: {
      userId: userId,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      const response = await refetchChangePassword(data);
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
    //     <Box
    //       height="100vh"
    //       display="flex"
    //       justifyContent="center"
    //       alignItems="center"
    //       bgcolor="grey.50"
    //     >
    //       <Box
    //         sx={{
    //           width: 420,
    //           p: 4,
    //           bgcolor: "white",
    //         }}
    //       >
    //         <Stack component="form" spacing={3} onSubmit={handleSubmit(onSubmit)}>
    //           <Typography variant="subtitle2" component="h6" align="center">
    //             비밀번호 설정
    //           </Typography>

    //           <Typography
    //             variant="body2"
    //             component="h6"
    //             color="grey.500"
    //             align="center"
    //           >
    //             임시 패스워드 상태거나 비밀번호 유효기간이 만료되어 <br />
    //             신규 비밀번호를 생성합니다.
    //           </Typography>

    //           {/* Nhập mật khẩu */}
    //           <FormControl fullWidth>
    //             <Typography variant="body1" mb={0.5}>
    //               비밀번호
    //             </Typography>
    //             <Controller
    //               control={control}
    //               name="newPassword"
    //               render={({ field }) => (
    //                 <InputTextField
    //                   {...field}
    //                   type="password"
    //                   placeholder="Mật khẩu mới"
    //                 />
    //               )}
    //             />
    //           </FormControl>

    //           {/* Nhập lại mật khẩu */}
    //           <FormControl fullWidth>
    //             <Typography variant="body1" mb={0.5}>
    //               비밀번호 확인
    //             </Typography>
    //             <Controller
    //               control={control}
    //               name="confirmPassword"
    //               render={({ field }) => (
    //                 <InputTextField
    //                   {...field}
    //                   type="password"
    //                   placeholder="Xác nhận mật khẩu"
    //                 />
    //               )}
    //             />
    //             <Box display="flex" alignItems="flex-start" gap={1} mt={1}>
    //               {/* <img src="/assets/icons/error.svg" alt="error" /> */}
    //               <Typography variant="subtitle2" color="error">
    //                 비밀번호는 영문 대/소문자, 숫자, 특수문자 조합 <br />
    //                 8자 이상 ~ 20자 이하
    //               </Typography>
    //             </Box>
    //           </FormControl>
    //           <Box
    //             sx={{
    //               display: "flex",
    //               justifyContent: "flex-end",
    //             }}
    //           >
    //             <Button variant="contained" type="submit">
    //               설정
    //             </Button>
    //           </Box>

    //           <Typography
    //             variant="body2"
    //             color="text.secondary"
    //             textAlign="center"
    //             mt={3}
    //           >
    //             Đã có tài khoản?{" "}
    //             <MuiLink href="/login" underline="hover" color="primary">
    //               Đăng nhập tại đây
    //             </MuiLink>
    //           </Typography>
    //         </Stack>
    //       </Box>
    //     </Box>
    //   );
    // };

    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <CardContent sx={{ paddingBottom: 0 }}>
        <Grid container spacing={5}>
          <Grid size={3}>
            <Grid container spacing={5}>
              <Grid size={12} sx={{ marginTop: 4.75 }}>
                <FormControl fullWidth>
                  <Typography>Current Password</Typography>
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
                  {/* <InputTextField
                    label='Current Password'
                    value={values.currentPassword}
                    type={ 'password'}
                    onChange={handleCurrentPasswordChange('currentPassword')}
                  /> */}
                </FormControl>
              </Grid>

              <Grid size={12} sx={{ marginTop: 6 }}>
                <FormControl fullWidth>
                  <Typography>New Password</Typography>
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
                  {/* <InputTextField
                    value={values.newPassword}
                    onChange={handleNewPasswordChange('newPassword')}
                    type={'password'}
                    
                  /> */}
                </FormControl>
              </Grid>

              <Grid size={12}>
                <FormControl fullWidth>
                  <Typography>Confirm New Password</Typography>
                  {/* <InputTextField
                    label='Confirm New Password'
                    value={values.confirmNewPassword}
                    type={ 'password'}
                    onChange={handleConfirmNewPasswordChange('confirmNewPassword')}
                  /> */}
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
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ margin: 0 }} />

      <CardContent>
        <Box sx={{ mt: 1.75, display: "flex", alignItems: "center" }}>
          <KeyOutlined sx={{ marginRight: 3 }} />
          <Typography variant="h6">Two-factor authentication</Typography>
        </Box>

        <Box sx={{ mt: 5.75, display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              maxWidth: 368,
              display: "flex",
              textAlign: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Avatar
              variant="rounded"
              sx={{
                width: 48,
                height: 48,
                color: "common.white",
                backgroundColor: "primary.main",
              }}
            >
              <LockOpenOutlined sx={{ fontSize: "1.75rem" }} />
            </Avatar>

            {user?.mfaEnabledYn === "N" ? (
              <>
                <Typography
                  sx={{ fontWeight: 600, marginTop: 3.5, marginBottom: 3.5 }}
                >
                  Two factor authentication is not enabled yet.
                </Typography>
                <Typography variant="body2">
                  Two-factor authentication adds an additional layer of security
                  to your account by requiring more than just a password to log
                  in. Learn more.
                </Typography>
              </>
            ) : (
              <Typography
                sx={{ fontWeight: 600, marginTop: 3.5, marginBottom: 3.5 }}
              >
                Two factor authentication is enabled.
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 11 }}>
          <Button variant="contained" type="submit" sx={{ marginRight: 3.5 }}>
            Save Changes
          </Button>
          <Button
            type="reset"
            variant="outlined"
            color="secondary"
            // onClick={() => setValues({ ...values, currentPassword: '', newPassword: '', confirmNewPassword: '' })}
          >
            Reset
          </Button>
        </Box>
      </CardContent>
    </Box>
  );
};

export default memo(ChangePasswordInProfile);
