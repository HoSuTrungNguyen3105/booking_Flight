import { Box, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import InputField from "../../common/Input/InputField";
import { Dropdown } from "../../common/Dropdown/Dropdown";
import { Button } from "../../common/Button/Button";
import type { DropdownOptions } from "../../common/Dropdown/type";
import { useToast } from "../../context/ToastContext";

interface ILoginForm {
  emailPrefix: string;
  emailSuffix: string;
  password: string;
  remember?: boolean;
}

const Login = () => {
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
      emailPrefix: "",
      emailSuffix: "@gmail.com",
      password: "",
    },
  });

  const emailDomains: DropdownOptions[] = [
    { label: "gmail.com", value: "@gmail.com" },
    { label: "lgensol.com", value: "@lgensol.com" },
    { label: "outlook.com", value: "@outlook.com" },
    { label: "lg.com", value: "@lg.com" },
    { label: "lgcns.com", value: "@lgcns.com" },
  ];
  const typeDomains: DropdownOptions[] = [
    { label: "DEV", value: "DEV" },
    { label: "SSO", value: "SSO" },
  ];

  const onSubmit = (data: ILoginForm) => {
    // const email = `${data.emailPrefix}${data.emailSuffix}`;
    // const email = `${data.emailPrefix}`;
    const email = watch("emailPrefix");
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

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          p: 3,
          boxShadow: 3,
          bgcolor: "white",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: 400,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Đăng nhập
        </Typography>

        {/* Email */}
        <Box display="flex" gap={1} alignItems="center">
          <Controller
            name="emailPrefix"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                placeholder="Tên email"
                error={!!errors.emailPrefix}
                helperText={errors.emailPrefix?.message || ""}
              />
            )}
          />
          <Typography>@</Typography>
          <Controller
            name="emailSuffix"
            control={control}
            render={({ field }) => {
              const selectedOption =
                emailDomains.find((item) => item.value === field.value) || null;

              return (
                <Dropdown
                  {...field}
                  value={selectedOption}
                  onChange={(e, selected) => {
                    const selectedValue = (selected as DropdownOptions)?.value;
                    field.onChange(selectedValue);
                  }}
                  options={emailDomains}
                  size="medium"
                  placeholder="Chọn domain"
                />
              );
            }}
          />
        </Box>
        <Controller
          name="emailSuffix"
          control={control}
          render={({ field }) => {
            const selectedOption =
              emailDomains.find((item) => item.value === field.value) || null;

            return (
              <Dropdown
                {...field}
                value={selectedOption}
                onChange={(e, selected) => {
                  const selectedValue = (selected as DropdownOptions)?.value;
                  field.onChange(selectedValue);
                }}
                options={typeDomains}
                size="medium"
                placeholder="Chọn domain"
              />
            );
          }}
        />

        {/* Password */}
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              placeholder="Mật khẩu"
              isPassword
              error={!!errors.password}
              helperText={errors.password?.message || ""}
            />
          )}
        />

        <Button
          type="submit"
          label="Đăng nhập"
          appearance="contained"
          priority="normal"
        />
      </Box>
    </Box>
  );
};

export default Login;
