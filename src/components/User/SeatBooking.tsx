import React, { useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import type { Seat } from "../../utils/type";
import { useGetSeatsData } from "../Api/useGetApi";
import DialogConfirm from "../../common/Modal/DialogConfirm";

const SeatBooking: React.FC = () => {
  const { getSeatData } = useGetSeatsData();
  const seats: Seat[] = getSeatData?.list ?? [];
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleSelectSeat = (seatId: number) => {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat || seat.isBooked) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleOpenModal = () => {
    if (selectedSeats.length === 0) {
      setMessage("Please select at least one seat.");
      return;
    }
    setOpenModal(true);
  };

  const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) {
      setMessage("Please select at least one seat.");
      return;
    }
    setMessage(`Booking successful! Seats booked: ${selectedSeats.join(", ")}`);
    setSelectedSeats([]);
    setOpenModal(false);
  };

  const renderSeatButton = (seat: Seat) => (
    <Button
      key={seat.id}
      onClick={() => handleSelectSeat(seat.id)}
      disabled={seat.isBooked}
      sx={{
        width: "45px",
        height: "45px",
        borderRadius: "8px",
        margin: "3px",
        backgroundColor: seat.isBooked
          ? "gray"
          : selectedSeats.includes(seat.id)
          ? "green"
          : "white",
        color: seat.isBooked ? "white" : "black",
        border: "1px solid #333",
        cursor: seat.isBooked ? "not-allowed" : "pointer",
        "&:hover": {
          backgroundColor: seat.isBooked
            ? "gray"
            : selectedSeats.includes(seat.id)
            ? "darkgreen"
            : "#f0f0f0",
        },
      }}
    >
      {seat.row}
      {seat.column}
    </Button>
  );

  return (
    <Box sx={{ padding: "10px", textAlign: "center" }}>
      {/* Seat Layout */}
      <Stack>
        {Array.from(new Set(seats.map((s) => s.row))).map((row) => {
          const rowSeats = seats.filter((s) => s.row === row);
          const leftSide = rowSeats.filter((s) =>
            ["A", "B", "C"].includes(s.column)
          );
          const rightSide = rowSeats.filter((s) =>
            ["D", "E", "F"].includes(s.column)
          );

          return (
            <Box
              key={row}
              sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "8px",
              }}
            >
              {/* Left side */}
              <Box sx={{ display: "flex" }}>
                {leftSide.map((seat) => renderSeatButton(seat))}
              </Box>

              {/* Aisle */}
              <Box sx={{ width: "40px" }} />

              {/* Right side */}
              <Box sx={{ display: "flex" }}>
                {rightSide.map((seat) => renderSeatButton(seat))}
              </Box>
            </Box>
          );
        })}
      </Stack>

      {/* Booking Button */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleOpenModal}
          style={{
            padding: "10px 15px",
            background: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Confirm Booking
        </button>
      </div>

      {/* Message */}
      {message && <p style={{ marginTop: "20px" }}>{message}</p>}

      <DialogConfirm
        icon="warning"
        cancelLabel="Exit"
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmBooking}
        // onConfirm={async () => {
        // const response = await requestTransferAdmin({ data: myInfo });
        //   if (response.approve) {
        //     handleRefresh();
        //   }
        // }}
        title="Xác nhận"
        message="Bạn có chắc chắn muốn thực hiện hành động này không?"
        confirmLabel="Xác nhận"
      />
    </Box>
  );
};

export default SeatBooking;
