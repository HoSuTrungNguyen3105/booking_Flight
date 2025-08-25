import { useEffect, useState } from "react";
import "./index.scss";
import { Box } from "@mui/material";
import { Button } from "../../common/Button/Button";
import Input from "../../common/CustomRender/Input";
import { Controller, useForm } from "react-hook-form";
import { FileUpload } from "../../common/FileUploader";
import { INPUT_TYPE, type TFileUploader } from "../../common/FileUploader/type";
import { useToast } from "../../context/ToastContext";

interface FormDataType {
  password: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const { control, handleSubmit, watch, getValues } = useForm<FormDataType>({
    defaultValues: {
      password: "",
      confirmPassword: "",
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

  const onSubmit = async (data: FormDataType) => {
    try {
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

          {/* Hiển thị preview ảnh */}
          {/* {getValues("profileImage") && (
            <Box
              component={"img"}
              src={URL.createObjectURL(getValues("profileImage")!)}
              alt="profile"
              sx={{ maxWidth: "80px", borderRadius: "8px" }}
            />
          )} */}

          <Button label="REGISTER" type="submit" disabled={passwordMismatch} />
        </form>
        <a href="/login">Already have an account? Log In Here</a>
      </Box>
    </Box>
  );
};

export default ChangePassword;
