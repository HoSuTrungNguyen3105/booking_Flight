import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Button } from "../../common/Button/Button";
import Input from "../../common/CustomRender/Input";
import { useForm } from "react-hook-form";
import { useToast } from "../../context/ToastContext";

interface FormDataType {
  password: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const { control, handleSubmit, watch } = useForm<FormDataType>({
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
    <Box>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
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

          <Button label="Change" type="submit" disabled={passwordMismatch} />
        </form>
        <a href="/login">Already have an account? Log In Here</a>
      </Box>
    </Box>
  );
};

export default ChangePassword;
