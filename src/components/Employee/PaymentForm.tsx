import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Divider,
  Paper,
  Stack,
} from "@mui/material";
import { CreditCard } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import type { Seat } from "../../utils/type";
import InputTextField from "../../common/Input/InputTextField";

const PaymentForm = () => {
  const location = useLocation();
  const seat = location.state?.seat as Seat;
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  type FieldName = "number" | "name" | "expiry" | "cvc";

  const handleInputChange = (name: FieldName, value: string) => {
    switch (name) {
      case "number":
        setNumber(value);
        break;
      case "name":
        setName(value);
        break;
      case "expiry":
        setExpiry(value);
        break;
      case "cvc":
        setCvc(value);
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // onPay();
  };

  if (!seat) {
    return (
      <Typography variant="h5" fontWeight={700} mt={1} ml={3}>
        No seat
      </Typography>
    );
  }

  return (
    <Grid container spacing={4} sx={{ p: 4 }}>
      {/* ===== LEFT: PAYMENT FORM ===== */}
      <Grid size={6}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} mb={3}>
            Enter Credit Card Details
          </Typography>

          <Box display="flex" justifyContent="center" mb={3}>
            <CreditCard />
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
              <InputTextField
                name="number"
                placeholder="1234 5678 9012 3456"
                value={number}
                onChange={(e) => handleInputChange("number", e)}
              />

              <InputTextField
                name="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => handleInputChange("name", e)}
              />

              <Grid container spacing={2}>
                <Grid size={6}>
                  <InputTextField
                    name="expiry"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => handleInputChange("expiry", e)}
                  />
                </Grid>
                <Grid size={6}>
                  <InputTextField
                    name="cvc"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => handleInputChange("cvc", e)}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ borderRadius: 2, py: 1.5, fontWeight: 600 }}
              >
                Pay Now
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Grid>

      {/* ===== RIGHT: BOOKING DETAILS ===== */}
      <Grid size={6}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} mb={2}>
            Swadeshi Airlines
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" mb={3}>
            Booking Details
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid size={6}>
              <Typography color="text.secondary">Username</Typography>
              <Typography fontWeight={600}>{`${seat.id}`}</Typography>

              <Typography color="text.secondary" mt={2}>
                Date
              </Typography>
              <Typography fontWeight={600}>{`${seat.seatNumber}`}</Typography>

              <Typography color="text.secondary" mt={2}>
                From
              </Typography>
              <Typography fontWeight={600}>{`${seat.seatRow}`}</Typography>

              <Typography color="text.secondary" mt={2}>
                To
              </Typography>
              <Typography fontWeight={600}>
                {localStorage.getItem("destination")}
              </Typography>

              <Typography color="text.secondary" mt={2}>
                Passengers
              </Typography>
              {/* {passengers.map((p, i) => (
                <Typography key={i} fontWeight={600}>
                  {p}
                </Typography>
              ))} */}
            </Grid>

            <Grid size={6}>
              <Typography color="text.secondary">Seat No</Typography>
              <Typography fontWeight={600}>
                {localStorage.getItem("seatNo") || "N/A"}
              </Typography>

              <Typography color="text.secondary" mt={2}>
                Ticket Price
              </Typography>
              <Typography fontWeight={600}>
                ${localStorage.getItem("price") || "0"}
              </Typography>

              <Typography color="text.secondary" mt={2}>
                Tax
              </Typography>
              <Typography fontWeight={600}>$5</Typography>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" fontWeight={700}>
                Total: ${Number(localStorage.getItem("price") || 0) + 5}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PaymentForm;
