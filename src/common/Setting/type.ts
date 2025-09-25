import type { DataFlight } from "../../utils/type";

export type BaseFlight = Omit<
  DataFlight,
  | "flightId"
  | "aircraft"
  | "departureAirportRel"
  | "arrivalAirportRel"
  | "meals"
  | "seats"
>;
