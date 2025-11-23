import { type DetailResponseMessage } from "./common.types";
import type { DataFlight } from "./flight.types";
import type { Booking } from "./booking.types";

export interface FlightMeal {
  id: number;
  flightMealCode: string;
  flightId: number;
  mealId: number;
  quantity: number;
  price?: number;
  flight: DataFlight;
  meal: Meal;
}

export interface Meal {
  id: number;
  mealCode: string;
  name: string;
  mealType: string;
  description?: string;
  price: number;
  isAvailable: boolean;
  flightMeals: FlightMeal[];
}

export interface CreateMealDto extends Omit<Meal, "id" | "flightMeals"> {}

export type CreateFlightMealProps = Omit<FlightMeal, "id" | "meal" | "flight">;

export type MealType =
  | "VEG"
  | "NONVEG"
  | "DRINK"
  | "DESSERT"
  | "BEVERAGE"
  | "SNACK"
  | "DINNER"
  | "LUNCH"
  | "BREAKFAST";

export type MealRequestDto = Omit<Meal, "id" | "flightMeals">;

export interface MealOrder {
  id: number;
  bookingId: number;
  flightMealId: number;
  quantity: number;
  booking: Booking;
  flightMeal: FlightMeal;
}

export type MealResponse = DetailResponseMessage<Meal>;
export type FlightMealDetailApiResponse = DetailResponseMessage<FlightMeal>;
