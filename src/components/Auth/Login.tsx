import { Box, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import InputField from "../../common/Input/InputField";
import { Dropdown } from "../../common/Dropdown/Dropdown";
import { Button } from "../../common/Button/Button";
import type { DropdownOptions } from "../../common/Dropdown/type";

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
  const {
    handleSubmit,
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

  const onSubmit = (data: ILoginForm) => {
    const email = `${data.emailPrefix}${data.emailSuffix}`;
    console.log("email", email);
    if (!email || !data.password) {
      toast.error("Missing email or password");
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
            render={({ field }) => (
              <Dropdown
                {...field}
                value={{
                  label: field.value,
                  value: field.value,
                }}
                onChange={(e, selected) => {
                  field.onChange((selected as DropdownOptions)?.label);
                }}
                options={emailDomains}
                size="medium" // hoặc "small"
                placeholder="Chọn domain"
              />
            )}
          />
        </Box>

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
