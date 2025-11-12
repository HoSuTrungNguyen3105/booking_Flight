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
  type Passenger,
  type Seat,
} from "../../utils/type"; // lấy enum từ model anh có
import { random } from "lodash";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import { convertCurrency, type Currency } from "../../hooks/format";
import SelectDropdown from "../../common/Dropdown/SelectDropdown";
import {
  mapStringToDropdown,
  useFindAllSeatTypes,
} from "../../context/Api/useGetApi";
// import { formatCurrency } from "./../../hooks/format";

export type CreateBookingProps = Omit<
  Booking,
  "id" | "mealOrders" | "seat" | "passenger"
>;

// const initialState = {
//   selectedFlight: null,
//   selectedSeats: [],
//   passengerInfo: {
//     name: "",
//     email: "",
//     phone: "",
//   },
//   paymentStatus: "idle" as "idle" | "processing" | "success" | "failed",
//   bookingConfirmed: false,
// };

// const ACTIONS = {
//   SELECT_FLIGHT: "select_flight",
//   SELECT_SEATS: "select_seats",
//   SET_PASSENGER_INFO: "set_passenger_info",
//   PROCESS_PAYMENT: "process_payment",
//   PAYMENT_SUCCESS: "payment_success",
//   PAYMENT_FAIL: "payment_fail",
//   CONFIRM_BOOKING: "confirm_booking",
//   RESET: "reset",
// };

// export type Action =
//   | { type: typeof ACTIONS.SELECT_FLIGHT; payload: DataFlight }
//   | { type: typeof ACTIONS.SELECT_SEATS; payload: string[] }
//   | { type: typeof ACTIONS.SET_PASSENGER_INFO; payload: Partial<Passenger> }
//   | { type: typeof ACTIONS.PROCESS_PAYMENT }
//   | { type: typeof ACTIONS.PAYMENT_SUCCESS }
//   | { type: typeof ACTIONS.PAYMENT_FAIL; error?: string }
//   | { type: typeof ACTIONS.CONFIRM_BOOKING; payload?: Booking }
//   | { type: typeof ACTIONS.RESET };

// type BookingState = typeof initialState;

const BookingPage = () => {
  const location = useLocation();
  const data = location.state.seat as Seat;

  const { dataSeatTypes } = useFindAllSeatTypes();
  const optionsSeatTypes = mapStringToDropdown(dataSeatTypes?.data || []);
  const [booking, setBooking] = useState<Booking | null>(null);
  const { passenger } = useAuth();

  const paymoney = localStorage.getItem("paymoney");

  function bookingReducer(state: BookingState, action: Action): BookingState {
    switch (action.type) {
      case ACTIONS.SELECT_FLIGHT:
        return { ...state, selectedFlight: action.payload };

      case ACTIONS.SELECT_SEATS:
        return { ...state, selectedSeats: action.payload };

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
  }

  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const [form, setForm] = useState<CreateBookingProps>({
    bookingTime: booking?.bookingTime ?? "",
    flightId: booking?.flightId ?? 0,
    bookingCode: booking?.bookingCode ?? "",
    seatNo: booking?.seatNo ?? "",
    seatPrice: booking?.seatPrice ?? 0,
    status: booking?.status ?? BookingStatus.PENDING,
    passengerId: booking?.passengerId ?? "",
    tickets: booking?.tickets ?? [],
    flight: booking?.flight as DataFlight,
    seatClass: booking?.seatClass ?? "",
  });

  const handleChange = (name: keyof CreateBookingProps, value: string) => {
    setForm((prev) => ({
      ...prev,
      // [name]: value,
      // seatPrice:
      //   name === "seatClass"
      //     ? form.seatClass[value as keyof typeof form.seatClass]
      //     : prev.seatPrice,
    }));
  };

  const [bookingCode, setBookingCode] = useState("");

  useEffect(() => {
    // Tạo bookingCode khi component mount
    const code = "BK" + random(10000, 99999, true);
    setBookingCode(code);
  }, []);

  const handleBooking = () => {
    const bookingData = {
      ...form,
      bookingTime: new Date().toISOString(),
      passengerId: passenger?.id,
      bookingCode, // dùng state bookingCode
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
            {/* Thông tin chuyến bay */}
            <Grid size={12}>
              <Box p={2} bgcolor="#f9f9f9" borderRadius={2}>
                <Typography fontWeight={600}>
                  Chuyến bay: {form.flight.flightNo}
                </Typography>
                <Typography color="text.secondary">
                  {form.flight.departureAirport} → {form.flight.arrivalAirport}
                </Typography>
                <Typography color="text.secondary" mt={1}>
                  {new Date(
                    form.flight.scheduledDeparture
                  ).toLocaleTimeString()}{" "}
                  →{" "}
                  {new Date(form.flight.scheduledArrival).toLocaleTimeString()}
                </Typography>
              </Box>
            </Grid>

            <Divider sx={{ my: 2, width: "100%" }} />

            {/* Form chọn chỗ */}
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
              <TextField
                label="Số ghế"
                fullWidth
                value={data.seatNumber}
                onChange={(e) => handleChange("seatNo", e.target.value)}
                placeholder="VD: 12A"
              />
            </Grid>

            {/* Giá vé */}
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
                  {convertCurrency(data?.price, paymoney as Currency)}
                  {/* {form.seatPrice > 0 ? convertCurrency(form.seatPrice) : "Chưa chọn hạng ghế"} */}
                </Typography>
              </Box>
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
                  disabled={!form.seatNo}
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
