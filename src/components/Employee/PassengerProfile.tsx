import React, { Activity, memo, useEffect, useState } from "react";
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
import { useUpdatePassengerInProfile } from "../../context/Api/usePostApi";
import { DateFormatEnum, formatDate } from "../../hooks/format";
import { refethDistancesToGetCallingCode } from "../../context/Api/useGetLocation";
import theme from "../../scss/theme";
import { locales } from "../../i18n";

type ProfilePassenger = Pick<
  Passenger,
  "fullName" | "email" | "passport" | "phone" | "lastLoginDate"
>;

const PassengerProfile = () => {
  const { passenger, countryCode } = useAuth();
  const [callingCode, setCallingCode] = useState("");

  useEffect(() => {
    const fetch = async () => {
      if (passenger == null) return;
      const res = await refethDistancesToGetCallingCode(countryCode);
      setCallingCode(res?.data.callingCode || "");
    };

    if (countryCode) {
      fetch();
    }
  }, [countryCode]);

  const [value, setValue] = useState("account");

  type LocaleKey = keyof typeof locales;

  const localesFilter: LocaleKey[] = [];

  const handleChangeToggle = (
    _: React.MouseEvent<HTMLElement>,
    newValue: string
  ) => {
    if (newValue !== null) setValue(newValue);
  };

  const { refetchUpdatePassengerInProfile } = useUpdatePassengerInProfile(
    passenger?.id || ""
  );

  const [formValues, setFormValues] = useState<ProfilePassenger>({
    fullName: "",
    email: "",
    phone: "",
    passport: "",
    lastLoginDate: undefined,
  });

  useEffect(() => {
    if (passenger) {
      let phone = passenger.phone || "";

      if (!phone.startsWith("+")) {
        phone = `+${callingCode}${phone.replace(/^0/, "")}`;
      }

      phone.replace(/^\+(\d{1,3})\s*(\d+)$/, "+$1 $2");

      setFormValues({
        fullName: passenger.fullName || "",
        email: passenger.email || "",
        phone,
        passport: passenger.passport || "",
        lastLoginDate: passenger.lastLoginDate,
      });
    }
  }, [passenger, callingCode]);

  const handleChange = (name: keyof ProfilePassenger, value: string) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const addPlusToPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber.startsWith("+")) {
      return "+" + phoneNumber;
    }
    return phoneNumber;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValues.phone) {
      let phone = formValues.phone;
      addPlusToPhoneNumber(phone);
      if (!phone.startsWith("+")) {
        phone = callingCode + " " + phone.slice(2);
      } else if (!phone.startsWith(callingCode)) {
        phone = phone;
      }

      setFormValues({ ...formValues, phone });

      const res = await refetchUpdatePassengerInProfile({
        ...formValues,
        phone,
      });
      console.log("formValues", formValues);
      console.log("masks", res);
    }
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
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChangeToggle}
        color="primary"
      >
        <ToggleButton value="account">Account</ToggleButton>
        <ToggleButton value="ticket">Ticket</ToggleButton>
      </ToggleButtonGroup>
      <Activity mode={value === "account" ? "visible" : "hidden"}>
        <Box gap={1} height={100}>
          <Box display="flex" flexDirection="column" gap={1}>
            <InputTextField
              name="fullName"
              value={formValues.fullName}
              onChange={(e) => handleChange("fullName", e)}
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
              country={
                !formValues.phone ? countryCode.toLowerCase() : undefined
              }
              onlyCountries={localesFilter}
              value={formValues.phone}
              onChange={(value) => handleChange("phone", value)}
              inputStyle={{
                width: "100%",
                height: "40px",
                fontSize: "14px",
                borderRadius: "6px",
                border: "1px solid",
                borderColor: theme.palette.grey[300],
              }}
              buttonStyle={{
                border: "1px solid",
                borderColor: theme.palette.grey[300],
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
              <Link to="/change/email" style={{ color: "#1976d2" }}>
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

          <Box display="flex" flexDirection="column" gap={1}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {/* <Typography> {countryCode}</Typography> */}
            </Box>
            <InputTextField
              name="lastLoginDate"
              value={formatDate(
                DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
                formValues.lastLoginDate
              )} // <- phải là state
              onChange={(e) => handleChange("lastLoginDate", e)}
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
      </Activity>

      <Activity mode={value === "account" ? "hidden" : "visible"}>
        <TicketPage />
      </Activity>
    </Box>
  );
};

export default memo(PassengerProfile);
