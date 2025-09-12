import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Tooltip,
  IconButton,
  Chip,
  Card,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Chair,
  StarBorder,
  StarHalfSharp,
  Wc,
  Flight,
  Window as WindowIcon,
  RestartAlt,
  LocalAirport,
  WorkOutline,
} from "@mui/icons-material";
import type { Seat } from "../../utils/type";
import { useGetSeatsData } from "../Api/useGetApi";
import DialogConfirm from "../../common/Modal/DialogConfirm";

// type AircraftCodeProps = {
//   code: string;
// };

type AircraftSeatTypeProps = "ALL" | "VIP" | "ECONOMY" | "WINDOW";

// interface EnhancedSeat extends Seat {
//   isWindow?: boolean;
//   nearRestroom?: boolean;
// }

type LegendItemProps = {
  color: string;
  label: string;
  icon?: React.ReactNode;
};

type AircraftSeatProps = {
  seats: Seat[];
};

const SeatBooking: React.FC<AircraftSeatProps> = ({ seats }) => {
  // const { getSeatData } = useGetSeatsData();
  // const seats: EnhancedSeat[] = getSeatData?.list ?? [];
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [filter, setFilter] = useState<AircraftSeatTypeProps>("ALL");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const isTablet = useMediaQuery(theme.breakpoints.down("md"));

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

  if (!seats.length) {
    return <Typography>No seats available</Typography>;
  }

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
      <Typography
        variant="body2"
        sx={{ color: "#555", fontSize: isMobile ? "0.75rem" : "0.875rem" }}
      >
        {label}
      </Typography>
    </Box>
  );

  const renderSeatButton = useCallback(
    (seat: Seat) => {
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
        backgroundColor = "#ffebee";
        borderColor = "#c62828";
        icon = <StarBorder sx={{ color: "#c62828", fontSize: 16 }} />;
      } else if (seat.type === "BUSINESS") {
        backgroundColor = "#e3f2fd";
        borderColor = "#1565c0";
        icon = <WorkOutline sx={{ color: "#1565c0", fontSize: 16 }} />; // icon khác Star
      } else if (seat.type === "ECONOMY") {
        backgroundColor = "#e3f2fd";
        borderColor = "#29b6f6";
        icon = <Chair sx={{ color: "#29b6f6", fontSize: 16 }} />;
      }

      return (
        <Tooltip
          key={seat.id}
          title={
            <Box>
              <Typography>
                Seat: {seat.seatNumber}
                {seat.seatRow}
              </Typography>
              <Typography>Type: {seat.type}</Typography>
              {seat.isWindow && <Typography>Window Seat</Typography>}
              {seat.nearRestroom && <Typography>Near Restroom</Typography>}
            </Box>
          }
          arrow
        >
          <Button
            onClick={() => !isBooked && handleSelectSeat(seat.id)}
            disabled={isBooked}
            aria-label={`Seat ${seat.seatNumber}${seat.seatRow}, ${
              seat.isBooked ? "Booked" : seat.type
            }, ${seat.isWindow ? "Window" : ""}`}
            sx={{
              width: { xs: "36px", sm: "42px", md: "45px" },
              height: { xs: "36px", sm: "42px", md: "45px" },
              minWidth: "unset",
              borderRadius: "6px",
              margin: "2px",
              fontSize: { xs: "10px", sm: "12px" },
              fontWeight: 600,
              position: "relative",
              backgroundColor,
              color: textColor,
              border: `2px solid ${borderColor}`,
              cursor: isBooked ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: isSelected
                ? "0px 0px 8px rgba(76, 175, 80, 0.7)"
                : "0px 1px 3px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: isBooked
                  ? "#bdbdbd"
                  : isSelected
                  ? "#388e3c"
                  : "#e0e0e0",
                transform: isBooked ? "none" : "scale(1.05)",
                boxShadow: isBooked ? "none" : "0px 2px 6px rgba(0,0,0,0.15)",
              },
              "&:focus": {
                outline: "2px solid #1976d2",
              },
            }}
          >
            <Stack alignItems="center" spacing={0.2}>
              {icon}
              <Box>
                {seat.seatNumber}
                {seat.seatRow}
              </Box>
              {seat.nearRestroom && (
                <Wc
                  sx={{
                    fontSize: 10,
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
  const [typeState, setTypeState] = useState("");
  const filteredSeats = useMemo(() => {
    if (filter === "ALL") return seats;
    if (filter === "WINDOW") return seats.filter((s) => s.isWindow);
    return seats.filter((s) => s.type === filter);
  }, [seats, filter]);

  return (
    <Box
      sx={{
        padding: { xs: "12px", sm: "20px", md: "24px" },
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
          borderRadius: "12px",
          padding: { xs: "16px", sm: "24px" },
          color: "white",
          marginBottom: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <LocalAirport sx={{ fontSize: 28 }} />
          <Typography variant="h4" sx={{ fontWeight: "800" }}>
            Select Your Seats
          </Typography>
        </Box>
        {/* <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Flight {seats[0].id} • Choose your preferred seats
        </Typography> */}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          {/* Filter Controls */}
          <Card
            sx={{
              padding: { xs: "12px", sm: "16px" },
              marginBottom: "16px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "600", mb: 1 }}>
              Filter by:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {[
                { key: "ALL", label: "All Seats" },
                { key: "VIP", label: "VIP" },
                { key: "ECONOMY", label: "Economy" },
                { key: "WINDOW", label: "Window" },
                { key: "BUSINESS", label: "BUSINESS" },
              ].map((item) => (
                <Chip
                  key={item.key}
                  label={item.label}
                  onClick={() => setFilter(item.key as AircraftSeatTypeProps)}
                  variant={filter === item.key ? "filled" : "outlined"}
                  color={filter === item.key ? "primary" : "default"}
                  sx={{
                    fontWeight: filter === item.key ? "600" : "400",
                    ...(filter === item.key && {
                      backgroundColor: "primary.main",
                      color: "white",
                    }),
                  }}
                />
              ))}
            </Box>
          </Card>

          {/* Legend */}
          <Card
            sx={{
              padding: { xs: "12px", sm: "16px" },
              marginBottom: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "600", mb: 1 }}>
              Seat Legend:
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                justifyContent: "center",
              }}
            >
              <LegendItem color="#4caf50" label="Selected" />
              <LegendItem color="#f5f5f5" label="Available" />
              <LegendItem color="#d3d3d3" label="Booked" />
              <LegendItem
                color="#f9a825"
                label="VIP"
                icon={<StarHalfSharp />}
              />
              <LegendItem
                color="#29b6f6"
                label="Economy"
                icon={<Chair sx={{ color: "#29b6f6", fontSize: 16 }} />}
              />
              <LegendItem
                color="#e3f2fd"
                label="Window"
                icon={<WindowIcon />}
              />
              <LegendItem
                color="#fff3e0"
                label="Restroom"
                icon={<Wc sx={{ color: "#ff9800", fontSize: 16 }} />}
              />
            </Box>
          </Card>

          {message && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: "8px",
                backgroundColor: message.includes("successful")
                  ? "success.light"
                  : "error.light",
                color: message.includes("successful")
                  ? "success.contrastText"
                  : "error.contrastText",
              }}
            >
              <Typography>{message}</Typography>
            </Box>
          )}

          {/* Aircraft Layout */}
          <Card
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              padding: { xs: "12px", sm: "16px" },
              maxHeight: { xs: "400px", sm: "500px" },
              overflowY: "auto",
              background: "linear-gradient(180deg, #fafafa 0%, #e8f4fd 100%)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1976d2",
                fontWeight: "bold",
                mb: 1,
                gap: 1,
              }}
            >
              <Flight sx={{ transform: "rotate(90deg)", fontSize: 20 }} />
              <Typography variant="subtitle1" fontWeight="600">
                Aircraft Nose
              </Typography>
            </Box>

            {/* Column Headers */}
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                backgroundColor: "#f5f9ff",
                padding: "8px 0",
                display: "grid",
                gridTemplateColumns: "28px repeat(6, 1fr) 28px",
                alignItems: "center",
                justifyContent: "center",
                borderBottom: "2px solid #e0e0e0",
                mb: 1,
              }}
            >
              <Box /> {/* Empty for window */}
              {columns.map((col) => (
                <Typography
                  key={col}
                  textAlign="center"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: "14px", sm: "16px" },
                    color: "#1565c0",
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
                sx={{
                  backgroundColor: restroomRows.includes(row)
                    ? "#fff8e1"
                    : "transparent",
                  borderRadius: "4px",
                  padding: "4px 0",
                }}
              >
                {/* Window Indicator (Left) */}
                <Box
                  sx={{ width: 28, display: "flex", justifyContent: "center" }}
                >
                  <WindowIcon sx={{ fontSize: 18, color: "#90caf9" }} />
                </Box>

                {/* Left Seats */}
                <Box display="flex" gap={1} sx={{ mx: 0.5 }}>
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
                <Box
                  width={40}
                  textAlign="center"
                  sx={{
                    backgroundColor: "#e3f2fd",
                    borderRadius: "4px",
                    py: 0.5,
                    mx: 0.5,
                  }}
                >
                  <Typography fontWeight="600">{row}</Typography>
                </Box>

                {/* Right Seats */}
                <Box display="flex" gap={1} sx={{ mx: 0.5 }}>
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
                <Box
                  sx={{ width: 28, display: "flex", justifyContent: "center" }}
                >
                  <WindowIcon sx={{ fontSize: 18, color: "#90caf9" }} />
                </Box>
              </Box>
            ))}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1976d2",
                fontWeight: "bold",
                mt: 1,
                gap: 1,
              }}
            >
              <Flight sx={{ transform: "rotate(-90deg)", fontSize: 20 }} />
              <Typography variant="subtitle1" fontWeight="600">
                Aircraft Tail
              </Typography>
            </Box>
          </Card>
        </Box>

        {/* Sidebar - Selected Seats */}
        <Box sx={{ width: { xs: "100%", md: "320px" } }}>
          <Card
            sx={{
              padding: { xs: "16px", sm: "20px" },
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              position: "sticky",
              top: 20,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "700", mb: 2 }}>
              Your Selection ({selectedSeats.length})
            </Typography>

            {selectedSeats.length > 0 ? (
              <Box>
                <Stack spacing={1} sx={{ mb: 2 }}>
                  {selectedSeats.map((id) => {
                    const seat = seats.find((s) => s.id === id);
                    return (
                      <Box
                        key={id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: "#f5f5f5",
                          padding: "8px 12px",
                          borderRadius: "6px",
                        }}
                      >
                        <Box>
                          <Typography fontWeight="600">
                            Seat {seat?.seatNumber}
                            {seat?.seatRow}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {seat?.id} • {seat?.isWindow ? "Window" : "Aisle"}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography fontWeight="600">
                            Change Type Seat
                          </Typography>
                          <Chip
                            //color="#f9a825"
                            clickable
                            onClick={() => {
                              setTypeState(seat?.type as string);
                            }}
                            label="VIP"
                            icon={<StarHalfSharp />}
                          />
                          <Chip
                            label="Economy"
                            icon={
                              <Chair sx={{ color: "#29b6f6", fontSize: 16 }} />
                            }
                          />
                          <Chip label="Window" icon={<WindowIcon />} />
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  {/* <Typography variant="h6" fontWeight="700">
                    Total: $
                    {selectedSeats.reduce((total, id) => {
                      const seat = seats.find((s) => s.id === id);
                      return total + (seat?.price || 0);
                    }, 0)}
                  </Typography> */}

                  <IconButton
                    onClick={handleResetSelections}
                    aria-label="Reset selections"
                    color="error"
                    size="small"
                  >
                    <RestartAlt />
                  </IconButton>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleOpenModal}
                  disabled={selectedSeats.length === 0}
                  sx={{
                    py: 1.5,
                    fontSize: "16px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    background:
                      "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #1565c0 0%, #083c86 100%)",
                    },
                  }}
                >
                  Confirm Booking
                </Button>
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Chair sx={{ fontSize: 48, color: "#e0e0e0", mb: 1 }} />
                <Typography color="textSecondary">
                  No seats selected yet. Choose your seats from the map.
                </Typography>
              </Box>
            )}
          </Card>
        </Box>
      </Box>

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
    </Box>
  );
};

export default React.memo(SeatBooking);
