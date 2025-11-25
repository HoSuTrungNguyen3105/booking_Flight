import { memo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import {
  useRegisterUser,
  type PassengerFormData,
} from "../../../context/Api/usePostApi";
import { useToast } from "../../../context/ToastContext";
import VerifyOpt from "../MFA/VerifyOTP";
import InputTextField from "../../../common/Input/InputTextField";
import { ResponseCode } from "../../../utils/response";
import theme from "../../../scss/theme";
import type { AuthType } from "../Login";
import FormRow from "../../../common/AdditionalCustomFC/FormRow";

interface RegisterProps {
  email?: string;
  onClose: () => void;
  authType: AuthType;
}

const Registration = ({ email }: RegisterProps) => {
  const { refetchRegister } = useRegisterUser();

  const toast = useToast();

  const [formData, setFormData] = useState<PassengerFormData>({
    name: "",
    email: email || "",
    password: "",
    phone: "",
    role: "USER",
  });

  const [verifyOTPcode, setVerifyOTPcode] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [authType, _] = useState<AuthType>("ID,PW");

  const onSubmit = async () => {
    try {
      const res = await refetchRegister(formData);
      console.log("res", res);
      if (res?.resultCode === ResponseCode.SUCCESS) {
        toast(res.resultMessage);
        setVerifyOTPcode(true);
        setUserId((res.data?.userId as string) ?? "");
      } else {
        toast(res?.resultMessage || "Yêu cầu thất bại, vui lòng thử lại.");
      }
    } catch {
      toast("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  if (verifyOTPcode) {
    return (
      <VerifyOpt
        userId={userId ?? undefined}
        authType={authType}
        email={formData.email}
      />
    );
  }

  return (
    <Box
      sx={{
        maxWidth: "40rem",
        mx: "auto",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Đăng ký tài khoản
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <FormRow direction="column" label="Name">
          <InputTextField
            value={formData.name}
            placeholder="name"
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, name: value }))
            }
          />
        </FormRow>
        <FormRow direction="column" label="Email">
          <InputTextField
            value={formData.email}
            placeholder="email"
            isEmail
            onError={(err) => setError(err as string)}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, email: value }))
            }
          />
        </FormRow>
        <FormRow direction="column" label="Password">
          <InputTextField
            type="password"
            placeholder="password"
            value={formData.password}
            showEyeIcon
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, password: value }))
            }
          />
        </FormRow>
        <FormRow direction="column" label="Phone">
          <InputTextField
            value={formData.phone}
            placeholder="phone"
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, phone: value }))
            }
          />
        </FormRow>
        <Box display={"flex"} justifyContent={"end"}>
          {error && (
            <Typography sx={{ color: theme.palette.error.dark }}>
              {error}
            </Typography>
          )}
          <Button variant="contained" color="primary" onClick={onSubmit}>
            Đăng ký
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default memo(Registration);
