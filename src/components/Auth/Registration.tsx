import React, { useState } from "react";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useRegisterUser, type PassengerFormData } from "../Api/usePostApi";
import { useToast } from "../../context/ToastContext";
import VerifyOpt from "./components/VerifyOpt";
import { BackHand } from "@mui/icons-material";
interface RegisterProps {
  email: string;
  onClose: () => void;
}
const Registration = ({ email, onClose }: RegisterProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PassengerFormData>({
    defaultValues: {
      email: email,
    },
  });
  const { refetchRegister } = useRegisterUser();
  const [verifyOTPcode, setVerifyOTPcode] = useState(false);
  // const [email, setEmail] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const toast = useToast();
  const onSubmit = async (data: PassengerFormData) => {
    try {
      const res = await refetchRegister(data);
      // console.log("res", res);
      if (res?.resultCode === "00") {
        toast(res.resultMessage);
        setVerifyOTPcode(true);
        // setEmail(res.data?.email);
        setUserId(res.data?.userId);
        // console.log("res", res.data);
      } else {
        toast(res?.resultMessage || "Yêu cầu thất bại, vui lòng thử lại.");
        // onClose();
      }
    } catch (error) {
      toast("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  if (verifyOTPcode) {
    return <VerifyOpt userId={userId} email={email} />;
  }

  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 700, margin: "auto", mt: 4, p: 3 }}
    >
      <Typography variant="h6" gutterBottom>
        <Button onClick={onClose}>
          <BackHand />
        </Button>{" "}
        Registration
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Full name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder="Enter your name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      // value={email}
                      placeholder="Enter your email"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Password</TableCell>
              <TableCell>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: "Password is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="password"
                      placeholder="Enter password"
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Phone</TableCell>
              <TableCell>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: "Phone is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder="Enter phone number"
                      fullWidth
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  )}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Passport</TableCell>
              <TableCell>
                <Controller
                  name="passport"
                  control={control}
                  rules={{ required: "Passport is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder="Enter passport number"
                      fullWidth
                      error={!!errors.passport}
                      helperText={errors.passport?.message}
                    />
                  )}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

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
