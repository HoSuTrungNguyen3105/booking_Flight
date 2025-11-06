import React, { memo, useCallback, useEffect, useRef, useState } from "react";
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

  // const [formValues, setFormValues] = useState<ProfilePassenger>({
  //   fullName: passenger?.fullName || "",
  //   email: passenger?.email || "",
  //   phone: passenger?.phone || "",
  //   passport: passenger?.passport || "",
  // });

  // const handleChange = (text: string) => {
  //   // const { name, value } = e.target;

  //   setFormValues({
  //     ...formValues,
  //     [text]: text,
  //   });
  // };

  // const [coords, setCoords] = useState<[number, number] | null>(null);
  // const [countryCode, setCountryCode] = useState("");

  // const handleRender = useCallback(() => {
  //   const saved = localStorage.getItem("cord");
  //   if (!saved) return;

  //   try {
  //     // Nếu lưu dạng JSON.stringify([lat, lng])
  //     const parsed = JSON.parse(saved);
  //     if (Array.isArray(parsed) && parsed.length === 2) {
  //       const lat = Number(parsed[0]);
  //       const lng = Number(parsed[1]);

  //       // Đảm bảo đúng kiểu [number, number]
  //       if (!isNaN(lat) && !isNaN(lng)) {
  //         setCoords([lat, lng]);
  //       } else {
  //         console.warn("Dữ liệu toạ độ không hợp lệ:", parsed);
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Lỗi khi parse localStorage:", err);
  //   }
  // }, []);

  // useEffect(() => {
  //   handleRender();
  // }, [handleRender]);

  // const { refetchDistance } = useGetLocationCode(
  //   coords?.[0] as number,
  //   coords?.[1] as number
  // );
  // const hasFetched = useRef(false);

  // useEffect(() => {
  //   if (hasFetched.current) return;
  //   hasFetched.current = true;

  //   const fetchData = async () => {
  //     const saved = localStorage.getItem("cord");
  //     if (saved) {
  //       console.log("save", saved);
  //       const parsed: [number, number] = JSON.parse(saved);
  //       console.log("parsed", parsed);
  //       if (Array.isArray(parsed) && parsed.length === 2) {
  //         setCoords(parsed);
  //         // const res = await refetchDistance();
  //         // console.log("res", res);
  //       }
  //     }

  //     navigator.geolocation.getCurrentPosition(
  //       (pos) => {
  //         const newCoords: [number, number] = [
  //           pos.coords.latitude,
  //           pos.coords.longitude,
  //         ];
  //         setCoords(newCoords);
  //         localStorage.setItem("cord", JSON.stringify(newCoords));
  //       },
  //       (err) => console.error("Không thể lấy vị trí:", err)
  //     );
  //   };

  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   const fetchCountry = async () => {
  //     if (!coords) return;
  //     const res = await refetchDistance();
  //     const newCode = res?.data?.[0]?.countryCode;
  //     if (newCode && newCode !== countryCode) {
  //       setCountryCode(newCode);
  //       // localStorage.setItem("countryCode", newCode);
  //     }
  //   };

  //   fetchCountry();
  //   // Không nên thêm countryCode vào dependency!
  // }, [coords]);

  // const { dataDistance } = useGetDistancesByLocationCode(countryCode);

  // const [callingCode, setCallingCode] = useState(
  //   dataDistance?.data.callingCode
  // );
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
              // onChange={handleChange}
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
              name="callingCode"
              value={passenger?.phone}
              // onChange={handleChange}
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
