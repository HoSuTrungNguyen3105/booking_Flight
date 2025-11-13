import type { DataFlight, MealOrder, Passenger } from "../../../utils/type";

export type MealOrderToBooking = Omit<MealOrder, "bookingId">;

export type BookingState = {
  selectedFlight: DataFlight | null;
  selectedSeats: string[];
  mealOrders: MealOrderToBooking[];
  passengerInfo: Partial<Passenger>;
  paymentStatus: "idle" | "processing" | "success" | "failed";
  bookingConfirmed: boolean;
};

export const initialState: BookingState = {
  selectedFlight: null,
  selectedSeats: [],
  mealOrders: [],
  passengerInfo: {},
  paymentStatus: "idle",
  bookingConfirmed: false,
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
}

export type Action =
  | { type: ACTIONS.SELECT_FLIGHT; payload: DataFlight }
  | { type: ACTIONS.SELECT_SEATS; payload: string[] }
  | { type: ACTIONS.UPDATE_MEAL; id: number; mealId: number; quantity: number }
  | { type: ACTIONS.SET_PASSENGER_INFO; payload: Partial<Passenger> }
  | { type: ACTIONS.PROCESS_PAYMENT }
  | { type: ACTIONS.PAYMENT_SUCCESS }
  | { type: ACTIONS.PAYMENT_FAIL }
  | { type: ACTIONS.CONFIRM_BOOKING }
  | { type: ACTIONS.RESET };
