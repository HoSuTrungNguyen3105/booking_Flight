import { useState, useRef } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
  Paper,
  Stack,
} from "@mui/material";
// import Cards from "react-credit-cards-2"; // thư viện hiển thị thẻ credit card
// import "react-credit-cards-2/dist/es/styles-compiled.css";
import { CreditCard } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import type { Seat } from "../../utils/type";

interface PaymentFormProps {
  onPay: () => void;
  passengers: string[];
}

const PaymentForm = () => {
  const location = useLocation();
  const seat = location.state?.seat;

  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [focused, setFocused] = useState<keyof typeof formValues | undefined>(
    undefined
  );

  const formValues = { number, name, expiry, cvc };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    setFocused(e.target.name as keyof typeof formValues);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
              <TextField
                label="Card Number"
                name="number"
                placeholder="1234 5678 9012 3456"
                value={number}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                inputProps={{ pattern: "[\\d| ]{16,22}" }}
                required
              />

              <TextField
                label="Name on Card"
                name="name"
                placeholder="John Doe"
                value={name}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                required
              />

              <Grid container spacing={2}>
                <Grid size={6}>
                  <TextField
                    label="Expiry Date"
                    name="expiry"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    inputProps={{ pattern: "\\d\\d/\\d\\d" }}
                    required
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    label="CVC"
                    name="cvc"
                    placeholder="123"
                    value={cvc}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    inputProps={{ pattern: "\\d{3,4}" }}
                    required
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
