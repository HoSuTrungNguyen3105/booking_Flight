import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Card,
  CardContent,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  Stack,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import type { DataFlight, Passenger, Seat } from "../../utils/type";
import { useSeatColor } from "../Admin/component/Seat/hook/useSeatColor";
import { useSeatFeatures } from "../Admin/component/Seat/hook/useSeatFeature";
import LegendItem from "../Admin/component/Seat/ButtonSeat/LegendItem";
import { useLocation } from "react-router-dom";
import { useChooseSeatToBooking } from "../Employee/useChooseSeatToBooking";

const SeatSelection: React.FC = () => {
  const location = useLocation();
  const { id } = location.state || { id: 0 }; // Default to 0 or handle error
  const [selectedSeatType, setSelectedSeatType] = useState<string>("all");
  const { seatFeatureOptions } = useSeatFeatures();

  const { handleSelectSeat, filteredSeats, flightData, selectedSeats } =
    useChooseSeatToBooking({ id });

  // Mock data matching Passenger interface (keep for now as API doesn't provide it here)
  const passenger: Passenger = {
    id: "p1",
    fullName: "Mrs Eded Ededele",
    email: "eded@example.com",
    phone: "123456789",
    passport: "A1234567",
    accountLockYn: "N",
    isEmailVerified: "Y",
    bookings: [],
  };

  const getColLetter = (num: number) => String.fromCharCode(64 + num);

  const selectedSeat = selectedSeats.length > 0 ? selectedSeats[0] : null;

  // Group seats by row (seatNumber)
  const rows = useMemo(() => {
    if (!filteredSeats) return [];
    const uniqueRows = Array.from(
      new Set(filteredSeats.map((s) => s.seatNumber))
    ).sort((a, b) => a - b);
    return uniqueRows;
  }, [filteredSeats]);

  const columns = ["A", "B", "C", "", "D", "E", "F", "G", "", "H", "J", "K"];

  if (!flightData) {
    return <Box sx={{ p: 3 }}>Loading flight data...</Box>;
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 2 }}>
      {/* Flight Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={6}>
              <Typography variant="h6">
                {new Date(flightData.scheduledDeparture).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {flightData.flightNo} • {flightData.flightType || "Economy"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {flightData.departureAirport} to {flightData.arrivalAirport}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {flightData.aircraftCode}
              </Typography>
            </Grid>

            <Grid size={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  {passenger.fullName}
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  {selectedSeat
                    ? `${selectedSeat.seatNumber}${selectedSeat.seatRow}`
                    : "No seat selected"}
                </Typography>
                {selectedSeat && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2">Seat Price</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      USD{selectedSeat.price}
                    </Typography>
                  </Box>
                )}
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => handleSelectSeat(selectedSeat!)}
                  disabled={!selectedSeat}
                >
                  Remove
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Seat Legend */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Seat Legend
        </Typography>
        <LegendItem />
      </Paper>

      <Grid container spacing={3}>
        {/* Left Side - Seat Map */}
        <Grid size={8}>
          <Paper sx={{ p: 3 }}>
            {/* Seat Columns Header */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(10, 1fr)",
                  gap: 1,
                  width: "100%",
                  maxWidth: 500,
                }}
              >
                {columns.map((col, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    textAlign="center"
                    fontWeight="bold"
                  >
                    {col}
                  </Typography>
                ))}
              </Box>
            </Box>

            {/* Seat Grid */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              {rows.map((rowNum) => (
                <Box
                  key={rowNum}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Typography
                    variant="body2"
                    sx={{ minWidth: 30, textAlign: "right" }}
                  >
                    {rowNum}
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(10, 1fr)",
                      gap: 1,
                    }}
                  >
                    {columns.map((col, colIndex) => {
                      if (col === "") {
                        return (
                          <Box key={`aisle-${colIndex}`} sx={{ width: 32 }} />
                        );
                      }

                      const seat = filteredSeats?.find(
                        (s) => s.seatNumber === rowNum && s.seatRow === col
                      );

                      if (!seat) {
                        return (
                          <Box
                            key={`empty-${colIndex}`}
                            sx={{ width: 32, height: 32 }}
                          />
                        );
                      }

                      // Determine feature key for color hook
                      let featureKey: keyof import("../Admin/component/Seat/modal/SeatManagementModal").SeatFeatures =
                        "isAvailable";
                      if (seat.isBooked) featureKey = "isBooked";
                      else if (seat.isExitRow) featureKey = "isExitRow";
                      else if (seat.isExtraLegroom)
                        featureKey = "isExtraLegroom";
                      // Add other mappings as needed

                      const isSelected = selectedSeats.some(
                        (s) => s.id === seat.id
                      );

                      const { backgroundColor, borderColor, textColor } =
                        useSeatColor({
                          seatFeature: featureKey,
                          selectedSeats: isSelected ? [seat] : [],
                          seat: seat,
                        });

                      return (
                        <Box
                          key={seat.id}
                          sx={{
                            width: 32,
                            height: 32,
                            border: `1px solid ${borderColor}`,
                            backgroundColor: backgroundColor,
                            color: textColor,
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor:
                              seat.isAvailable && !seat.isBooked
                                ? "pointer"
                                : "default",
                            opacity: seat.isAvailable ? 1 : 0.5,
                            "&:hover": {
                              opacity: 0.8,
                            },
                          }}
                          onClick={() => handleSelectSeat(seat)}
                        >
                          <Typography variant="caption" fontSize="10px">
                            {seat.seatRow}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Aircraft Sections */}
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Galley • Wing • Power port section
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={4}>
          {/* Current Filter */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Currently filtering</Typography>
              <IconButton size="small">
                <Close />
              </IconButton>
            </Box>
            <Chip label="Preferred seat" variant="filled" color="primary" />
            <Button size="small" sx={{ ml: 1 }}>
              Clear filter
            </Button>
          </Paper>

          {/* Seat Type Filters */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filter available seats
            </Typography>
            <FormGroup>
              {seatFeatureOptions.map((option) => (
                <Box
                  key={option.value}
                  sx={{
                    mb: 1,
                    p: 1,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedSeatType === option.value}
                        onChange={() => setSelectedSeatType(option.value)}
                      />
                    }
                    label={option.label}
                  />
                </Box>
              ))}
            </FormGroup>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SeatSelection;
