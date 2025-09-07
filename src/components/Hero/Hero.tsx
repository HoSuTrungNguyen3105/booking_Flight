import React, { memo, useEffect, useState } from "react";
import {
  Typography,
  Button,
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Grid,
} from "@mui/material";

interface FlightSearchForm {
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  passengers: number;
  flightType: "oneway" | "roundtrip";
  cabinClass: "economy" | "business" | "first";
}

const Hero: React.FC = () => {
  const [searchForm, setSearchForm] = useState<FlightSearchForm>({
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    passengers: 1,
    flightType: "roundtrip",
    cabinClass: "economy",
  });

  const handleChange = (
    field: keyof FlightSearchForm,
    value: string | number
  ) => {
    setSearchForm((prev) => ({ ...prev, [field]: value }));
  };
  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove diacritics
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/\s+/g, "");
  };

  // Hàm lấy địa chỉ hiện tại
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log(latitude);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=3&addressdetails=1`
          );

          const data = await res.json();

          let country = data?.address?.country || "Unknown";
          country = removeVietnameseTones(country);

          handleChange("from", country);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      alert("Trình duyệt không hỗ trợ lấy vị trí.");
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <Box
      sx={{
        height: "700px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: 4,
        textAlign: "center",
        color: "white",
        position: "relative",
        overflow: "hidden",
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.55)",
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 2, maxWidth: "900px" }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            color: "white",
            textShadow: "2px 2px 6px rgba(0,0,0,0.7)",
          }}
        >
          Find Your Next Adventure
        </Typography>

        <Box
          sx={{
            mt: 5,
            p: 3,
            bgcolor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 4,
            boxShadow: 4,
          }}
        >
          {/* Flight Type Toggle */}
          <ToggleButtonGroup
            value={searchForm.flightType}
            exclusive
            onChange={(_, val) => val && handleChange("flightType", val)}
            sx={{ mb: 3 }}
          >
            <ToggleButton value="oneway">One Way</ToggleButton>
            <ToggleButton value="roundtrip">Round Trip</ToggleButton>
          </ToggleButtonGroup>

          {/* Form Fields */}
          {/* <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="From"
                value={searchForm.from}
                onChange={(e) => handleChange("from", e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="To"
                value={searchForm.to}
                onChange={(e) => handleChange("to", e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                type="date"
                label="Departure"
                InputLabelProps={{ shrink: true }}
                value={searchForm.departDate}
                onChange={(e) => handleChange("departDate", e.target.value)}
              />
            </Grid>
            {searchForm.flightType === "roundtrip" && (
              <Grid size={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Return"
                  InputLabelProps={{ shrink: true }}
                  value={searchForm.returnDate}
                  onChange={(e) => handleChange("returnDate", e.target.value)}
                />
              </Grid>
            )}
            <Grid size={12}>
              <TextField
                fullWidth
                type="number"
                label="Passengers"
                value={searchForm.passengers}
                onChange={(e) => handleChange("passengers", +e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              {/* <TextField
                fullWidth
                select
                label="Cabin Class"
                value={searchForm.cabinClass}
                onChange={(e) => handleChange("cabinClass", e.target.value)}
              >
                <MenuItem value="economy">Economy</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="first">First</MenuItem>
              </TextField> 
            </Grid>
            <Grid size={12} sx={{ display: "flex", alignItems: "center" }}>
              {/* <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ borderRadius: "12px", px: 4, width: "100%" }}
              >
                Search Flights
              </Button> 
            </Grid>
          </Grid> */}
        </Box>
      </Box>
    </Box>
  );
};

export default memo(Hero);
