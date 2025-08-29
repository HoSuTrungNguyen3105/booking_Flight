import { Box, FormControl, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Button } from "../../common/Button/Button";
import InputField from "../../common/Input/InputField";
import { useAuth } from "../../context/AuthContext";
import { Controller, useForm } from "react-hook-form";
import InputTextField from "../../common/Input/InputTextField";
import MfaSetup from "./MFA";
import ChangePassword from "./ChangePassword";
import SelectDropdown from "../../common/Dropdown/SelectDropdown";
import RequestUnlock from "./RequestUnlock";
import Registration from "./Registration";

interface ILoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

type AuthType = "ID,PW" | "SSO" | "DEV" | "MFA";

export const LoginPage: React.FC = () => {
  const AUTH_TYPE_OPTIONS: { label: string; value: AuthType }[] = [
    { label: "ID,PW", value: "ID,PW" },
    { label: "MFA", value: "MFA" },
    { label: "SSO", value: "SSO" },
    { label: "DEV", value: "DEV" },
  ];

  const [formData, setFormData] = useState({
    authType: AUTH_TYPE_OPTIONS[0].value,
    email: "",
    password: "",
  });

  const [changePassword, setChangePassword] = useState(false);
  const [unlockAccount, setUnlockAccount] = useState(false);
  const [registerUser, setRegisterUser] = useState(false);
  const { login } = useAuth();
  const [userId, setUserId] = useState(0);
  const [_, setLoading] = useState(false);

  const { handleSubmit, watch, control } = useForm<ILoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleRegisterUser = () => {
    setRegisterUser(true);
  };

  const onSubmit = async (data: ILoginForm) => {
    const email = watch("email");
    setLoading(true);
    const loginRes = await login({
      email,
      password: data.password,
      remember: data.remember,
    });
    if (loginRes.requireUnlock) {
      setUnlockAccount(true);
      setUserId(loginRes.userId);
      return;
    }
    if (loginRes.requireChangePassword && loginRes.userId) {
      setChangePassword(true);
      setUserId(loginRes.userId);
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  const handleChangeFormInput = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (formData.authType === "MFA") {
    return <MfaSetup />;
  }

  if (changePassword) {
    return (
      <ChangePassword
        onClose={() => setChangePassword(false)} // 👉 callback để quay lại
        userId={userId}
      />
    );
  }
  if (unlockAccount) {
    return (
      <RequestUnlock userId={userId} onClose={() => setUnlockAccount(false)} />
    );
  }

  if (registerUser) {
    return <Registration onClose={() => setRegisterUser(false)} />;
  }

  return (
    <Box
      component="form"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box
        sx={(theme) => ({
          width: "456px",
          mx: "auto",
          border: `1px solid ${theme.palette.grey[200]}`,
        })}
      >
        <Box
          sx={(theme) => ({
            backgroundColor: theme.palette.grey[50],
            py: 2,
            borderBottom: `1px solid ${theme.palette.grey[200]}`,
          })}
        >
          <Typography variant="h4" component="h4" align="center">
            Service
          </Typography>
        </Box>

        <Box sx={{ bgcolor: "common.white", px: 4.5, py: 4 }}>
          <Typography variant="h6" align="center">
            서비스설명
          </Typography>
          <Typography variant="body1" align="center" mt="20px" color="grey.500">
            서비스 설명은 이렇습니다. 서비스 설명은 이렇습니다. <br />
          </Typography>

          <Stack direction="column" spacing={3} sx={{ mt: 3 }}>
            <FormControl fullWidth>
              <Typography variant="body1" mb={0.5}>
                인증 방법
              </Typography>
              <SelectDropdown
                value={formData.authType}
                onChange={(val) =>
                  handleChangeFormInput("authType", val as AuthType)
                }
                options={AUTH_TYPE_OPTIONS}
              />
            </FormControl>
            {/* <Chip label={formData.authType} /> */}
            <FormControl fullWidth>
              <Typography variant="body1" mb={0.5}>
                아이디
              </Typography>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <InputField {...field} placeholder="아이디를 입력하세요." />
                )}
              />
            </FormControl>

            <FormControl fullWidth>
              <Typography variant="body1" mb={0.5}>
                아이디
              </Typography>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <InputTextField
                    {...field}
                    placeholder="비밀번호를 입력하세요."
                    type="password"
                  />
                )}
              />
            </FormControl>
            {/* <Button
              label="Change Password"
              onClick={() => setChangePassword(true)}
              appearance="outlined"
            /> */}
            <Button
              label="Request unlock account"
              onClick={() => setUnlockAccount(true)}
              priority="normal"
            />
            <Button
              label="Register"
              appearance="unfilled"
              onClick={handleRegisterUser}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                label="로그인"
                type="submit"
                priority="normal"
                sx={{ minWidth: "30rem", margin: "0px" }}
              />
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
