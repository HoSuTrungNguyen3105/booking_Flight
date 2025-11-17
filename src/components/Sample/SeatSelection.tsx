import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  Card,
  CardContent,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  Stack,
} from "@mui/material";
import { Close, Flight } from "@mui/icons-material";

// Types
interface Seat {
  id: string;
  row: number;
  column: string;
  type:
    | "regular"
    | "preferred"
    | "extra-legroom"
    | "exit-row"
    | "priority"
    | "baby-bassinet";
  price?: number;
  available: boolean;
  selected?: boolean;
}

interface Passenger {
  name: string;
  seat?: string;
}

interface FlightInfo {
  date: string;
  flightNumber: string;
  class: string;
  route: string;
  aircraft: string;
}

const SeatSelection: React.FC = () => {
  const [selectedSeatType, setSelectedSeatType] = useState<string>("all");
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  // Mock data
  const flightInfo: FlightInfo = {
    date: "18 Nov 2025",
    flightNumber: "CX542",
    class: "Economy Essential",
    route: "Hong Kong to Tokyo",
    aircraft: "Boeing 777-300",
  };

  const passenger: Passenger = {
    name: "Mrs Eded Ededele",
    seat: "42B",
  };

  const seatTypes = [
    { label: "Extra-legroom seat", value: "extra-legroom", available: false },
    { label: "Preferred seat", value: "preferred", available: true, price: 28 },
    { label: "Regular seat", value: "regular", available: true, price: 0 },
  ];

  const seatFilters = [
    { label: "Available", value: "available", color: "success" },
    { label: "Unavailable", value: "unavailable", color: "default" },
    { label: "Exit row", value: "exit-row", color: "warning" },
    { label: "Priority seat", value: "priority", color: "info" },
    { label: "Selected seat", value: "selected", color: "primary" },
    { label: "Baby bassinet", value: "baby-bassinet", color: "secondary" },
  ];

  // Generate sample seat map
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"];

    for (let row = 40; row <= 45; row++) {
      columns.forEach((col, colIndex) => {
        const seatId = `${row}${col}`;
        let type: Seat["type"] = "regular";
        let available = Math.random() > 0.3;

        // Special seat types
        if (row === 42 && col === "B") {
          type = "preferred";
          available = false; // Already occupied
        } else if (row === 44 && ["A", "K"].includes(col)) {
          type = "exit-row";
        } else if (row === 41 && ["C", "H"].includes(col)) {
          type = "priority";
        } else if (row === 45 && col === "D") {
          type = "baby-bassinet";
        } else if (["D", "E", "F", "G"].includes(col) && available) {
          type = Math.random() > 0.7 ? "preferred" : "regular";
        }

        seats.push({
          id: seatId,
          row,
          column: col,
          type,
          available,
          price: type === "preferred" ? 28 : 0,
        });
      });
    }
    return seats;
  };

  const seats = generateSeats();

  const getSeatColor = (seat: Seat) => {
    if (!seat.available) return "#ccc";
    if (seat.id === selectedSeat) return "#1976d2";

    switch (seat.type) {
      case "preferred":
        return "#ff9800";
      case "extra-legroom":
        return "#4caf50";
      case "exit-row":
        return "#ff9800";
      case "priority":
        return "#9c27b0";
      case "baby-bassinet":
        return "#e91e63";
      default:
        return "#fff";
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.available && seat.id !== passenger.seat) {
      setSelectedSeat(seat.id);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 2 }}>
      {/* Flight Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={6}>
              <Typography variant="h6">{flightInfo.date}</Typography>
              <Typography variant="body1" fontWeight="bold">
                {flightInfo.flightNumber} • {flightInfo.class}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {flightInfo.route}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {flightInfo.aircraft}
              </Typography>
            </Grid>

            <Grid size={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  {passenger.name}
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  {passenger.seat}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">Preferred seat</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    USD{28}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Remove
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

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
              {Array.from(new Set(seats.map((seat) => seat.row))).map((row) => (
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
                      .filter((seat) => seat.row === row)
                      .sort((a, b) => a.column.localeCompare(b.column))
                      .map((seat) => (
                        <Box
                          key={seat.id}
                          sx={{
                            width: 32,
                            height: 32,
                            border: `2px solid ${
                              !seat.available
                                ? "#ccc"
                                : seat.id === selectedSeat
                                ? "#1976d2"
                                : seat.type === "preferred"
                                ? "#ff9800"
                                : "#666"
                            }`,
                            backgroundColor: getSeatColor(seat),
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor:
                              seat.available && seat.id !== passenger.seat
                                ? "pointer"
                                : "default",
                            opacity: seat.available ? 1 : 0.5,
                            "&:hover": {
                              backgroundColor:
                                seat.available && seat.id !== passenger.seat
                                  ? "#e3f2fd"
                                  : undefined,
                            },
                          }}
                          onClick={() => handleSeatClick(seat)}
                        >
                          <Typography variant="caption" fontSize="10px">
                            {seat.column}
                          </Typography>
                        </Box>
                      ))}
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
              {seatTypes.map((type) => (
                <Box
                  key={type.value}
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
                        checked={selectedSeatType === type.value}
                        onChange={() => setSelectedSeatType(type.value)}
                        disabled={!type.available}
                      />
                    }
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Typography variant="body2">{type.label}</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {type.price !== undefined
                            ? `From USD${type.price}`
                            : "Not available"}
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              ))}
            </FormGroup>
          </Paper>

          {/* Seat Legend */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Seat Legend
            </Typography>
            <Stack spacing={1}>
              {seatFilters.map((filter) => (
                <Box
                  key={filter.value}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor:
                        filter.value === "available"
                          ? "#fff"
                          : filter.value === "unavailable"
                          ? "#ccc"
                          : filter.value === "exit-row"
                          ? "#ff9800"
                          : filter.value === "priority"
                          ? "#9c27b0"
                          : filter.value === "selected"
                          ? "#1976d2"
                          : filter.value === "baby-bassinet"
                          ? "#e91e63"
                          : "#fff",
                      border: `1px solid ${
                        filter.value === "available" ? "#666" : "transparent"
                      }`,
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2">{filter.label}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SeatSelection;
