import { Box, Typography } from "@mui/material";
import "./index.scss";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../common/Button/Button";
import ContentModal from "../../common/Modal/ContentModal";
import InputField from "../../common/Input/InputField";
import { Dropdown } from "../../common/Dropdown/Dropdown";
import type { DropdownOptions } from "../../common/Dropdown/type";

// interface IFormInput {
//   email: string;
//   passWord: string;
// }
// interface ILoginForm {
//   email: {
//     value: string;
//     type?: string;
//   };
//   password: string;
//   remember?: boolean;
//   // "cf-turnstile-response": string;
// }
interface ILoginForm {
  emailPrefix: string;
  emailSuffix: string;
  password: string;
  remember?: boolean;
}
// const loginSchema = yup.object().shape({
//   email: yup
//     .string()
//     .email("Email không hợp lệ")
//     .required("Vui lòng điền email"),
//   password: yup
//     .string()
//     .min(6, "Mật khẩu ít nhất 6 ký tự")
//     .required("Vui lòng điền mật khẩu"),
//   remember: yup.boolean().required(),
//   "cf-turnstile-response": yup
//     .string()
//     .required("Vui lòng xác minh bạn không phải robot"),
// });
const Login: React.FC = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ILoginForm>({
    defaultValues: {
      emailPrefix: "",
      emailSuffix: "",
      password: "",
      remember: true,
    },
  });
  // const {
  //   register,
  //   handleSubmit,
  //   getValues,
  //   control,
  //   setValue,
  //   formState: { errors, isSubmitting },
  // } = useForm<ILoginForm>({
  //   resolver: yupResolver(loginSchema),
  //   defaultValues: {
  //     email: "",
  //     password: "",
  //     remember: true,
  //     "cf-turnstile-response": "",
  //   },
  // });
  const [_, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const { login: doLogin, isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const handleOpen = () => setOpenConfirm(true);
  const handleClose = () => setOpenConfirm(false);
  const handleSubmitLogin = async (data: ILoginForm) => {
    const email = `${data.emailPrefix}${data.emailSuffix}`;
    try {
      setLoading(true);
      // await doLogin({
      //   email: { value: email, type: "email" },
      //   password: data.password,
      // });
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
    } finally {
      setLoading(false);
    }
  };

  const valueEmail: DropdownOptions[] = [
    { label: "gmail.com", value: "@gmail.com" },
    // { label: "gmail.com", value: "gmail.com" },
    { label: "lgensol.com", value: "@lgensol.com" },
    { label: "outlook.com", value: "@outlook.com" },
    { label: "lg.com", value: "@lg.com" },
    { label: "lgcns.com", value: "@lgcns.com" },
  ];
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);
  const confirmLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Error", err);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "#f7f9f8",
      }}
    >
      {isAuthenticated ? (
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            You already have account as account {user?.userName}
          </Typography>
          <Button onClick={goBack} label="Get back" />
          <Button onClick={handleOpen} label="Log out" />
          <ContentModal
            open={openConfirm}
            closeLabel="Cancel"
            submitLabel="Confirm"
            handleClose={handleClose}
            handleSubmit={confirmLogout}
            contentArea={<Box>Do you want to log out?</Box>}
          />
        </Box>
      ) : (
        <Box>
          <Box
            component="form"
            onSubmit={handleSubmit(handleSubmitLogin)}
            sx={{
              p: 3,
              boxShadow: 3,
              bgcolor: "white",
              borderRadius: 2,
              gap: 2,
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              {/* {t('title_login')} */}
              Login
            </Typography>
            {/* <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Box>
                  <InputField
                    value={field.value}
                    sx={{ width: "50%" }}
                    placeholder="Email"
                    onChange={(value) => field.onChange(value)}
                    // {...register('userName', { required: t('username') + ' is required' })}
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ""}
                  />
                  <Typography variant="body2" color="textSecondary">
                    @
                  </Typography>
                  <Dropdown
                    value={
                      valueEmail.find((opt) => opt.value === field.value) ??
                      (field.value
                        ? { label: field.value, value: field.value }
                        : null)
                    }
                    onChange={(e, selected: any) => {
                      // const newValue =
                      //   selected?.map((item: any) => item.value) || "";
                      const newValue = selected?.value ?? "";
                      field.onChange(newValue);
                    }}
                    sx={{ width: "50%" }}
                    options={valueEmail}
                    placeholder="Email"
                  />
                </Box>
              )}
            />

          
           
            {/* <ErrorMessage name="email" component="div" /> */}
            {/* <button type="submit" disabled={isSubmitting}>
                  Submit
                </button> */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Controller
                name="emailPrefix"
                control={control}
                render={({ field }) => (
                  <InputField
                    value={field.value}
                    sx={{ width: "60%" }}
                    placeholder="Your email"
                    onChange={(value) => field.onChange(value)}
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
                    value={{
                      label: field.value,
                      value: field.value,
                    }}
                    onChange={(e, selected: any) => {
                      field.onChange(selected?.label ?? "");
                    }}
                    options={valueEmail}
                    sx={{ width: "100%" }}
                    placeholder="Chọn domain"
                  />
                )}
              />
            </Box>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <InputField
                  value={field.value}
                  placeholder="Password"
                  onChange={(value) => field.onChange(value)}
                  isPassword
                  fullWidth
                  // {...register('password', { required: t('password') + ' is required' })}
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ""}
                />
              )}
            />
            <Button
              label="Submit"
              type="submit"
              // disabled={isSubmitting}
              priority="normal"
              appearance="contained"
            />
          </Box>
          {/* </Form>
            )}
          </Formik> */}

          {/* <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <InputField
                  value={field.value}
                  placeholder="Email"
                  onChange={(value) => field.onChange(value)}
                  // {...register('userName', { required: t('username') + ' is required' })}
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                />
              )}
            /> */}
          {/* <Controller
              name="passWord"
              control={control}
              render={({ field }) => (
                <InputField
                  value={field.value}
                  placeholder="PassWord"
                  onChange={(value) => field.onChange(value)}
                  isPassword
                  fullWidth
                  // {...register('passWord', { required: t('password') + ' is required' })}
                  error={!!errors.passWord}
                  helperText={errors.passWord ? errors.passWord.message : ""}
                />
              )}
            />
            <Button
              label="Submit"
              type="submit"
              // disabled={isSubmitting}
              priority="normal"
              appearance="contained"
            /> */}
          {/* </Box> */}
        </Box>
      )}
    </Box>
  );
};

export default Login;
