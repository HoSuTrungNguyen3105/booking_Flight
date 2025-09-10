import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Chair,
  StarBorder,
  StarHalfSharp,
  Wc,
  Flight,
} from "@mui/icons-material";
import type { Seat } from "../../utils/type";
import { useGetSeatsData } from "../Api/useGetApi";
import DialogConfirm from "../../common/Modal/DialogConfirm";

type AircraftCodeProps = {
  code: string;
};

interface EnhancedSeat extends Seat {
  price?: number; // Optional price field
  isWindow?: boolean; // Flag for window seats
  nearRestroom?: boolean; // Flag for restroom proximity
}

const SeatBooking: React.FC<AircraftCodeProps> = ({ code }) => {
  const { getSeatData } = useGetSeatsData();
  const seats: EnhancedSeat[] = getSeatData?.list ?? [];
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "VIP" | "ECONOMY" | "WINDOW">(
    "ALL"
  );

  const handleSelectSeat = useCallback(
    (seatId: number) => {
      const seat = seats.find((s) => s.id === seatId);
      if (!seat || seat.isBooked) return;

      setSelectedSeats((prev) =>
        prev.includes(seatId)
          ? prev.filter((id) => id !== seatId)
          : [...prev, seatId]
      );
    },
    [seats]
  );

  const handleResetSelections = () => {
    setSelectedSeats([]);
    setMessage("");
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
    setMessage(
      `Booking successful! Seats booked: ${selectedSeats
        .map((id) => {
          const seat = seats.find((s) => s.id === id);
          return `${seat?.seatNumber}${seat?.seatRow}`;
        })
        .join(", ")}`
    );
    setSelectedSeats([]);
    setOpenModal(false);
  };

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

  const Window = () => (
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
      W
    </Box>
  );

  const Restroom = () => (
    <Box
      sx={{
        width: 28,
        height: 28,
        border: "2px solid #ff9800",
        borderRadius: "6px",
        backgroundColor: "#fff3e0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Wc sx={{ color: "#ff9800", fontSize: 16 }} />
    </Box>
  );

  const renderSeatButton = useCallback(
    (seat: EnhancedSeat) => {
      const isSelected = selectedSeats.includes(seat.id);
      const isBooked = seat.isBooked;

      let backgroundColor = "#f5f5f5";
      let textColor = "#212121";
      let borderColor = "#ccc";
      let icon = null;

      if (isBooked) {
        backgroundColor = "#bdbdbd";
        textColor = "#757575";
        borderColor = "#a9a9a9";
      } else if (isSelected) {
        backgroundColor = "#4caf50";
        textColor = "white";
        borderColor = "#4caf50";
      } else if (seat.type === "VIP") {
        backgroundColor = "#fffde7";
        borderColor = "#f9a825";
        icon = <StarBorder sx={{ color: "#f9a825", fontSize: 16 }} />;
      } else if (seat.type === "ECONOMY") {
        backgroundColor = "#e3f2fd";
        borderColor = "#29b6f6";
        icon = <Chair sx={{ color: "#29b6f6", fontSize: 16 }} />;
      }

      return (
        <Tooltip
          title={
            <Box>
              <Typography>
                Seat: {seat.seatNumber}
                {seat.seatRow}
              </Typography>
              <Typography>Type: {seat.type}</Typography>
              {seat.price && <Typography>Price: ${seat.price}</Typography>}
              {seat.isWindow && <Typography>Window Seat</Typography>}
              {seat.nearRestroom && <Typography>Near Restroom</Typography>}
            </Box>
          }
          arrow
        >
          <Button
            key={seat.id}
            onClick={() => !isBooked && handleSelectSeat(seat.id)}
            disabled={isBooked}
            aria-label={`Seat ${seat.seatNumber}${seat.seatRow}, ${
              seat.isBooked ? "Booked" : seat.type
            }, ${seat.isWindow ? "Window" : ""}`}
            sx={{
              width: { xs: "40px", sm: "45px" },
              height: { xs: "40px", sm: "45px" },
              borderRadius: "6px",
              margin: "4px",
              fontSize: { xs: "12px", sm: "13px" },
              fontWeight: 600,
              position: "relative",
              backgroundColor,
              color: textColor,
              border: `1px solid ${borderColor}`,
              cursor: isBooked ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: isSelected
                ? "0px 0px 8px rgba(76, 175, 80, 0.7)"
                : "none",
              "&:hover": {
                backgroundColor: isBooked
                  ? "#bdbdbd"
                  : isSelected
                  ? "#388e3c"
                  : "#e0e0e0",
                transform: isBooked ? "none" : "scale(1.05)",
              },
              "&:focus": {
                outline: "2px solid #1976d2",
              },
            }}
          >
            <Stack alignItems="center">
              {icon}
              {seat.seatNumber}
              {seat.seatRow}
              {seat.nearRestroom && (
                <Wc
                  sx={{
                    fontSize: 12,
                    color: "#ff9800",
                    position: "absolute",
                    top: 2,
                    right: 2,
                  }}
                />
              )}
            </Stack>
          </Button>
        </Tooltip>
      );
    },
    [selectedSeats, handleSelectSeat]
  );

  const columns = ["A", "B", "C", "D", "E", "F"];
  const rows = Array.from({ length: 40 }, (_, i) => i + 1);
  const restroomRows = [1, 15, 30]; // Example: Restrooms at front, middle, and back

  const filteredSeats = useMemo(() => {
    if (filter === "ALL") return seats;
    if (filter === "WINDOW") return seats.filter((s) => s.isWindow);
    return seats.filter((s) => s.type === filter);
  }, [seats, filter]);

  return (
    <Box
      sx={{
        padding: { xs: "8px", sm: "16px" },
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", marginBottom: "24px" }}
      >
        Select Your Seats - Flight {code}
      </Typography>

      {/* Filter Controls */}
      <Box sx={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <Button
          variant={filter === "ALL" ? "contained" : "outlined"}
          onClick={() => setFilter("ALL")}
        >
          All Seats
        </Button>
        <Button
          variant={filter === "VIP" ? "contained" : "outlined"}
          onClick={() => setFilter("VIP")}
        >
          VIP
        </Button>
        <Button
          variant={filter === "ECONOMY" ? "contained" : "outlined"}
          onClick={() => setFilter("ECONOMY")}
        >
          Economy
        </Button>
        <Button
          variant={filter === "WINDOW" ? "contained" : "outlined"}
          onClick={() => setFilter("WINDOW")}
        >
          Window
        </Button>
      </Box>

      {/* Legend */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <LegendItem color="#4caf50" label="Selected" />
        <LegendItem color="#f5f5f5" label="Available" />
        <LegendItem color="#d3d3d3" label="Booked" />
        <LegendItem color="#f9a825" label="VIP" icon={<StarHalfSharp />} />
        <LegendItem color="#29b6f6" label="Economy" icon={<StarHalfSharp />} />
        <LegendItem color="#e3f2fd" label="Window" icon={<Window />} />
        <LegendItem
          color="#fff3e0"
          label="Restroom"
          icon={<Wc sx={{ color: "#ff9800", fontSize: 16 }} />}
        />
      </Box>

      {/* Aircraft Layout */}
      <Stack
        spacing={2}
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          padding: "16px",
          maxHeight: { xs: "400px", sm: "450px" },
          overflowY: "auto",
          background: "linear-gradient(180deg, #fafafa 0%, #e3f2fd 100%)",
        }}
      >
        <Typography
          align="center"
          sx={{
            color: "#1976d2",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Flight sx={{ transform: "rotate(90deg)" }} /> Aircraft Nose
        </Typography>
        {/* Column Headers */}
        {/* <Box display="flex" justifyContent="center" alignItems="center">
          <Box display="flex" gap={1} width="50%">
            {columns.slice(0, 3).map((col) => (
              <Typography
                key={col}
                width={45}
                textAlign="center"
                fontWeight="bold"
              >
                {col}
              </Typography>
            ))}
          </Box>
          <Box width={40} />
          <Box display="flex" gap={1} width="50%">
            {columns.slice(3).map((col) => (
              <Typography
                key={col}
                width={45}
                textAlign="center"
                fontWeight="bold"
              >
                {col}
              </Typography>
            ))}
          </Box>
        </Box> */}
        {/* {columns.slice(0, 3).map((col) => (
          <Typography
            key={col}
            textAlign="center"
            fontWeight="bold"
            sx={{ width: "53px" }}
          >
            {col}
          </Typography>
        ))}
        <Box />
        {columns.slice(3).map((col) => (
          <Typography
            key={col}
            textAlign="center"
            fontWeight="bold"
            sx={{ width: "53px" }}
          >
            {col}
          </Typography>
        ))} */}

        {/* Column Headers */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "#fafafa",
            padding: "8px 0",
            display: "grid",
            gridTemplateColumns:
              "28px 53px 53px 53px 40px 53px 53px 53px 53px 28px",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box /> {/* Empty for window */}
          {columns.map((col) => (
            <Typography
              key={col}
              textAlign="center"
              fontWeight="bold"
              sx={{
                width: "53px",
                fontSize: { xs: "14px", sm: "16px" },
                color: "#1976d2",
              }}
            >
              {col}
            </Typography>
          ))}
          <Box /> {/* Empty for window */}
        </Box>
        {/* Seat Rows */}
        {rows.map((row) => (
          <Box
            key={row}
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={1}
          >
            {/* Window Indicator (Left) */}
            {["A"].includes(columns[0]) && <Window />}
            {/* Left Seats */}
            <Box display="flex" gap={1}>
              {columns.slice(0, 3).map((col) => {
                const seat = filteredSeats.find(
                  (s) => s.seatNumber === row && s.seatRow === col
                );
                return seat ? (
                  renderSeatButton(seat)
                ) : (
                  <Box key={col} width={45} />
                );
              })}
            </Box>
            {/* Row Number */}
            <Box width={40} textAlign="center">
              <Typography>{row}</Typography>
            </Box>
            {/* Right Seats */}
            <Box display="flex" gap={1}>
              {columns.slice(3).map((col) => {
                const seat = filteredSeats.find(
                  (s) => s.seatNumber === row && s.seatRow === col
                );
                return seat ? (
                  renderSeatButton(seat)
                ) : (
                  <Box key={col} width={45} />
                );
              })}
            </Box>
            {/* Window Indicator (Right) */}
            {["F"].includes(columns[5]) && <Window />}
            {/* Restroom Indicator */}
            {restroomRows.includes(row) && <Restroom />}
          </Box>
        ))}
        <Typography
          align="center"
          sx={{
            color: "#1976d2",
            fontWeight: "bold",
            mt: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Flight sx={{ transform: "rotate(-90deg)" }} /> Aircraft Tail
        </Typography>
      </Stack>

      {/* Selected Seats Summary */}
      <Box
        sx={{
          marginTop: "24px",
          padding: "16px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h6">
          Selected Seats ({selectedSeats.length})
        </Typography>
        {selectedSeats.length > 0 ? (
          <Box>
            {selectedSeats.map((id) => {
              const seat = seats.find((s) => s.id === id);
              return (
                <Typography key={id}>
                  Seat {seat?.seatNumber}
                  {seat?.seatRow} ({seat?.type},{" "}
                  {seat?.isWindow ? "Window" : "Non-Window"}, $
                  {seat?.price || "N/A"})
                </Typography>
              );
            })}
            <IconButton
              onClick={handleResetSelections}
              aria-label="Reset selections"
            >
              <Typography color="error">Reset</Typography>
            </IconButton>
          </Box>
        ) : (
          <Typography color="textSecondary">No seats selected.</Typography>
        )}
      </Box>

      {/* Confirm Button */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "white",
          padding: "16px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          onClick={handleOpenModal}
          disabled={selectedSeats.length === 0}
          sx={{
            backgroundColor: selectedSeats.length > 0 ? "#1976d2" : "#a9a9a9",
            "&:hover": {
              backgroundColor: selectedSeats.length > 0 ? "#1565c0" : "#a9a9a9",
            },
            padding: "12px 24px",
            fontSize: "16px",
            textTransform: "none",
          }}
        >
          Confirm Booking ({selectedSeats.length})
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <DialogConfirm
        icon="warning"
        cancelLabel="Cancel"
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmBooking}
        title="Confirm Booking"
        message={`Are you sure you want to book seats: ${selectedSeats
          .map((id) => {
            const seat = seats.find((s) => s.id === id);
            return `${seat?.seatNumber}${seat?.seatRow}`;
          })
          .join(", ")}?`}
        confirmLabel="Book Now"
      />

      {/* Error Message */}
      {message && (
        <Typography
          color={message.includes("successful") ? "success.main" : "error.main"}
          sx={{ marginTop: "16px" }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default React.memo(SeatBooking);
