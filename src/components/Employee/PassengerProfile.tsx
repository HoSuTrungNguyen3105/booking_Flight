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
import PhoneInput from "react-phone-input-2";
// import type { E164Number } from "react-phone-number-input";
import "react-phone-input-2/lib/style.css";
import { useUpdatePassengerInProfile } from "../../context/Api/usePostApi";
import { DateFormatEnum, formatDate } from "../../hooks/format";
import { refethDistancesToGetCallingCode } from "../../context/Api/useGetLocation";
import theme from "../../scss/theme";

type ProfilePassenger = Pick<
  Passenger,
  "fullName" | "email" | "passport" | "phone" | "lastLoginDate"
>;

const PassengerProfile = () => {
  const { passenger, countryCode } = useAuth();
  const [callingCode, setCallingCode] = useState("");
  console.log("passenger", passenger);

  useEffect(() => {
    // Hàm fetch chỉ gọi khi countryCode thay đổi
    const fetch = async () => {
      const res = await refethDistancesToGetCallingCode(countryCode);
      setCallingCode(res?.data.callingCode || "");
      console.log("refethDistancesToGetCallingCode", res?.data.callingCode);
    };

    if (countryCode) {
      fetch();
    }
  }, [countryCode]);

  const [value, setValue] = useState("account");
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

  // Khi passenger load xong, cập nhật vào state
  useEffect(() => {
    if (passenger) {
      let phone = passenger.phone || "";

      // Nếu không có + ở đầu, thêm +callingCode
      //  if (!phone) return "";

      // Nếu phone chưa có dấu + → thêm vào
      if (!phone.startsWith("+")) {
        phone = `+${callingCode}${phone.replace(/^0/, "")}`;
      }

      // Chuẩn hóa chỉ 1 khoảng trắng sau mã vùng
      phone.replace(/^\+(\d{1,3})\s*(\d+)$/, "+$1 $2");

      console.log("phone", phone);
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
    // Kiểm tra nếu chuỗi không bắt đầu bằng dấu "+"
    if (!phoneNumber.startsWith("+")) {
      return "+" + phoneNumber; // Thêm dấu "+" vào đầu chuỗi
    }
    return phoneNumber; // Nếu chuỗi đã có dấu "+", trả lại nguyên bản
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValues.phone) {
      let phone = formValues.phone;
      addPlusToPhoneNumber(phone);
      // Nếu số điện thoại bắt đầu bằng "0", thay thế bằng mã vùng
      if (!phone.startsWith("+")) {
        phone = callingCode + " " + phone.slice(2); // Loại bỏ '0' đầu và thêm mã vùng + callingCode
      } else if (!phone.startsWith(callingCode)) {
        // Nếu không phải mã vùng hiện tại, thêm mã vùng vào đầu
        phone = phone;
      }

      // Cập nhật lại phone trong formValues
      setFormValues({ ...formValues, phone });

      console.log("Số điện thoại sau khi xử lý:", phone);

      // Gửi dữ liệu cập nhật qua API
      await refetchUpdatePassengerInProfile({ ...formValues, phone });
    }
    // Kiểm tra số điện thoại và thêm mã vùng nếu cần
    // if (formValues.phone && !formValues.phone.startsWith(callingCode)) {
    //   // Thêm mã vùng vào đầu số điện thoại
    //   const updatedPhone = callingCode + formValues.phone.replace(/^0/, " "); // Thêm mã vùng và thay thế 0 đầu thành số tương ứng
    //   setFormValues({ ...formValues, phone: updatedPhone }); // Cập nhật lại phone trong formValues
    // }
    // console.log("formValues", formValues);
    // console.log("formValues phone", formValues.phone);

    // // Gửi data cập nhật qua API
    // await refetchUpdatePassengerInProfile(formValues);
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
              value={formValues.fullName} // <- phải là state
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
      ) : (
        <>
          <TicketPage />
        </>
      )}
    </Box>
  );
};

export default memo(PassengerProfile);
