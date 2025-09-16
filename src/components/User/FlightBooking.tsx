import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { useFlightList } from "../Api/useGetApi";

type Flight = {
  id: number;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
};

const FlightBooking: React.FC = () => {
  // const [flights] = useState<Flight[]>(mockFlights);
  const { fetchFlightList } = useFlightList();
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [passengerName, setPassengerName] = useState("");
  const [message, setMessage] = useState("");

  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    setMessage("");
  };

  const handleBooking = () => {
    if (!selectedFlight || !passengerName) {
      setMessage("⚠️ Please select a flight and enter passenger name.");
      return;
    }
    setMessage(
      `✅ Booking successful! Passenger ${passengerName} booked flight ${selectedFlight.flightNumber}.`
    );
    setPassengerName("");
    setSelectedFlight(null);
  };

  return (
    <Box p={3} maxWidth="1000px" mx="auto">
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
        textAlign="center"
        color="primary"
      >
        Flight Info
      </Typography>

      {/* Flight List */}
      <Typography variant="h6" gutterBottom>
        Available Flights
      </Typography>
      <Grid container spacing={3}>
        {fetchFlightList?.list?.map((flight) => (
          <Grid size={12} key={flight.flightId}>
            <Card
              // onClick={() => handleSelectFlight(flight)}
              sx={{
                cursor: "pointer",
                borderRadius: "16px",
                border:
                  selectedFlight?.id === flight.flightId
                    ? "2px solid #0288d1"
                    : "1px solid #e0e0e0",
                boxShadow:
                  selectedFlight?.id === flight.flightId
                    ? "0px 6px 16px rgba(2,136,209,0.3)"
                    : "0px 3px 8px rgba(0,0,0,0.1)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0px 6px 14px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {flight.flightType}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body1">
                    {flight.departureAirport}
                  </Typography>
                  <Typography variant="body1">
                    {flight.arrivalAirport}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  {flight.scheduledDeparture} → {flight.scheduledArrival}
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2, borderRadius: "12px" }}
                  // onClick={() => handleSelectFlight(flight)}
                >
                  Info Flight
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Booking Form */}
      {selectedFlight && (
        <Box
          mt={5}
          p={3}
          borderRadius="16px"
          boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
          bgcolor="white"
          sx={{ animation: "fadeIn 0.5s ease-in-out" }}
        >
          <Typography variant="h6" mb={2} color="primary">
            Flight {selectedFlight.flightNumber}
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              label="Passenger Name"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              sx={{ flex: 1, minWidth: "250px" }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ borderRadius: "12px" }}
              onClick={handleBooking}
            >
              Confirm Booking
            </Button>
          </Box>
        </Box>
      )}

      {/* Message */}
      {message && (
        <Typography
          variant="body1"
          color="success.main"
          mt={3}
          textAlign="center"
          fontWeight="bold"
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default FlightBooking;
