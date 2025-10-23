import { memo, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import {
  useRegisterUser,
  type PassengerFormData,
} from "../../context/Api/usePostApi";
import { useToast } from "../../context/ToastContext";
import VerifyOpt from "./VerifyOpt";
import InputTextField from "../../common/Input/InputTextField";

interface RegisterProps {
  email: string;
  onClose: () => void;
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
  const [userId, setUserId] = useState<number | null>(null);

  const onSubmit = async () => {
    try {
      const res = await refetchRegister(formData);
      if (res?.resultCode === "00") {
        toast(res.resultMessage);
        setVerifyOTPcode(true);
        setUserId(res.data?.userId ?? null);
      } else {
        toast(res?.resultMessage || "Yêu cầu thất bại, vui lòng thử lại.");
      }
    } catch {
      toast("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  if (verifyOTPcode) {
    return <VerifyOpt userId={userId ?? undefined} email={formData.email} />;
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
        <InputTextField
          value={formData.name}
          placeholder="name"
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, name: value }))
          }
        />
        <InputTextField
          value={formData.email}
          placeholder="email"
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, email: value }))
          }
        />
        <InputTextField
          type="password"
          placeholder="password"
          value={formData.password}
          showEyeIcon
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, password: value }))
          }
        />
        <InputTextField
          value={formData.phone}
          placeholder="phone"
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, phone: value }))
          }
        />
        <Button variant="contained" color="primary" onClick={onSubmit}>
          Đăng ký
        </Button>
      </Box>
    </Box>
  );
};

export default memo(Registration);
