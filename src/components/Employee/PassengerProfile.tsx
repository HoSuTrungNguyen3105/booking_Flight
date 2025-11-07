import React, { memo, useState } from "react";
import {
  Box,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { Passenger } from "../../utils/type";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import InputTextField from "../../common/Input/InputTextField";
import TicketPage from ".";
import PhoneInput from "react-phone-input-2";
// import type { E164Number } from "react-phone-number-input";
import "react-phone-input-2/lib/style.css";

type ProfilePassenger = Pick<
  Passenger,
  "fullName" | "email" | "passport" | "phone"
>;

const PassengerProfile = () => {
  const { passenger, countryCode } = useAuth();
  const [value, setValue] = useState("account");
  const handleChangeToggle = (
    _: React.MouseEvent<HTMLElement>,
    newValue: string
  ) => {
    if (newValue !== null) setValue(newValue);
  };

  // type E164Number = string;

  // const [phone, setPhone] = useState<E164Number | undefined>();

  const [formValues, setFormValues] = useState<ProfilePassenger>({
    fullName: passenger?.fullName || "",
    email: passenger?.email || "",
    phone: passenger?.phone || "",
    passport: passenger?.passport || "",
  });

  const handleChange = (text: string) => {
    // const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [text]: text,
    });
  };

  // const handlePhoneChange = (value: string) => {
  //   setPhone(value);
  //   console.log("📞 Số điện thoại:", value);
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{
        maxWidth: "80%",
        margin: "25px auto 10px ",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography variant="h6" color="text.secondary">
        You can update your profile photo and your account details here.
      </Typography>
      {/* <div className={{  padding: 30px 0;}}> */}
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChangeToggle}
        color="primary"
      >
        <ToggleButton value="account">Account</ToggleButton>
        <ToggleButton value="ticket">Ticket</ToggleButton>
      </ToggleButtonGroup>

      {value === "account" ? (
        <Box gap={1} height={100}>
          <Box display="flex" flexDirection="column" gap={1}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {/* <Typography> {countryCode}</Typography> */}
            </Box>
            <InputTextField
              name="fullName"
              value={passenger?.fullName}
              onChange={handleChange}
              placeholder="Enter your fullName"
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>Phone number</Typography>
            </Box>
            <PhoneInput
              country={countryCode.toLowerCase()}
              value={passenger?.phone}
              onChange={handleChange}
              inputStyle={{
                width: "100%",
                height: "40px",
                fontSize: "14px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
              buttonStyle={{
                border: "1px solid #ccc",
                borderRight: "none",
                borderRadius: "6px 0 0 6px",
              }}
            />
          </Box>

          {/* Email */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>Email address</Typography>
              <Link to="/members/email" style={{ color: "#1976d2" }}>
                Change e-mail
              </Link>
            </Box>
            <InputTextField
              name="email"
              value={passenger?.email}
              onChange={() => {}}
              placeholder="Enter your e-mail"
              disabled
            />
          </Box>

          {/* Password */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>Password</Typography>
              <Link to="/members/password" style={{ color: "#1976d2" }}>
                Change password
              </Link>
            </Box>
            <InputTextField
              type="password"
              name="password"
              value="dummypassword"
              placeholder="Enter your password"
              disabled
            />
          </Box>

          {/* Buttons */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              to="/members/signout"
            >
              Sign out
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update profile
            </Button>
          </Stack>
        </Box>
      ) : (
        <>
          <TicketPage />
        </>
      )}
    </Box>
  );
};

export default memo(PassengerProfile);
