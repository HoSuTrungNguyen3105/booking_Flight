import { useState } from "react";
import {
  Button,
  TextField,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useRegisterUser, type PassengerFormData } from "../Api/usePostApi";
import { useToast } from "../../context/ToastContext";
import VerifyOpt from "./components/VerifyOpt";
import {
  AppRegistration,
  AppRegistrationRounded,
  BackHand,
} from "@mui/icons-material";
import {
  InputTableWrapperCustom,
  type HeaderColumn,
} from "../../common/Table/InputTableWrapper";
import InputTextField from "../../common/Input/InputTextField";

interface RegisterProps {
  email: string;
  onClose: () => void;
}

const headers: HeaderColumn[] = [
  // { label: "Field", minWidth: 150 },
  // { label: "Value", minWidth: 300 },
];

const Registration = ({ email }: RegisterProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PassengerFormData>({
    defaultValues: { email },
  });

  const { refetchRegister } = useRegisterUser();
  const [verifyOTPcode, setVerifyOTPcode] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const toast = useToast();

  const onSubmit = async (data: PassengerFormData) => {
    try {
      const res = await refetchRegister(data);
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
    return <VerifyOpt userId={userId ?? undefined} email={email} />;
  }

  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 700, mx: "auto", mt: 4, p: 3 }}
    >
      <Typography variant="h6" gutterBottom>
        <AppRegistrationRounded />
        Registration
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputTableWrapperCustom headersColumn={headers} hasCheckbox={false}>
          {[
            {
              name: "name",
              label: "Full Name",
              type: "text",
            },
            {
              name: "email",
              label: "Email",
              type: "email",
            },
            {
              name: "password",
              label: "Password",
              showEyeIcon: true,
              type: "password",
            },
            {
              name: "phone",
              label: "Phone",
              type: "text",
            },
            {
              name: "passport",
              label: "Passport",
              type: "text",
            },
          ].map(({ name, label, type, showEyeIcon }) => (
            <TableRow key={name}>
              <TableCell>{label}</TableCell>
              <TableCell>
                <Controller
                  name={name as keyof PassengerFormData}
                  control={control}
                  // rules={rules}
                  render={({ field }) => (
                    <InputTextField
                      {...field}
                      showEyeIcon={showEyeIcon}
                      type={type}
                      placeholder={`Enter your ${label.toLowerCase()}`}
                      error={!!errors[name as keyof PassengerFormData]}
                    />
                  )}
                />
              </TableCell>
            </TableRow>
          ))}
        </InputTableWrapperCustom>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button variant="contained" color="primary" type="submit">
            Register
          </Button>
        </Box>
      </form>
    </TableContainer>
  );
};

export default Registration;
