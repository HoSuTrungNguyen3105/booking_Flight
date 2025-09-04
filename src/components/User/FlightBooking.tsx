import React, { useState } from "react";

type Flight = {
  id: number;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
};

const mockFlights: Flight[] = [
  {
    id: 1,
    flightNumber: "VN123",
    from: "Hanoi",
    to: "Ho Chi Minh City",
    departureTime: "2025-09-10 08:00",
    arrivalTime: "2025-09-10 10:00",
    price: 120,
  },
  {
    id: 2,
    flightNumber: "VJ456",
    from: "Hanoi",
    to: "Da Nang",
    departureTime: "2025-09-11 09:30",
    arrivalTime: "2025-09-11 11:00",
    price: 90,
  },
];

const FlightBooking: React.FC = () => {
  const [flights] = useState<Flight[]>(mockFlights);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [passengerName, setPassengerName] = useState("");
  const [message, setMessage] = useState("");

  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    setMessage("");
  };

  const handleBooking = () => {
    if (!selectedFlight || !passengerName) {
      setMessage("⚠️ Please select a flight and enter passenger name.");
      return;
    }
    setMessage(
      `✅ Booking successful! Passenger ${passengerName} booked flight ${selectedFlight.flightNumber}.`
    );
    setPassengerName("");
    setSelectedFlight(null);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>✈️ Flight Booking</h2>

      {/* Flight List */}
      <h3>Available Flights</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {flights.map((flight) => (
          <li
            key={flight.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              cursor: "pointer",
              background:
                selectedFlight?.id === flight.id ? "#e0f7fa" : "white",
            }}
            onClick={() => handleSelectFlight(flight)}
          >
            <strong>{flight.flightNumber}</strong> - {flight.from} → {flight.to}{" "}
            <br />
            🕑 {flight.departureTime} → {flight.arrivalTime} <br />
            💲 {flight.price} USD
          </li>
        ))}
      </ul>

      {/* Booking Form */}
      {selectedFlight && (
        <div style={{ marginTop: "20px" }}>
          <h3>Booking for Flight {selectedFlight.flightNumber}</h3>
          <input
            type="text"
            placeholder="Enter passenger name"
            value={passengerName}
            onChange={(e) => setPassengerName(e.target.value)}
            style={{
              padding: "8px",
              marginRight: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={handleBooking}
            style={{
              padding: "8px 12px",
              background: "blue",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Book Ticket
          </button>
        </div>
      )}

      {/* Message */}
      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </div>
  );
};

export default FlightBooking;
