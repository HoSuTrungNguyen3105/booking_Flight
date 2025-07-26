import { Box, FormControl, Input, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Dropdown } from "../../common/Dropdown/Dropdown";
import CSelect from "../../common/Dropdown/CSelect";
import InputTextArea from "../../common/Input/InputTextArea";
import { Button } from "../../common/Button/Button";
import InputField from "../../common/Input/InputField";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { useForm } from "react-hook-form";
type AuthType = "SSO" | "DEV";

interface ILoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

export const LoginPage: React.FC = () => {
  const AUTH_TYPE_OPTIONS = [
    { label: "SSO", value: "SSO" },
    { label: "DEV", value: "DEV" },
  ];
  const [formData, setFormData] = React.useState({
    authType: AUTH_TYPE_OPTIONS[0].value,
    userId: "",
  });

  const { login, isAuthenticated } = useAuth();
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
    if (!email) {
      toast("Missing email", "error");
      return;
    }
    if (!passwords) {
      toast("Missing passwords", "error");
      return;
    }
    setLoading(true);
    login({
      email,
      password: data.password,
      remember: data.remember,
    });
    setLoading(false);
  };

  //   useEffect(() => {
  //     if (isAuthenticated) {
  //       navigate("/");
  //     }
  //   }, [isAuthenticated]);

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
              <InputField
                value={formData.userId}
                // disabled={loading}

                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangeFormInput("userId", event.target.value)
                }
                placeholder="아이디를 입력하세요."
                // error={!error}
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
