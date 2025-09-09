import React, { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { Seat } from "../../utils/type";
import { useGetSeatByAircraftCode, useGetSeatsData } from "../Api/useGetApi";
import DialogConfirm from "../../common/Modal/DialogConfirm";
import { Chair, StarBorder, StarHalfSharp } from "@mui/icons-material";
type AircraftCodeProps = {
  code: string;
};
const SeatBooking: React.FC<AircraftCodeProps> = ({ code }) => {
  const { getSeatData } = useGetSeatsData();
  const seats: Seat[] = getSeatData?.list ?? [];
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const { getSeatByAircraftCodeData } = useGetSeatByAircraftCode(code);
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

  type LegendItemProps = {
    color: string;
    label: string;
    icon?: React.ReactNode;
  };

  // Lấy danh sách số ghế (1..N) từ dữ liệu, sort tăng dần
  const seatNumbers = Array.from(new Set(seats.map((s) => s.seatNumber)))
    .map((n) => Number(n))
    .sort((a, b) => a - b);

  // const handleSelectSeat = (seatId: number) => {
  //   const seat = seats.find((s) => s.id === seatId);
  //   if (!seat || seat.isBooked) return;

  //   setSelectedSeats((prev) =>
  //     prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
  //   );
  // };

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
          width: "45px",
          height: "45px",
          borderRadius: "6px",
          margin: "4px",
          fontSize: "13px",
          fontWeight: 600,
          backgroundColor: isBooked
            ? "#bdbdbd"
            : isSelected
            ? "#4caf50"
            : seat.type === "VIP"
            ? "#f9a825"
            : "#29b6f6",
          color: isBooked ? "#757575" : isSelected ? "white" : "#212121",
          cursor: isBooked ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          boxShadow: isSelected ? "0px 0px 8px rgba(76, 175, 80, 0.7)" : "none",
          "&:hover": {
            backgroundColor: isBooked
              ? "#bdbdbd"
              : isSelected
              ? "#388e3c"
              : "#81d4fa",
            transform: isBooked ? "none" : "scale(1.08)",
          },
        }}
      >
        {seat.seatRow}
        {seat.seatNumber}
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
  const columns = ["A", "B", "C", "D", "E", "F"];
  const rows = Array.from({ length: 30 }, (_, i) => i + 1);

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
        {JSON.stringify(code)}
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
          maxHeight: "450px", // chiều cao tối đa
          overflowY: "auto", // scroll dọc
        }}
      >
        {/* {Array.from(new Set(seats.map((s) => s.seatNumber))).map((row) => {
          const rowSeats = seats.filter((s) => s.seatNumber === row);
          const leftSide = rowSeats.filter((s) =>
            ["A", "B", "C"].includes(s.seatRow)
          );
          const rightSide = rowSeats.filter((s) =>
            ["D", "E", "F"].includes(s.seatRow)
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
        })} */}
        <Stack
          spacing={1}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            padding: "16px",
            maxHeight: "450px",
            overflowY: "auto",
            backgroundColor: "#fafafa",
          }}
        >
          <Typography
            align="center"
            sx={{ color: "#1976d2", fontWeight: "bold" }}
          >
            ✈️ Đầu máy bay
          </Typography>

          {/* render theo hàng chữ (A, B, C ...) — mỗi hàng ngang hiển thị tất cả số ghế */}
          {columns.map((col) => (
            <Box
              key={col}
              sx={{ display: "flex", alignItems: "center", gap: 2, py: 0.5 }}
            >
              {/* label hàng chữ */}
              <Box sx={{ width: 28, textAlign: "center", fontWeight: 700 }}>
                {col}
              </Box>

              {/* danh sách số ghế theo hàng chữ */}
              <Box
                sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
              >
                {seatNumbers.length === 0 ? (
                  <Typography variant="body2" sx={{ color: "#999" }}>
                    No seats
                  </Typography>
                ) : (
                  seatNumbers.map((num) => {
                    const seat = seats.find(
                      (s) => s.seatRow === col && s.seatNumber === num
                    );
                    return seat ? (
                      renderSeatButton(seat)
                    ) : (
                      <Box
                        key={`${col}-${num}`}
                        sx={{
                          width: 44,
                          height: 44,
                          m: "4px",
                          borderRadius: 1,
                        }}
                      />
                    );
                  })
                )}
              </Box>
            </Box>
          ))}

          {/* Đuôi máy bay */}
          <Typography
            align="center"
            sx={{ color: "#1976d2", fontWeight: "bold", mt: 1 }}
          >
            🛫 Đuôi máy bay
          </Typography>
        </Stack>
        {/* Đầu máy bay */}
        {/* <Typography
            variant="h6"
            align="center"
            sx={{ mb: 2, fontWeight: "bold", color: "#1976d2" }}
          >
            ✈️ Đầu máy bay
          </Typography>

          {rows.map((row) => (
            <Box
              key={row}
              display="flex"
              justifyContent="center"
              alignItems="center"
              mb={1}
            >

              {columns.slice(0, 3).map((col) => {
                const seat = seats.find(
                  (s) => s.seatNumber === row && s.seatRow === col
                );
                return seat ? (
                  renderSeatButton(seat)
                ) : (
                  <Box key={col} width={45} />
                );
              })}

              <Box width={40} />

              {columns.slice(3).map((col) => {
                const seat = seats.find(
                  (s) => s.seatNumber === row && s.seatRow === col
                );
                return seat ? (
                  renderSeatButton(seat)
                ) : (
                  <Box key={col} width={45} />
                );
              })}
            </Box>
          ))}
        </Stack>
        <Typography
          variant="h6"
          align="center"
          sx={{ mt: 2, fontWeight: "bold", color: "#1976d2" }}
        >
          🛫 Đuôi máy bay
        </Typography> */}
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
