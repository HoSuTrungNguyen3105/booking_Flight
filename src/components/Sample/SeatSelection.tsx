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

const SeatSelection: React.FC = () => {
  const [selectedSeatType, setSelectedSeatType] = useState<string>("all");
  const [selectedSeatId, setSelectedSeatId] = useState<number | null>(null);
  const { seatFeatureOptions } = useSeatFeatures();

  // Mock data matching DataFlight interface
  const flightInfo: DataFlight = {
    flightNo: "CX542",
    flightType: "Economy Essential",
    departureAirport: "Hong Kong",
    arrivalAirport: "Tokyo",
    aircraftCode: "Boeing 777-300",
    scheduledDeparture: 1763424000000, // Example timestamp
    scheduledArrival: 1763445600000,
  };

  // Mock data matching Passenger interface
  const passenger: Passenger = {
    id: "p1",
    fullName: "Mrs Eded Ededele",
    email: "eded@example.com",
    phone: "123456789",
    passport: "A1234567",
    accountLockYn: "N",
    isEmailVerified: "Y",
    bookings: [], // Mock empty bookings
  };

  // Helper to map column letter to number (A=1, B=2, etc.)
  const getColNumber = (col: string) => col.charCodeAt(0) - 64;
  const getColLetter = (num: number) => String.fromCharCode(64 + num);

  // Generate sample seat map matching Seat interface
  const seats: Seat[] = useMemo(() => {
    const generatedSeats: Seat[] = [];
    const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"];

    let idCounter = 1;
    for (let row = 40; row <= 45; row++) {
      columns.forEach((col) => {
        const seatNum = getColNumber(col);
        const isAvailable = Math.random() > 0.3;

        // Determine features based on position (mock logic)
        let isPreferred = false;
        let isExitRow = false;
        let isPriority = false;
        let isBabyBassinet = false;
        let isExtraLegroom = false;

        if (row === 42 && col === "B") {
          isPreferred = true;
        } else if (row === 44 && ["A", "K"].includes(col)) {
          isExitRow = true;
        } else if (row === 41 && ["C", "H"].includes(col)) {
          isPriority = true;
        } else if (row === 45 && col === "D") {
          isBabyBassinet = true;
        } else if (["D", "E", "F", "G"].includes(col) && isAvailable) {
          isPreferred = Math.random() > 0.7;
        }

        generatedSeats.push({
          id: idCounter++,
          seatNumber: seatNum,
          seatRow: row.toString(),
          price: isPreferred ? 28 : 0,
          isBooked: !isAvailable,
          isAvailable: isAvailable,
          isExitRow,
          isExtraLegroom,
          // Map other features if needed, using custom logic or extending the mock
          // For this demo, we'll use the boolean flags directly
          flight: flightInfo,
          booking: {} as any, // Mock empty booking
        } as Seat);
      });
    }
    return generatedSeats;
  }, []);

  const handleSeatClick = (seat: Seat) => {
    if (seat.isAvailable && seat.id !== selectedSeatId) {
      setSelectedSeatId(seat.id);
    }
  };

  const selectedSeat = seats.find((s) => s.id === selectedSeatId);

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 2 }}>
      {/* Flight Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={6}>
              <Typography variant="h6">
                {new Date(flightInfo.scheduledDeparture).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {flightInfo.flightNo} • {flightInfo.flightType}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {flightInfo.departureAirport} to {flightInfo.arrivalAirport}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {flightInfo.aircraftCode}
              </Typography>
            </Grid>

            <Grid size={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  {passenger.fullName}
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  {selectedSeat
                    ? `${selectedSeat.seatRow}${getColLetter(
                        selectedSeat.seatNumber
                      )}`
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
                  onClick={() => setSelectedSeatId(null)}
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
                {["A", "B", "C", "", "D", "E", "F", "G", "", "H", "J", "K"].map(
                  (col, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      textAlign="center"
                      fontWeight="bold"
                    >
                      {col}
                    </Typography>
                  )
                )}
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
              {Array.from(new Set(seats.map((seat) => seat.seatRow))).map(
                (row) => (
                  <Box
                    key={row}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ minWidth: 30, textAlign: "right" }}
                    >
                      {row}
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(10, 1fr)",
                        gap: 1,
                      }}
                    >
                      {seats
                        .filter((seat) => seat.seatRow === row)
                        .sort((a, b) => a.seatNumber - b.seatNumber)
                        .map((seat) => {
                          // Determine feature key for color hook
                          let featureKey: keyof import("../Admin/component/Seat/modal/SeatManagementModal").SeatFeatures =
                            "isAvailable";
                          if (seat.isBooked) featureKey = "isBooked";
                          else if (seat.isExitRow) featureKey = "isExitRow";
                          else if (seat.isExtraLegroom)
                            featureKey = "isExtraLegroom";
                          // Add other mappings as needed

                          const { backgroundColor, borderColor, textColor } =
                            useSeatColor({
                              seatFeature: featureKey,
                              selectedSeats:
                                selectedSeatId === seat.id ? [seat] : [],
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
                                  seat.isAvailable && seat.id !== selectedSeatId
                                    ? "pointer"
                                    : "default",
                                opacity: seat.isAvailable ? 1 : 0.5,
                                "&:hover": {
                                  opacity: 0.8,
                                },
                              }}
                              onClick={() => handleSeatClick(seat)}
                            >
                              <Typography variant="caption" fontSize="10px">
                                {getColLetter(seat.seatNumber)}
                              </Typography>
                            </Box>
                          );
                        })}
                    </Box>
                  </Box>
                )
              )}
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
