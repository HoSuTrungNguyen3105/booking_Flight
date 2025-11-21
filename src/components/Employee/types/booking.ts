import type {
  Booking,
  DataFlight,
  FlightMeal,
  MealOrder,
  Passenger,
} from "../../../utils/type";
import { BookingStatus } from "../../../utils/type";

export type MealOrderToBooking = Omit<
  MealOrder,
  "bookingId" | "booking" | "flightMeal"
> & {
  booking?: Booking;
  flightMeal?: FlightMeal;
};

export type BookingState = {
  selectedFlight: DataFlight | null;
  selectedSeats: string[];
  mealOrders: MealOrderToBooking[];
  passengerInfo: Partial<Passenger>;
  paymentStatus: "idle" | "processing" | "success" | "failed";
  bookingConfirmed: boolean;
  // Consolidated state from useState
  bookingData: {
    passengerId: string;
    flightId: number;
    seatId: number[];
    bookingCode: string;
    seatClass: string;
    seatNo: string;
    seatPrice: number;
    mealOrders: { mealId: number; quantity: number; price: number }[];
  };
  form: Omit<Booking, "id" | "mealOrders" | "flight" | "seat" | "passenger">;
};

export const initialState: BookingState = {
  selectedFlight: null,
  selectedSeats: [],
  mealOrders: [],
  passengerInfo: {},
  paymentStatus: "idle",
  bookingConfirmed: false,
  bookingData: {
    passengerId: "",
    flightId: 0,
    seatId: [],
    bookingCode: "",
    seatClass: "ECONOMY",
    seatNo: "",
    seatPrice: 0,
    mealOrders: [],
  },
  form: {
    bookingTime: "",
    flightId: 0,
    bookingCode: "",
    seatNo: "",
    seatPrice: 0,
    status: BookingStatus.PENDING,
    passengerId: "",
    tickets: [],
    seatClass: "",
  },
};

export enum ACTIONS {
  SELECT_FLIGHT = "SELECT_FLIGHT",
  SELECT_SEATS = "SELECT_SEATS",
  UPDATE_MEAL = "UPDATE_MEAL",
  SET_PASSENGER_INFO = "SET_PASSENGER_INFO",
  PROCESS_PAYMENT = "PROCESS_PAYMENT",
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  PAYMENT_FAIL = "PAYMENT_FAIL",
  CONFIRM_BOOKING = "CONFIRM_BOOKING",
  RESET = "RESET",
  // New actions
  SET_INITIAL_DATA = "SET_INITIAL_DATA",
  SET_BOOKING_CODE = "SET_BOOKING_CODE",
  UPDATE_FORM_FIELD = "UPDATE_FORM_FIELD",
}

export type Action =
  | { type: ACTIONS.SELECT_FLIGHT; payload: DataFlight }
  | { type: ACTIONS.SELECT_SEATS; payload: string[] }
  | {
      type: ACTIONS.UPDATE_MEAL;
      id: number;
      flightMealId: number;
      quantity: number;
    }
  | { type: ACTIONS.SET_PASSENGER_INFO; payload: Partial<Passenger> }
  | { type: ACTIONS.PROCESS_PAYMENT }
  | { type: ACTIONS.PAYMENT_SUCCESS }
  | { type: ACTIONS.PAYMENT_FAIL }
  | { type: ACTIONS.CONFIRM_BOOKING }
  | { type: ACTIONS.RESET }
  | {
      type: ACTIONS.SET_INITIAL_DATA;
      payload: { flightId: number; passengerId: string };
    }
  | { type: ACTIONS.SET_BOOKING_CODE; payload: string }
  | {
      type: ACTIONS.UPDATE_FORM_FIELD;
      payload: { name: keyof BookingState["form"]; value: any };
    };
