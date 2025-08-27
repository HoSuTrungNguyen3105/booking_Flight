import { useEffect, useState } from "react";
import "./index.scss";
import { Box } from "@mui/material";
import { Button } from "../../common/Button/Button";
import { Controller, useForm } from "react-hook-form";
import { FileUpload } from "../../common/FileUploader";
import { INPUT_TYPE, type TFileUploader } from "../../common/FileUploader/type";
import { useToast } from "../../context/ToastContext";
import Input from "../Admin/component/Input";

interface FormDataType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImage: File | null;
}

const Register = () => {
  const { control, handleSubmit, watch, getValues } = useForm<FormDataType>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      profileImage: null,
    },
  });
  const toast = useToast();
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    const isMismatch = password !== confirmPassword && confirmPassword !== "";
    if (isMismatch) {
      setPasswordMismatch(isMismatch);
    } else {
      toast("Passwords do not match!", "error");
    }
  }, [password, confirmPassword]);

  // const [passwordMismatch, setPasswordMismatch] = useState(false);

  // useEffect(() => {
  //   if (confirmPassword !== "") {
  //     if (password !== confirmPassword) {
  //       setPasswordMismatch(true);
  //       toast("Passwords do not match!", "error");
  //     } else {
  //       setPasswordMismatch(false);
  //     }
  //   }
  // }, [password, confirmPassword]);

  const onSubmit = async (data: FormDataType) => {
    try {
      // const registerForm = new FormData();
      // for (const key in data) {
      //   const value = data[key as keyof FormDataType];
      //   if (value !== null) {
      //     registerForm.append(key, value);
      //   }
      // }
      // const response = await fetch("http://localhost:3000/auth/register", {
      //   method: "POST",
      //   body: registerForm,
      // });
      // if (response.ok) {
      //   navigate("/login");
      // } else {
      //   console.error("Registration failed", await response.text());
      // }
    } catch (err: any) {
      console.error("Registration error:", err.message);
    }
  };

  return (
    <Box className="register">
      <Box className="register_content">
        <form
          className="register_content_form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input name="firstName" control={control} placeholder="First Name" />
          <Input name="lastName" control={control} placeholder="Last Name" />
          <Input name="email" control={control} placeholder="Email" />
          <Input
            name="password"
            control={control}
            placeholder="Password"
            isPassword
          />
          <Input
            name="confirmPassword"
            control={control}
            placeholder="Confirm Password"
            isPassword
          />

          {/* {!isPasswordMatch && (
            <Typography color="error">Passwords do not match!</Typography>
          )} */}

          {/* Upload ảnh */}
          <Controller
            name="profileImage"
            control={control}
            render={({ field }) => (
              <FileUpload
                name="profileImage"
                inputType={INPUT_TYPE.THUMBNAIL}
                onChange={(files: TFileUploader[]) => {
                  console.log(files);
                  field.onChange(files);
                }}
                // onChange={(file: File) => setValue("profileImage", file)}
              />
            )}
          />

          {/* Hiển thị preview ảnh */}
          {getValues("profileImage") && (
            <Box
              component={"img"}
              src={URL.createObjectURL(getValues("profileImage")!)}
              alt="profile"
              sx={{ maxWidth: "80px", borderRadius: "8px" }}
            />
          )}

          <Button label="REGISTER" type="submit" disabled={passwordMismatch} />
        </form>
        <a href="/login">Already have an account? Log In Here</a>
      </Box>
    </Box>
  );
};

export default Register;
