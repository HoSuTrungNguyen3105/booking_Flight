import { type DetailResponseMessage } from "./common.types";
import type { DataFlight } from "./flight.types";
import type { MealOrder } from "./meal.types";
// import type { MealOrder } from "./meal.types";

export type SeatTypeValue = "ECONOMY" | "BUSINESS" | "FIRST" | "VIP";

export interface SeatUpdateProps {
  seatIds: number[];
  data: {
    // type?: SeatTypeValue;
    price?: number;
    isBooked?: boolean;
    isAvailable?: boolean;
    isExtraLegroom?: boolean;
    isExitRow?: boolean;
    isHandicapAccessible?: boolean;
    isNearLavatory?: boolean;
    isUpperDeck?: boolean;
    isWing?: boolean;
    note?: string;
  };
}

export type Seat = {
  id: number;
  seatNumber: number;
  seatRow: string;
  flightId?: number;
  bookingId?: number;
  // type: SeatTypeValue;
  price: number;
  isBooked: boolean;
  isAvailable?: boolean;
  isExtraLegroom?: boolean;
  isExitRow?: boolean;
  isHandicapAccessible?: boolean;
  isNearLavatory?: boolean;
  isUpperDeck?: boolean;
  isWing?: boolean;
  note?: string;
  booking: Booking;
  flight: DataFlight;
};

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  PAID = "PAID",
}

export interface Booking {
  id: number;
  bookingTime: string;
  flightId: number;
  bookingCode?: string;
  passengerId: string;
  seatNo: string;
  seatClass: string;
  seatPrice?: number;

  status: BookingStatus;
  mealOrders: MealOrder[];
  flight: DataFlight;
  seat: Seat;
  passenger: Passenger;
  tickets: Ticket[];
}

export interface Ticket {
  id: number;
  ticketNo: string;
  passengerId: string;
  qrCodeImage?: string;
  flightId: number;
  // seatClass: string;
  // seatNo: string;

  // seatPrice: number;
  // bookedAt: string; // ISO datetime hoặc number nếu backend trả về timestamp
  // id          Int     @id @default(autoincrement())
  // ticketNo    String  @unique
  bookingId?: number;
  // passengerId String
  // flightId    Int
  // qrCodeImage String? @db.Text

  // Quan hệ
  bookings: Booking;
  // Quan hệ
  passenger?: Passenger;
  flight?: DataFlight;
  boardingPass?: BoardingPass | null;
  baggage?: Baggage;
  payments?: Payment[];
}

export enum PaymentMethod {
  MOMO = "MOMO",
  ZALOPAY = "ZALOPAY",
  STRIPE = "STRIPE",
}

export enum PaymentStatus {
  PENDING = "PENDING", // chưa thanh toán
  SUCCESS = "SUCCESS", // thanh toán thành công
  FAILED = "FAILED", // thất bại
  CANCELLED = "CANCELLED", // hủy
}

// Type cho Payment
export interface Payment {
  id: number;
  ticketId: number;
  amount: number; // lưu VNĐ hoặc cents
  currency: string; // "VND" | "USD" ...
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string; // từ Momo/ZaloPay/Stripe
  paymentUrl?: string; // QR code link / checkout link
  createdAt: number; // timestamp (ms)
  updatedAt: number; // timestamp (ms)

  // Nếu muốn reference tới ticket, bạn có thể thêm optional relation
  ticket?: Ticket; // import { Ticket } from './Ticket';
}

export interface BoardingPass {
  id: number;
  ticketId: number;
  issuedAt: string;
  gate: string;
  boardingTime: string;
  flightId: number;
  status: string;

  ticket?: Ticket;
  flight?: DataFlight;
}

export interface Baggage {
  id: number;
  flightId: number;
  weight: number;
  status: string;
  checkedAt: string;
  ticketId: number;

  flight?: DataFlight;
  ticket?: Ticket;
}

export interface Passenger {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passport: string;
  accountLockYn: string;
  isEmailVerified: string;
  lastLoginDate?: number;
  bookings: Booking[];
}

export type SearchBookingFlightProps = {
  id: number;
  passengerId: string;
  flightId: number;
  bookingTime: number;
  flight: DataFlight;
};

export type SearchFlightSearchBookingFlightPropsProps = {
  outbound: SearchBookingFlightProps[];
  inbound: SearchBookingFlightProps[];
};

export type SeatResponseMessage = DetailResponseMessage<Seat>;
export type BookingResponseMessage = DetailResponseMessage<Booking>;
export type PassengerResponseMessage = DetailResponseMessage<Passenger>;
export type TicketResponseMessage = DetailResponseMessage<Ticket>;

export type FlightBookingTicketDetailApiResponse =
  DetailResponseMessage<SearchFlightSearchBookingFlightPropsProps>;

export type FlightBaggageDetailApiResponse = DetailResponseMessage<Baggage>;
