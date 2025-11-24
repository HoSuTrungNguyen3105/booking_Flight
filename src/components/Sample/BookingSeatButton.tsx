import React, { memo } from "react";
import { Box, Tooltip } from "@mui/material";
import type { Seat } from "../../utils/type";
import theme from "../../scss/theme";
import { useSeatManagement } from "../Admin/component/Seat/hook/useSeatManagement";
import { useSeatColor } from "../Admin/component/Seat/hook/useSeatColor";
import { type SeatFeatures } from "../Admin/component/Seat/modal/SeatManagementModal";

interface BookingSeatButtonProps {
  seat: Seat;
  selectedSeats: Seat[];
  handleSelectSeat: (seat: Seat) => void;
}

const BookingSeatButton: React.FC<BookingSeatButtonProps> = ({
  seat,
  selectedSeats,
  handleSelectSeat,
}) => {
  const featureKey = (seat: SeatFeatures): keyof SeatFeatures | undefined => {
    return (Object.keys(seat) as (keyof SeatFeatures)[]).find(
      (key) => seat[key] === true
    );
  };

  const { isSelected, tooltipTitle } = useSeatManagement({
    seat,
    selectedSeats,
  });

  const activeFeature = featureKey(seat);

  const { backgroundColor, textColor, borderColor, icon } = useSeatColor({
    seatFeature: activeFeature,
    seat,
    selectedSeats,
  });

  // Custom styling for the "Seat" look
  const isAvailable = !seat.isBooked;

  // Adjust colors for better UX
  let seatBg = backgroundColor;
  let seatBorder = borderColor;
  let seatColor = textColor;

  if (isSelected) {
    seatBg = theme.palette.primary.main;
    seatBorder = theme.palette.primary.dark;
    seatColor = "#fff";
  } else if (!isAvailable) {
    seatBg = "#e0e0e0";
    seatBorder = "#bdbdbd";
    seatColor = "#9e9e9e";
  } else if (activeFeature === "isAvailable" || !activeFeature) {
    seatBg = "#fff";
    seatBorder = "#bbdefb"; // Light blue border for available seats
    seatColor = theme.palette.text.primary;
  }

  return (
    <Tooltip title={tooltipTitle} arrow placement="top">
      <Box
        onClick={() => isAvailable && handleSelectSeat(seat)}
        sx={{
          position: "relative",
          m: 0.5,
          cursor: isAvailable ? "pointer" : "not-allowed",
          transition: "all 0.2s ease",
          "&:hover": {
            transform: isAvailable ? "translateY(-2px)" : "none",
            "& .seat-body": {
              boxShadow: isAvailable ? "0 4px 8px rgba(0,0,0,0.15)" : "none",
              borderColor: isAvailable
                ? theme.palette.primary.main
                : seatBorder,
            },
          },
          opacity: isAvailable ? 1 : 0.7,
        }}
      >
        {/* Headrest */}
        <Box
          sx={{
            width: "32px",
            height: "8px",
            bgcolor: seatBg,
            borderRadius: "4px 4px 0 0",
            mx: "auto",
            border: `1px solid ${seatBorder}`,
            borderBottom: "none",
            position: "relative",
            top: "1px",
            zIndex: 1,
          }}
        />

        {/* Seat Body */}
        <Box
          className="seat-body"
          sx={{
            height: 40,
            width: 44,
            borderRadius: "8px 8px 12px 12px",
            bgcolor: seatBg,
            color: seatColor,
            border: `1px solid ${seatBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            boxShadow: isSelected
              ? "0 4px 8px rgba(0,0,0,0.2)"
              : "0 1px 2px rgba(0,0,0,0.05)",
            position: "relative",
          }}
        >
          {/* Icon for special seats */}
          {icon && activeFeature !== "isAvailable" && (
            <Box sx={{ fontSize: 14, mb: -0.5, opacity: 0.8 }}>{icon}</Box>
          )}

          <Box sx={{ fontSize: 11, fontWeight: 700, lineHeight: 1.2 }}>
            {seat.seatRow}
            {seat.seatNumber}
          </Box>
        </Box>

        {/* Armrests (Visual only) */}
        <Box
          sx={{
            position: "absolute",
            bottom: 6,
            left: -2,
            width: 4,
            height: 20,
            bgcolor: seatBorder,
            borderRadius: "2px 0 0 2px",
            opacity: 0.5,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 6,
            right: -2,
            width: 4,
            height: 20,
            bgcolor: seatBorder,
            borderRadius: "0 2px 2px 0",
            opacity: 0.5,
          }}
        />
      </Box>
    </Tooltip>
  );
};

export default memo(BookingSeatButton);
