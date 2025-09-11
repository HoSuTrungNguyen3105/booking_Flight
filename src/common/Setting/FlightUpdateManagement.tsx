import React, { memo, useState } from "react";
import FlightUpdateModal from "../Sample/FlightUpdateModal";
import { Button } from "@mui/material";
import type { Flight } from "./type";

const sampleFlight: Flight = {
  flightId: 3,
  flightNo: "VN123",
  flightType: "oneway",
  departureAirport: "SGN",
  arrivalAirport: "HAN",
  status: "scheduled",
  aircraftCode: "A321",
  aircraft: {
    code: "A321",
    model: "Airbus A321neo",
    range: 7400,
  },
  departureAirportRel: {
    code: "SGN",
    name: "Tân Sơn Nhất International Airport",
    city: "Ho Chi Minh City",
    coordinates: "10.8188° N, 106.6520° E",
    timezone: "GMT+7",
  },
  arrivalAirportRel: {
    code: "HAN",
    name: "Nội Bài International Airport",
    city: "Hanoi",
    coordinates: "21.2211° N, 105.8072° E",
    timezone: "GMT+7",
  },
  scheduledDeparture: 1757045077000,
  scheduledArrival: 1757052277000,
  actualDeparture: null,
  actualArrival: null,
  priceEconomy: 1500000,
  priceBusiness: 3000000,
  priceFirst: 5000000,
  maxCapacity: 180,
  gate: "A12",
  terminal: "T1",
  isCancelled: false,
  delayMinutes: 15,
  meals: [{ id: 1 }, { id: 2 }, { id: 3 }],
};
const FlightUpdateManagement = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button variant="contained" onClick={() => setOpen(true)} />
      {open && (
        <FlightUpdateModal
          open={open}
          onClose={() => setOpen(false)}
          onSuccess={() => {}}
          flight={sampleFlight}
          onCancel={() => setOpen(false)}
          onUpdate={() => {}}
        />
      )}
    </div>
  );
};

export default memo(FlightUpdateManagement);
