import React, { memo, useState } from "react";
import {
  Typography,
  Button,
  Box,
  useTheme,
  InputAdornment,
  TextField,
} from "@mui/material";
import { GridSearchIcon } from "@mui/x-data-grid";
import { useGetUnlockRequests } from "../Api/useGetApi";

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
  const theme = useTheme();

  const [searchForm, setSearchForm] = useState<FlightSearchForm>({
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    passengers: 1,
    flightType: "roundtrip",
    cabinClass: "economy",
  });

  const handleInputChange = (
    field: keyof FlightSearchForm,
    value: string | number
  ) => {
    setSearchForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const { getUnlockRequests } = useGetUnlockRequests();

  return (
    <>
      <Box
        sx={{
          height: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 6,
          textAlign: "center",
          color: "white",
          position: "relative",
          overflow: "hidden",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1490730101735-85e8a7056461?q=80&w=2670&auto=format&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              color: "white",
              textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
            }}
          >
            Find Your Next Adventure
          </Typography>
          <Typography
            variant="h5"
            sx={{ mt: 2, color: theme.palette.grey[300] }}
          >
            {/* Book flights, discover destinations, and start your journey with
            ease. */}
            {JSON.stringify(getUnlockRequests)}
          </Typography>

          <Box
            sx={{
              mt: 5,
              width: "100%",
              maxWidth: "800px",
              mx: "auto",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "16px",
              p: 2,
              boxShadow: 3,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search flights, destinations..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GridSearchIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button variant="contained" sx={{ borderRadius: "12px" }}>
                      Search
                    </Button>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "12px",
                  bgcolor: "white",
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default memo(Hero);
