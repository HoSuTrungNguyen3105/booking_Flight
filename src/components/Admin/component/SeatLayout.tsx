import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Button,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import WcIcon from "@mui/icons-material/Wc";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { useGetAllInfoFlightByIDData } from "../../Api/useGetApi";
import DetailSection, { type IDetailItem } from "../../../common/DetailSection";
import ButtonSeat from "./ButtonSeat";
import type { Seat } from "../../../utils/type";

type FlightIdProps = {
  id: number;
};

const SeatLayout: React.FC<FlightIdProps> = ({ id }) => {
  const { getAllInfoFlightByIdData } = useGetAllInfoFlightByIDData({ id });

  const detail: IDetailItem[] = [
    {
      title: "Flight No",
      description: getAllInfoFlightByIdData?.data?.flightNo,
      size: 12,
    },
    {
      title: "Aircraft",
      description: getAllInfoFlightByIdData?.data?.aircraft?.model,
      size: 12,
    },
    {
      title: "Aircraft Code",
      description: getAllInfoFlightByIdData?.data?.aircraftCode,
      size: 12,
    },
    {
      title: "Arrival Airport",
      description: getAllInfoFlightByIdData?.data?.arrivalAirport,
      size: 12,
    },
    {
      title: "Departure Airport",
      description: getAllInfoFlightByIdData?.data?.departureAirport,
      size: 12,
    },
    {
      title: "City",
      description: getAllInfoFlightByIdData?.data?.arrivalAirportRel?.city,
      size: 12,
    },
    {
      title: "Flight ID",
      description: getAllInfoFlightByIdData?.data?.flightId,
      size: 12,
    },
    {
      title: "Status",
      description: getAllInfoFlightByIdData?.data?.status,
      size: 12,
    },
    {
      title: "Flight Type",
      description: getAllInfoFlightByIdData?.data?.flightType,
      size: 12,
    },
    {
      title: "Seats",
      description: getAllInfoFlightByIdData?.data?.seats?.length,
      size: 12,
    },
  ];

  // State chọn ghế
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const handleSelectSeat = (seat: Seat) => {
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.id === seat.id);
      if (exists) {
        return prev.filter((s) => s.id !== seat.id); // bỏ chọn
      }
      return [...prev, seat]; // thêm chọn
    });
  };

  return (
    <Box sx={{ maxWidth: "100%" }}>
      <Box sx={{ borderRadius: 2, p: 1 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Scale
          </Typography>
          <Chip
            icon={<FlightTakeoffIcon />}
            label={getAllInfoFlightByIdData?.data?.aircraft?.model ?? "Unknown"}
            color="primary"
            variant="outlined"
          />
        </Box>

        <Grid container spacing={4}>
          {/* Info + Options */}
          <Grid size={6}>
            <DetailSection mode="row" data={detail} />
            <Typography variant="h6" gutterBottom>
              Seat Options
            </Typography>
            <Box sx={{ mb: 3 }}>
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox name="available" />}
                  label="Available"
                />
                <FormControlLabel
                  control={<Checkbox name="premiumOnly" />}
                  label="Premium Only"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="handicapAccessible"
                      icon={<AccessibilityNewIcon />}
                      checkedIcon={<AccessibilityNewIcon />}
                    />
                  }
                  label="Handicap Accessible"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="lavatory"
                      icon={<WcIcon />}
                      checkedIcon={<WcIcon />}
                    />
                  }
                  label="Lavatory"
                />
              </FormGroup>
            </Box>
          </Grid>

          {/* Seat Map */}
          <Grid size={6}>
            <Typography variant="h6" gutterBottom>
              {getAllInfoFlightByIdData?.data?.aircraft?.model} Seat Map
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                p: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
              }}
            >
              {Array.from({ length: 40 }, (_, rowIndex) => {
                const row = rowIndex + 1;
                const rowSeats =
                  getAllInfoFlightByIdData?.data?.seats?.filter(
                    (s) => s.seatNumber === row
                  ) ?? [];

                return (
                  <Box
                    key={row}
                    sx={{ display: "flex", justifyContent: "center", mb: 1 }}
                  >
                    {/* 3 ghế bên trái */}
                    {["A", "B", "C"].map((col) => {
                      const seat = rowSeats.find(
                        (s) => s.seatRow === `${row}${col}`
                      );
                      return (
                        <ButtonSeat
                          key={col}
                          dataGetSeatByFlightId={{
                            list: getAllInfoFlightByIdData?.data?.seats ?? [],
                          }}
                          selectedSeats={selectedSeats}
                          handleSelectSeat={handleSelectSeat}
                        />
                      );
                    })}

                    {/* Lối đi */}
                    <Box sx={{ width: 40 }} />

                    {/* 3 ghế bên phải */}
                    {["D", "E", "F"].map((col) => {
                      const seat = rowSeats.find(
                        (s) => s.seatRow === `${row}${col}`
                      );
                      return (
                        <ButtonSeat
                          key={col}
                          dataGetSeatByFlightId={{
                            list: getAllInfoFlightByIdData?.data?.seats ?? [],
                          }}
                          selectedSeats={selectedSeats}
                          handleSelectSeat={handleSelectSeat}
                        />
                      );
                    })}
                  </Box>
                );
              })}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Create Alert Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom>
              Create Seat Alert
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create Aircraft Change Alert
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<ReviewsIcon />}>
            Create Alert
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SeatLayout;
