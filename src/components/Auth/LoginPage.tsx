import { Box, FormControl, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import CSelect from "../../common/Dropdown/CSelect";
import { Button } from "../../common/Button/Button";
import InputField from "../../common/Input/InputField";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { Controller, useForm } from "react-hook-form";

interface ILoginForm {
  email: string;
  password: string;
  remember?: boolean;
}
type AuthType = "ID,PW" | "SSO" | "DEV";
export const LoginPage: React.FC = () => {
  const AUTH_TYPE_OPTIONS: { label: string; value: AuthType }[] = [
    { label: "ID,PW", value: "ID,PW" },
    { label: "SSO", value: "SSO" },
    { label: "DEV", value: "DEV" },
  ];
  const [formData, setFormData] = React.useState({
    authType: AUTH_TYPE_OPTIONS[0].value,
    //
    email: "",
    password: "",
  });

  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [_, setLoading] = useState(false);
  const toast = useToast();
  const {
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<ILoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: ILoginForm) => {
    const email = watch("email");
    const passwords = watch("password");
    console.log("email", email);
    console.log("email", passwords);
    setLoading(true);
    login({
      email,
      password: data.password,
      remember: data.remember,
    });
    console.log("user", user);
    setLoading(false);
  };

  const handleChangeFormInput = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
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
        {/* Header */}
        <Box
          sx={(theme) => ({
            backgroundColor: theme.palette.grey[50],
            py: 4,
            borderBottom: `1px solid ${theme.palette.grey[200]}`,
          })}
        >
          <Typography variant="h4" component="h4" align="center">
            Service
          </Typography>
        </Box>

        {/* Form content */}
        <Box sx={{ bgcolor: "common.white", px: 4.5, py: 4 }}>
          <Typography variant="h6" align="center">
            서비스설명
          </Typography>
          <Typography variant="body1" align="center" mt="20px" color="grey.500">
            서비스 설명은 이렇습니다. 서비스 설명은 이렇습니다. <br />
            서비스 설명은 이렇습니다.
          </Typography>

          {/* Auth Type */}
          <Stack direction="column" spacing={3} sx={{ mt: 3 }}>
            <FormControl fullWidth>
              <Typography variant="body1" mb={0.5}>
                인증 방법
              </Typography>
              <CSelect
                value={formData.authType}
                // disabled={loading}
                onChange={(val) =>
                  handleChangeFormInput("authType", val as AuthType)
                }
                options={AUTH_TYPE_OPTIONS}
              />
            </FormControl>

            {/* User ID Input */}
            <FormControl fullWidth>
              <Typography variant="body1" mb={0.5}>
                아이디
              </Typography>
              {/* <InputField
                value={formData.email}
                // disabled={loading}

                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangeFormInput("email", event.target.value)
                }
                placeholder="아이디를 입력하세요."
                // error={!error}
              /> */}
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <InputField
                    {...field}
                    placeholder="아이디를 입력하세요."
                    // error={!!errors.email}
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth>
              <Typography variant="body1" mb={0.5}>
                아이디
              </Typography>
              {/* <InputField
                value={formData.password}
                // disabled={loading}

                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangeFormInput("password", event.target.value)
                }
                placeholder="아이디를 입력하세요."
                // error={!error}
              /> */}
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <InputField
                    {...field}
                    placeholder="비밀번호를 입력하세요."
                    // type="password"
                    // error={!!errors.password}
                  />
                )}
              />
            </FormControl>

            {/* Error Message */}
            {/* <LoginErrorMessage visible={!error} /> */}

            {/* Submit Button */}
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
                //                appearance="outlined"
                sx={{ minWidth: "30rem", margin: "0px" }}
              ></Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
