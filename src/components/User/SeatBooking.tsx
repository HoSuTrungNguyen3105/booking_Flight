import React, { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { Seat } from "../../utils/type";
import { useGetSeatsData } from "../Api/useGetApi";
import DialogConfirm from "../../common/Modal/DialogConfirm";
import { Chair, StarBorder, StarHalfSharp } from "@mui/icons-material";

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

  // const renderSeatButton = (seat: Seat) => {
  //   const isSelected = selectedSeats.includes(seat.id);
  //   const isBooked = seat.isBooked;

  //   return (
  //     <Button
  //       key={seat.id}
  //       onClick={() => !isBooked && handleSelectSeat(seat.id)}
  //       disabled={isBooked}
  //       sx={{
  //         width: "50px",
  //         height: "50px",
  //         borderRadius: "8px",
  //         margin: "4px",
  //         transition: "all 0.2s ease-in-out",
  //         boxShadow: isSelected ? "0 0 10px rgba(0, 255, 0, 0.7)" : "none",
  //         backgroundColor: isBooked
  //           ? "#d3d3d3"
  //           : isSelected
  //           ? "#4caf50"
  //           : "#f5f5f5",
  //         color: isBooked ? "#9e9e9e" : isSelected ? "white" : "#333",
  //         border: `1px solid ${
  //           isBooked ? "#bdbdbd" : isSelected ? "#388e3c" : "#ccc"
  //         }`,
  //         cursor: isBooked ? "not-allowed" : "pointer",
  //         position: "relative",
  //         "&:hover": {
  //           backgroundColor: isBooked
  //             ? "#d3d3d3"
  //             : isSelected
  //             ? "#43a047"
  //             : "#e0e0e0",
  //           transform: isBooked ? "none" : "scale(1.05)",
  //         },
  //       }}
  //     >
  //       {isBooked ? (
  //         <span
  //           style={{
  //             position: "absolute",
  //             top: "50%",
  //             left: "50%",
  //             transform: "translate(-50%, -50%)",
  //             color: "#616161",
  //             fontSize: "20px",
  //           }}
  //         >
  //           ✖
  //         </span>
  //       ) : (
  //         `${seat.row}${seat.column}`
  //       )}
  //     </Button>
  //   );
  // };
  type LegendItemProps = {
    color: string;
    label: string;
    icon?: React.ReactNode;
  };
  const LegendItem = ({ color, label, icon }: LegendItemProps) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Box
        sx={{
          width: "20px",
          height: "20px",
          backgroundColor: color,
          borderRadius: "4px",
          border: "1px solid #ccc",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {icon}
      </Box>
      <Typography variant="body2" sx={{ color: "#555" }}>
        {label}
      </Typography>
    </Box>
  );

  const renderSeatButton = (seat: Seat) => {
    const isSelected = selectedSeats.includes(seat.id);
    const isBooked = seat.isBooked;

    // Determine seat styles based on type
    let seatColor = "#f5f5f5"; // Available
    let icon = null;

    if (isBooked) {
      seatColor = "#d3d3d3"; // Booked
    } else if (isSelected) {
      seatColor = "#4caf50"; // Selected
    } else if (seat.type === "VIP") {
      seatColor = "#f9a825"; // VIP
      icon = <StarBorder />;
    } else if (seat.type === "ECONOMY") {
      seatColor = "#29b6f6"; // More Space
      icon = <Chair />;
    }

    const isWindow = seat.type === "window";
    const isAisle = seat.type === "aisle";

    return (
      <Button
        key={seat.id}
        onClick={() => !isBooked && handleSelectSeat(seat.id)}
        disabled={isBooked}
        sx={{
          width: "55px",
          height: "55px",
          borderRadius: "8px",
          margin: "4px",
          transition: "all 0.2s ease-in-out",
          boxShadow: isSelected ? "0 0 10px rgba(0, 255, 0, 0.7)" : "none",
          backgroundColor: seatColor,
          color: isBooked ? "#9e9e9e" : isSelected ? "white" : "#333",
          border: `1px solid ${
            isBooked ? "#bdbdbd" : isSelected ? "#388e3c" : "#ccc"
          }`,
          cursor: isBooked ? "not-allowed" : "pointer",
          position: "relative",
          "&:hover": {
            backgroundColor: isBooked
              ? "#d3d3d3"
              : isSelected
              ? "#43a047"
              : "#e0e0e0",
            transform: isBooked ? "none" : "scale(1.05)",
          },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isBooked ? (
          <span style={{ fontSize: "20px", color: "#616161" }}>✖</span>
        ) : (
          <>
            <Typography
              variant="caption"
              sx={{ fontSize: "12px", lineHeight: 1 }}
            >
              {seat.row}
              {seat.column}
            </Typography>
            {(isWindow ||
              isAisle ||
              seat.type === "VIP" ||
              seat.type === "ECONOMY") && (
              <span
                style={{ fontSize: "10px", marginTop: "2px", opacity: 0.8 }}
              >
                {isWindow && "Window"}
                {isAisle && "Aisle"}
                {seat.type === "VIP"}
                {seat.type === "ECONOMY"}
              </span>
            )}
          </>
        )}
      </Button>
    );
  };

  function Window() {
    return (
      <Box
        sx={{
          width: 28,
          height: 28,
          border: "2px solid #90caf9",
          borderRadius: "6px",
          backgroundColor: "#e3f2fd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.7rem",
          fontWeight: 500,
          color: "#1976d2",
        }}
      >
        Window
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "8px",
        maxWidth: "100%",
        margin: "0 auto",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", marginBottom: "24px" }}
      >
        Chọn Chỗ Ngồi
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <LegendItem color="#4caf50" label="Đã Chọn" />
        <LegendItem color="#f5f5f5" label="Còn Trống" />
        <LegendItem color="#d3d3d3" label="Đã Đặt" />
        <LegendItem color="#f9a825" label="VIP" icon={<StarHalfSharp />} />
        <LegendItem
          color="#29b6f6"
          label="Hàng Ghế Thoáng"
          icon={<StarHalfSharp />}
        />
      </Box>

      <Stack
        spacing={2}
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          padding: "16px",
        }}
      >
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
                alignItems: "center",
                gap: "20px",
              }}
            >
              <Box sx={{ display: "flex", gap: "4px", alignItems: "center" }}>
                <Window />
                {leftSide.map((seat) => renderSeatButton(seat))}
              </Box>

              <Box sx={{ width: "40px", textAlign: "center" }}>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {row}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: "4px", alignItems: "center" }}>
                {rightSide.map((seat) => renderSeatButton(seat))}
                <Window />
              </Box>
            </Box>
          );
        })}
      </Stack>

      <Box
        sx={{
          marginTop: "32px",
          borderTop: "1px solid #e0e0e0",
          paddingTop: "24px",
        }}
      >
        {/* {selectedSeats.length > 0 && (
          <Typography variant="body1" sx={{ marginBottom: "16px" }}>
            Selected seats:{" "}
            <strong>
              {selectedSeats
                .map(
                  (id) =>
                    seats?.find((s) => s?.id === id).row +
                    seats?.find((s) => s?.id === id).column
                )
                .join(", ")}
            </strong>
          </Typography>
        )} */}
        <button
          onClick={handleOpenModal}
          disabled={selectedSeats.length === 0}
          style={{
            padding: "12px 24px",
            background: selectedSeats.length > 0 ? "#1976d2" : "#a9a9a9",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: selectedSeats.length > 0 ? "pointer" : "not-allowed",
            transition: "background-color 0.3s",
          }}
        >
          Xác Nhận Đặt Ghế ({selectedSeats.length})
        </button>
      </Box>
      {message && (
        <p style={{ marginTop: "20px", color: "green", fontWeight: "bold" }}>
          {message}
        </p>
      )}

      {/* DialogConfirm (unchanged for brevity) */}
      <DialogConfirm
        icon="warning"
        cancelLabel="Exit"
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmBooking} // onConfirm={async () => { // const response = await requestTransferAdmin({ data: myInfo }); //   if (response.approve) { //     handleRefresh(); //   } // }}
        title="Xác nhận"
        message="Bạn có chắc chắn muốn thực hiện hành động này không?"
        confirmLabel="Xác nhận"
      />
    </Box>
  );
};

export default SeatBooking;
