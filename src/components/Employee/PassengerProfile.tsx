import React, { memo, useEffect, useState } from "react";
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
import {
  useGetDistancesByLocationCode,
  useGetLocationCode,
} from "../../context/Api/useGetLocation";

type ProfilePassenger = Pick<
  Passenger,
  "fullName" | "email" | "passport" | "phone"
>;

const PassengerProfile = () => {
  const { passenger } = useAuth();
  const [value, setValue] = useState("account");

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

  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [countryCode, setCountryCode] = useState("");

  const { dataLocation, refetchDistance } = useGetLocationCode(
    coords?.[0] as number,
    coords?.[1] as number
  );
  // ✅ Lấy toạ độ từ localStorage hoặc trình duyệt
  useEffect(() => {
    const fetchData = async () => {
      const saved = localStorage.getItem("cord");
      console.log("saved", saved);

      if (saved) {
        const parsed: [number, number] = JSON.parse(saved);
        console.log("parsed", parsed);

        if (Array.isArray(parsed) && parsed.length === 2) {
          setCoords(parsed);
          // Gọi refetchDistance với toạ độ mới
          const res = await refetchDistance();
          console.log("res", res);
        }
      }
    };

    fetchData();
    // console.log("saved", saved);
    // Nếu chưa có trong localStorage → lấy mới
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("pes", pos);
        const newCoords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setCoords(newCoords);
        localStorage.setItem("cord", JSON.stringify(newCoords));
      },
      (err) => {
        console.error("Không thể lấy vị trí:", err);
      }
    );
  }, []);

  useEffect(() => {
    const fetchCountry = async () => {
      if (coords) {
        const res = await refetchDistance();
        console.log("res", res);
        if (res?.data[0].countryCode) {
          setCountryCode(res.data[0].countryCode);
        }
      }
    };
    fetchCountry();
  }, [coords]);

  const { dataDistance } = useGetDistancesByLocationCode(countryCode);

  console.log("countryCode", countryCode);
  console.log("dataDistance", dataDistance?.data.callingCode);

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
              <Typography> {countryCode}</Typography>
            </Box>
            <InputTextField
              name="fullName"
              value={formValues.fullName}
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
              <Typography>Email phone</Typography>
            </Box>
            <InputTextField
              name="phone"
              value={formValues.phone}
              onChange={handleChange}
              placeholder="Enter your phone"
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
              value={formValues.email}
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
