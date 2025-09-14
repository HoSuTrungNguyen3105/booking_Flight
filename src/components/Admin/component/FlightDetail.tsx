import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  Paper,
} from "@mui/material";
import {
  Close,
  Flight,
  Schedule,
  AirplanemodeActive,
} from "@mui/icons-material";
import type { DataFlight } from "../../../utils/type";
import type { GridRowDef } from "../../../common/DataGrid";

interface FlightDetailModalProps {
  open: boolean;
  flightId: GridRowDef | null;
  flight: DataFlight | null;

  onClose: () => void;
}

const FlightDetail: React.FC<FlightDetailModalProps> = ({
  open,
  flight,
  onClose,
}) => {
  if (!flight) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Flight />
        Flight Details - {flight.flightNo}
        <Button
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Flight Summary */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="h6" gutterBottom>
                {flight.departureAirport} → {flight.arrivalAirport}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Chip
                  label={flight.status}
                  color={
                    flight.status === "scheduled"
                      ? "primary"
                      : flight.status === "departed"
                      ? "success"
                      : flight.status === "cancelled"
                      ? "error"
                      : flight.status === "delayed"
                      ? "warning"
                      : "default"
                  }
                  size="small"
                />
                <Chip
                  label={flight.flightType}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Grid>
            <Grid size={12} sx={{ textAlign: "right" }}>
              <Typography variant="h4" color="primary">
                {flight.flightNo}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aircraft: {flight.aircraftCode}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          {/* Schedule Information */}
          <Grid size={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Schedule /> Schedule
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Departure</Typography>
              <Typography>
                {new Date(Number(flight.scheduledDeparture)).toLocaleString()}
              </Typography>
              {flight.actualDeparture && (
                <Typography variant="body2" color="text.secondary">
                  Actual:{" "}
                  {new Date(Number(flight.actualDeparture)).toLocaleString()}
                </Typography>
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Arrival</Typography>
              <Typography>
                {new Date(Number(flight.scheduledArrival)).toLocaleString()}
              </Typography>
              {flight.actualArrival && (
                <Typography variant="body2" color="text.secondary">
                  Actual:{" "}
                  {new Date(Number(flight.actualArrival)).toLocaleString()}
                </Typography>
              )}
            </Box>

            {(flight.delayMinutes ?? 0) > 0 && (
              <Box>
                <Typography variant="subtitle2">Delay</Typography>
                <Typography color="warning.main">
                  {flight.delayMinutes} minutes
                </Typography>
                {flight.delayReason && (
                  <Typography variant="body2" color="text.secondary">
                    Reason: {flight.delayReason}
                  </Typography>
                )}
              </Box>
            )}
          </Grid>

          {/* Airport Information */}
          <Grid size={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <AirplanemodeActive /> Airports
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Departure Airport</Typography>
              <Typography>{flight.departureAirport}</Typography>
              {flight.gate && (
                <Typography variant="body2">Gate: {flight.gate}</Typography>
              )}
              {flight.terminal && (
                <Typography variant="body2">
                  Terminal: {flight.terminal}
                </Typography>
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Arrival Airport</Typography>
              <Typography>{flight.arrivalAirport}</Typography>
            </Box>

            {flight.isCancelled && flight.cancellationReason && (
              <Box sx={{ p: 1, bgcolor: "error.light", borderRadius: 1 }}>
                <Typography variant="subtitle2" color="error.dark">
                  Cancellation Reason
                </Typography>
                <Typography variant="body2">
                  {flight.cancellationReason}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Price Information */}
        <Typography variant="h6" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={2}>
          <Grid size={4}>
            <Typography variant="subtitle2">Economy</Typography>
            <Typography>${flight.priceEconomy?.toLocaleString()}</Typography>
          </Grid>
          <Grid size={4}>
            <Typography variant="subtitle2">Business</Typography>
            <Typography>${flight.priceBusiness?.toLocaleString()}</Typography>
          </Grid>
          <Grid size={4}>
            <Typography variant="subtitle2">First Class</Typography>
            <Typography>${flight.priceFirst?.toLocaleString()}</Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button variant="contained" color="primary">
          Book This Flight
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FlightDetail;
