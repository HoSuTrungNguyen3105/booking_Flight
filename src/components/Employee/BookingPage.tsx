import { useEffect, useReducer, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Divider,
  TextField,
  Stack,
} from "@mui/material";
import {
  BookingStatus,
  type Booking,
  type DataFlight,
  type Seat,
} from "../../utils/type";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import { convertCurrency, type Currency } from "../../hooks/format";
import SelectDropdown from "../../common/Dropdown/SelectDropdown";
import {
  mapStringToDropdown,
  useFindAllSeatTypes,
} from "../../context/Api/useGetApi";
import {
  ACTIONS,
  initialState,
  type Action,
  type BookingState,
} from "./types/booking";
import InputTextField from "../../common/Input/InputTextField";

const BookingPage = () => {
  const location = useLocation();
  const { flightId, seats, seatNos, flightData } = location.state as {
    seats: Seat;
    flightData: DataFlight;
    seatNos: string;
    // data: Seat;
    flightId: number;
  };
  const [bookingData, setBookingData] = useState({
    passengerId: "",
    flightId,
    seatId: [] as number[],
    bookingCode: "",
    seatClass: "ECONOMY",
    seatNo: "",
    seatPrice: 0,
    mealOrders: [] as { mealId: number; quantity: number; price: number }[],
  });

  console.log("bookingData", seatNos, flightData);

  const { dataSeatTypes } = useFindAllSeatTypes();
  const optionsSeatTypes = mapStringToDropdown(dataSeatTypes?.data || []);
  const { passenger } = useAuth();
  // const paymoney = localStorage.getItem("paymoney") as Currency;

  const selectedMeals =
    allMeals?.filter((meal) => mealIds.includes(meal.id)) || [];

  const [state, dispatch] = useReducer(
    (state: BookingState, action: Action): BookingState => {
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
            mealOrders = state.mealOrders.map((m) =>
              m.flightMealId === flightMealId ? { ...m, quantity } : m
            );
          } else {
            mealOrders = [...state.mealOrders, { id, flightMealId, quantity }];
          }
          return { ...state, mealOrders };
        }

        case ACTIONS.SET_PASSENGER_INFO:
          return {
            ...state,
            passengerInfo: { ...state.passengerInfo, ...action.payload },
          };
        case ACTIONS.PROCESS_PAYMENT:
          return { ...state, paymentStatus: "processing" };
        case ACTIONS.PAYMENT_SUCCESS:
          return { ...state, paymentStatus: "success" };
        case ACTIONS.PAYMENT_FAIL:
          return { ...state, paymentStatus: "failed" };
        case ACTIONS.CONFIRM_BOOKING:
          return { ...state, bookingConfirmed: true };
        case ACTIONS.RESET:
          return initialState;
        default:
          return state;
      }
    },
    initialState
  );

  const [form, setForm] = useState<
    Omit<Booking, "id" | "mealOrders" | "seat" | "passenger">
  >({
    bookingTime: "",
    flightId: data.flightId || 0,
    bookingCode: "",
    seatNo: "",
    seatPrice: data.price,
    status: BookingStatus.PENDING,
    passengerId: passenger?.id ?? "",
    tickets: [],
    flight: data.flight || null,
    seatClass: "",
  });

  const [bookingCode, setBookingCode] = useState("");

  // Tạo booking code
  useEffect(() => {
    const code = "BK" + Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
    setBookingCode(code);
    setForm((prev) => ({ ...prev, bookingCode: code }));
  }, []);

  const handleChange = (name: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = () => {
    const bookingData = {
      ...form,
      // bookingTime: new Date().toISOString(),
      passengerId: passenger?.id,
      bookingCode,
    };

    console.log("Booking Confirmed:", bookingData);
    alert(`Đặt vé thành công!\nMã đặt chỗ: ${bookingData.bookingCode}`);
  };

  return (
    <Box maxWidth="800px" mx="auto" mt={4}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Đặt vé máy bay
          </Typography>

          <Grid container spacing={2}>
            <Grid size={12}>
              <Box p={2} bgcolor="#f9f9f9" borderRadius={2}>
                <Typography fontWeight={600}>
                  Chuyến bay: {form.flight?.flightNo}
                </Typography>
                <Typography color="text.secondary">
                  {form.flight?.departureAirport} →{" "}
                  {form.flight?.arrivalAirport}
                </Typography>
                <Typography color="text.secondary" mt={1}>
                  {form.flight?.scheduledDeparture &&
                    new Date(
                      form.flight.scheduledDeparture
                    ).toLocaleTimeString()}{" "}
                  →{" "}
                  {form.flight?.scheduledArrival &&
                    new Date(form.flight.scheduledArrival).toLocaleTimeString()}
                </Typography>
              </Box>
            </Grid>

            {hotel && (
              <Card>
                <CardHeader
                  avatar={<HotelIcon sx={{ color: "primary.main" }} />}
                  title="Hotel Details"
                />
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {hotel.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {hotel.location}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="subtitle1" fontWeight="600">
                        ${hotel.pricePerNight}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        per night
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    {hotel.description}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {selectedMeals.length > 0 && (
              <Card>
                <CardHeader
                  avatar={<Restaurant sx={{ color: "primary.main" }} />}
                  title="Selected Meals"
                />
                <CardContent>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {selectedMeals.map((meal) => (
                      <Box
                        key={meal.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography variant="body1" fontWeight="500">
                            {meal.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {meal.category}
                          </Typography>
                        </Box>
                        <Typography variant="subtitle1" fontWeight="600">
                          ${meal.price}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            <Divider sx={{ my: 2, width: "100%" }} />

            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Hạng ghế</InputLabel>
                <SelectDropdown
                  options={optionsSeatTypes}
                  value={form.seatClass}
                  onChange={(e) => handleChange("seatClass", String(e))}
                  placeholder="Hạng ghế"
                />
              </FormControl>
            </Grid>

            <Grid size={6}>
              <InputTextField
                value={form.seatNo}
                onChange={(e) => handleChange("seatNo", e)}
                placeholder="VD: 12A"
              />
            </Grid>

            <Grid size={12}>
              <Box
                mt={2}
                p={2}
                bgcolor="#f1f5ff"
                borderRadius={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontWeight={600}>Giá vé:</Typography>
                <Typography color="primary" fontWeight={700}>
                  {/* {convertCurrency(form.seatPrice ?? 0, paymoney)} */}
                </Typography>
              </Box>
              {hotel && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Hotel (1 night)
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="500"
                    data-testid="text-hotel-total"
                  >
                    ${hotel.pricePerNight.toFixed(2)}
                  </Typography>
                </Box>
              )}

              {selectedMeals.length > 0 && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Meals ({selectedMeals.length} × {passengers})
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="500"
                    data-testid="text-meals-total"
                  >
                    $
                    {(
                      selectedMeals.reduce((sum, m) => sum + m.price, 0) *
                      passengers
                    ).toFixed(2)}
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid size={12}>
              <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
                mt={2}
              >
                <Button variant="outlined" color="secondary">
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBooking}
                  disabled={!form.seatNo || !form.seatClass}
                >
                  Xác nhận đặt vé
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BookingPage;
