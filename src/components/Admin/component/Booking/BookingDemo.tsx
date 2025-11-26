import { useReducer, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import {
  ACTIONS,
  initialState,
  type Action,
  type BookingState,
} from "../Admin/component/Booking/booking";
import type { DataFlight, Meal } from "../../utils/type";

// --- MOCK DATA ---
const MOCK_FLIGHT: DataFlight = {
  flightId: 101,
  flightNo: "VN123",
  departureAirport: "HAN",
  arrivalAirport: "SGN",
  scheduledDeparture: Date.now(),
  scheduledArrival: Date.now() + 7200000,
  aircraftCode: "A321",
  priceEconomy: 100,
  priceBusiness: 200,
};

const MOCK_MEALS: Meal[] = [
  {
    id: 1,
    name: "Vegetarian Meal",
    price: 15,
    mealCode: "VG01",
    mealType: "Lunch",
    isAvailable: true,
    flightMeals: [],
  },
  {
    id: 2,
    name: "Chicken Rice",
    price: 20,
    mealCode: "CR01",
    mealType: "Lunch",
    isAvailable: true,
    flightMeals: [],
  },
];

// --- REDUCER (Simplified from BookingPage) ---
const bookingReducer = (state: BookingState, action: Action): BookingState => {
  switch (action.type) {
    case ACTIONS.SELECT_FLIGHT:
      return { ...state, selectedFlight: action.payload };
    case ACTIONS.SELECT_SEATS:
      return { ...state, selectedSeats: action.payload };
    case ACTIONS.UPDATE_MEAL: {
      const { flightMealId, quantity, id } = action;
      const exists = state.mealOrders.find(
        (m) => m.flightMealId === flightMealId
      );
      let mealOrders;
      if (exists) {
        if (quantity <= 0) {
          mealOrders = state.mealOrders.filter(
            (m) => m.flightMealId !== flightMealId
          );
        } else {
          mealOrders = state.mealOrders.map((m) =>
            m.flightMealId === flightMealId ? { ...m, quantity } : m
          );
        }
      } else {
        if (quantity > 0) {
          mealOrders = [...state.mealOrders, { id, flightMealId, quantity }];
        } else {
          mealOrders = state.mealOrders;
        }
      }
      return { ...state, mealOrders };
    }
    case ACTIONS.SET_PASSENGER_INFO:
      return {
        ...state,
        passengerInfo: { ...state.passengerInfo, ...action.payload },
      };
    case ACTIONS.SET_BOOKING_CODE:
      return {
        ...state,
        bookingData: { ...state.bookingData, bookingCode: action.payload },
        form: { ...state.form, bookingCode: action.payload },
      };
    case ACTIONS.CONFIRM_BOOKING:
      return { ...state, bookingConfirmed: true };
    case ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
};

// --- STEPS ---
const steps = [
  "Select Flight",
  "Choose Seats",
  "Add Meals",
  "Passenger Info",
  "Review & Confirm",
];

const BookingDemo = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  // 1. Select Flight
  const handleSelectFlight = () => {
    dispatch({ type: ACTIONS.SELECT_FLIGHT, payload: MOCK_FLIGHT });
    // Generate a random booking code
    const code = "DEMO" + Math.floor(Math.random() * 10000);
    dispatch({ type: ACTIONS.SET_BOOKING_CODE, payload: code });
    handleNext();
  };

  // 2. Select Seats
  const handleSelectSeat = (seat: string) => {
    const isSelected = state.selectedSeats.includes(seat);
    const newSeats = isSelected
      ? state.selectedSeats.filter((s) => s !== seat)
      : [...state.selectedSeats, seat];
    dispatch({ type: ACTIONS.SELECT_SEATS, payload: newSeats });
  };

  // 3. Add Meals
  const handleUpdateMeal = (meal: Meal, qty: number) => {
    dispatch({
      type: ACTIONS.UPDATE_MEAL,
      id: meal.id,
      flightMealId: meal.id, // Mocking flightMealId as meal.id for demo
      quantity: qty,
    });
  };

  // 4. Passenger Info
  const handlePassengerChange = (field: string, value: string) => {
    dispatch({
      type: ACTIONS.SET_PASSENGER_INFO,
      payload: { [field]: value },
    });
  };

  // 5. Confirm
  const handleConfirm = () => {
    dispatch({ type: ACTIONS.CONFIRM_BOOKING });
    alert("Booking Confirmed! Check console for final state.");
    console.log("Final Booking State:", state);
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => {
    dispatch({ type: ACTIONS.RESET });
    setActiveStep(0);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6">Available Flights</Typography>
            <Card variant="outlined" sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6">
                  {MOCK_FLIGHT.flightNo}: {MOCK_FLIGHT.departureAirport} →{" "}
                  {MOCK_FLIGHT.arrivalAirport}
                </Typography>
                <Typography color="textSecondary">
                  Price: ${MOCK_FLIGHT.priceEconomy}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={handleSelectFlight}
                >
                  Select This Flight
                </Button>
              </CardContent>
            </Card>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6">Select Seats</Typography>
            <Box display="flex" gap={2} mt={2}>
              {["1A", "1B", "1C", "2A", "2B", "2C"].map((seat) => (
                <Button
                  key={seat}
                  variant={
                    state.selectedSeats.includes(seat)
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => handleSelectSeat(seat)}
                >
                  {seat}
                </Button>
              ))}
            </Box>
            <Typography mt={2}>
              Selected: {state.selectedSeats.join(", ") || "None"}
            </Typography>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6">Pre-order Meals</Typography>
            <Grid container spacing={2} mt={1}>
              {MOCK_MEALS.map((meal) => {
                const order = state.mealOrders.find(
                  (m) => m.flightMealId === meal.id
                );
                const qty = order?.quantity || 0;
                return (
                  <Grid size={6} key={meal.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography fontWeight="bold">{meal.name}</Typography>
                        <Typography>${meal.price}</Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                          <Button
                            size="small"
                            onClick={() => handleUpdateMeal(meal, qty - 1)}
                          >
                            -
                          </Button>
                          <Typography>{qty}</Typography>
                          <Button
                            size="small"
                            onClick={() => handleUpdateMeal(meal, qty + 1)}
                          >
                            +
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6">Passenger Information</Typography>
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              <TextField
                label="Full Name"
                value={state.passengerInfo.fullName || ""}
                onChange={(e) =>
                  handlePassengerChange("fullName", e.target.value)
                }
              />
              <TextField
                label="Email"
                value={state.passengerInfo.email || ""}
                onChange={(e) => handlePassengerChange("email", e.target.value)}
              />
              <TextField
                label="Phone"
                value={state.passengerInfo.phone || ""}
                onChange={(e) => handlePassengerChange("phone", e.target.value)}
              />
            </Box>
          </Box>
        );
      case 4:
        return (
          <Box>
            <Typography variant="h6">Review Booking</Typography>
            <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
              <Typography>
                <strong>Flight:</strong> {state.selectedFlight?.flightNo}
              </Typography>
              <Typography>
                <strong>Seats:</strong> {state.selectedSeats.join(", ")}
              </Typography>
              <Typography>
                <strong>Passenger:</strong> {state.passengerInfo.fullName} (
                {state.passengerInfo.email})
              </Typography>
              <Typography>
                <strong>Meals:</strong> {state.mealOrders.length} items
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography>
                <strong>Booking Code:</strong> {state.bookingData.bookingCode}
              </Typography>
            </Paper>
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Booking Process Demo
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3, mb: 4 }}>
        {activeStep === steps.length ? (
          <Box textAlign="center">
            <Typography variant="h5" gutterBottom>
              All steps completed
            </Typography>
            <Button onClick={handleReset}>Reset Demo</Button>
          </Box>
        ) : (
          <>
            {getStepContent(activeStep)}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button variant="contained" onClick={handleConfirm}>
                  Confirm Booking
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={activeStep === 0} // Flight selection handles next automatically
                >
                  Next
                </Button>
              )}
            </Box>
          </>
        )}
      </Paper>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Current State (Debug)
        </Typography>
        <Paper
          variant="outlined"
          sx={{ p: 2, bgcolor: "#f5f5f5", overflowX: "auto" }}
        >
          <pre style={{ margin: 0 }}>{JSON.stringify(state, null, 2)}</pre>
        </Paper>
      </Box>
    </Container>
  );
};

export default BookingDemo;
