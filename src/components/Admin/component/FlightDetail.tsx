import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import BaseModal from "../../../common/Modal/BaseModal";
import InputTextField from "../../../common/Input/InputTextField";
import { useAuth } from "../../../context/AuthContext";
import {
  Close,
  Flight,
  Schedule,
  AirplanemodeActive,
} from "@mui/icons-material";
import type { DataFlight, LeaveRequest } from "../../../utils/type";

interface IRequestLeaveActionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  flightId?: number;
  flight: DataFlight | null;
}

const FlightDetailModal = ({
  open,
  onClose,
  onSuccess,
  flightId,
  flight,
}: IRequestLeaveActionModalProps) => {
  const [note, setNote] = useState("");
  const { user } = useAuth();
  // const { fetchApproveLeaveRequest } = useApproveLeaveRequest(
  //   selectedRows?.id as number
  // );

  // const { fetchRejectLeaveRequest } = useRejectLeaveRequest(
  //   selectedRows?.id as number
  // );

  // useEffect(() => {
  //   if (open) {
  //     setNote("");
  //   }
  // }, [open]);

  // const handleApproveSubmit = useCallback(async () => {
  //   const data: SendRequestProps = {
  //     approverId: user?.id as number,
  //     requestId: selectedRows?.employee.id as number,
  //     note: note,
  //   };
  //   const res = await fetchApproveLeaveRequest({
  //     ...data,
  //   });
  //   if (res?.resultCode == "00") {
  //     onSuccess();
  //     setNote("");
  //   } else setNote("");
  // }, [onSuccess, fetchApproveLeaveRequest]);

  // const handleRejectSubmit = useCallback(async () => {
  //   const data: SendRequestProps = {
  //     approverId: user?.id as number,
  //     requestId: selectedRows?.employee.id as number,
  //     note: note,
  //   };
  //   const res = await fetchRejectLeaveRequest({
  //     ...data,
  //   });
  //   if (res?.resultCode == "00") {
  //     onSuccess();
  //     setNote("");
  //   } else setNote("");
  // }, [onSuccess, fetchRejectLeaveRequest]);

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button variant="contained" color="primary">
          Book This Flight
        </Button>
      </Box>
    );
  }, []);

  const renderRowDetail = useCallback(() => {
    if (!flight) return null;

    return (
      <>
        <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="h6" gutterBottom>
                {/* {flight.departureAirport} → {flight.arrivalAirport} */}
                flight flightId
                {/* {JSON.stringify(getFlightByIdData, null, 2)} */}
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
      </>
    );
  }, []);

  const renderContent = useCallback(() => {
    if (!flight) return null;

    return (
      <>
        <Paper
          elevation={1}
          sx={{ p: 3, mb: 3, maxWidth: "50rem", bgcolor: "grey.50" }}
        >
          <Grid container spacing={3} alignItems="center">
            {/* Route Section */}
            <Grid size={12}>
              <Box sx={{ textAlign: "center" }}>
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
          {renderRowDetail()}
        </Paper>
      </>
    );
  }, [note]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`원본 데이터, 통계 데이터 학습 Seq${flight?.flightId} 상세 정보`}
      Icon={PrivacyTipIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
      fullWidth
    />
  );
};

export default memo(FlightDetailModal);
