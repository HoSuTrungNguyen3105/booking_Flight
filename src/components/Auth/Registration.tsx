import React from "react";
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

type PassengerFormData = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  passport: string;
};

const Registration = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PassengerFormData>();

  const onSubmit = async (data: PassengerFormData) => {
    console.log("Form Data:", data);
    // call API create Passenger
    // await passengerApi.register(data);
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 700, margin: "auto", mt: 4, p: 3 }}
    >
      <Typography variant="h6" gutterBottom>
        Passenger Registration
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Table>
          <TableBody>
            {/* Full Name */}
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>
                <Controller
                  name="fullName"
                  control={control}
                  rules={{ required: "Full name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder="Enter your name"
                      fullWidth
                      error={!!errors.fullName}
                      helperText={errors.fullName?.message}
                    />
                  )}
                />
              </TableCell>
            </TableRow>

            {/* Email */}
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
                      placeholder="Enter your email"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </TableCell>
            </TableRow>

            {/* Password */}
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

            {/* Phone */}
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

            {/* Passport */}
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
