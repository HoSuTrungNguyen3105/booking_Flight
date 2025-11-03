import React, { memo, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  ButtonGroupButtonContext,
  ButtonGroupContext,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { Passenger } from "../../utils/type";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import InputTextField from "../../common/Input/InputTextField";

type ProfilePassenger = Pick<
  Passenger,
  "fullName" | "email" | "passport" | "phone"
>;

const PassengerProfile = () => {
  const { passenger } = useAuth();
  const [value, setValue] = useState("n");

  const handleChangeToggle = (
    event: React.MouseEvent<HTMLElement>,
    newValue: string
  ) => {
    if (newValue !== null) setValue(newValue);
  };

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

  /**
   * Handles the form submission event.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * @returns {Promise<any>}
   */
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
        margin: "30px auto",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* <Heading type={1} color='gray' text='My account' /> */}
      <p className="gray form-information">
        You can update your profile photo and your account details here.
      </p>
      {/* <div className={{  padding: 30px 0;}}> */}
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChangeToggle}
        color="primary"
      >
        <ToggleButton value="ticket">Ticket</ToggleButton>
        <ToggleButton value="account">Account</ToggleButton>
      </ToggleButtonGroup>
      {/* </div> */}
      {/* Name */}
      <InputTextField
        name="name"
        value={formValues.fullName}
        onChange={handleChange}
        placeholder="Enter your name"
      />

      {/* Last Name */}
      <InputTextField
        name="lastname"
        value={formValues.email}
        onChange={handleChange}
        placeholder="Enter your last name"
      />

      {/* Email */}
      <Box display="flex" flexDirection="column" gap={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography>Email address</Typography>
          <Link to="/members/email" style={{ color: "#1976d2" }}>
            Change e-mail
          </Link>
        </Box>
        <InputTextField
          type="email"
          name="email"
          value={formValues.email}
          onChange={() => {}}
          placeholder="Enter your e-mail address"
          disabled
        />
      </Box>

      {/* Password */}
      <Box display="flex" flexDirection="column" gap={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
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
  );
};

export default memo(PassengerProfile);
