import React, { memo, useMemo } from "react";
import { Box, Button, Tooltip, Typography, Stack } from "@mui/material";
import { StarBorder, WorkOutline, Chair, Wc } from "@mui/icons-material";
import type { Seat } from "../../../utils/type";
import theme from "../../../scss/theme";

interface ButtonSeatProps {
  seat: Seat;
  selectedSeats: Seat[];
  handleSelectSeat: (seat: Seat) => void;
}

const ButtonSeat: React.FC<ButtonSeatProps> = ({
  seat,
  selectedSeats,
  handleSelectSeat,
}) => {
  const isSelected = useMemo(
    () => selectedSeats.some((s) => s.id === seat.id),
    [seat.id, selectedSeats]
  );
  const isBooked = seat.isBooked;

  const { backgroundColor, textColor, borderColor, icon } = useMemo(() => {
    let bg = "#f5f5f5";
    let color = theme.palette.primary.main;
    let border = "#ccc";
    let ic = null;

    if (isBooked) {
      bg = "#bdbdbd";
      border = "#a9a9a9";
    } else if (isSelected) {
      bg = theme.palette.primary.main;
      color = theme.palette.primary.contrastText;
      border = theme.palette.primary.main;
    } else if (seat.type === "VIP") {
      bg = theme.palette.primary.light + "20";
      border = theme.palette.primary.main;
      ic = (
        <StarBorder sx={{ color: theme.palette.primary.main, fontSize: 16 }} />
      );
    } else if (seat.type === "BUSINESS") {
      bg = theme.palette.primary.light + "15";
      border = theme.palette.primary.main;
      ic = (
        <WorkOutline sx={{ color: theme.palette.primary.main, fontSize: 16 }} />
      );
    } else if (seat.type === "ECONOMY") {
      bg = theme.palette.primary.light + "10";
      border = theme.palette.primary.main;
      ic = <Chair sx={{ color: theme.palette.primary.main, fontSize: 16 }} />;
    }

    return {
      backgroundColor: bg,
      textColor: color,
      borderColor: border,
      icon: ic,
    };
  }, [seat.type, isBooked, isSelected]);

  const tooltipTitle = useMemo(
    () => (
      <Box>
        <Typography sx={{ color: theme.palette.primary.main }}>
          Seat: {seat.seatRow}
          {seat.seatNumber}
        </Typography>
        <Typography sx={{ color: theme.palette.primary.main }}>
          Type: {seat.type}
        </Typography>
        {seat.isWing && (
          <Typography sx={{ color: theme.palette.primary.main }}>
            Window Seat
          </Typography>
        )}
        {seat.isNearLavatory && (
          <Typography sx={{ color: theme.palette.primary.main }}>
            Near Restroom
          </Typography>
        )}
      </Box>
    ),
    [seat]
  );

  return (
    <Tooltip title={tooltipTitle} arrow>
      <Button
        onClick={() => !isBooked && handleSelectSeat(seat)}
        disabled={isBooked}
        sx={{
          width: { xs: "36px", sm: "42px", md: "45px" },
          height: { xs: "36px", sm: "42px", md: "45px" },
          minWidth: "unset",
          borderRadius: 1,
          margin: "4px",
          fontSize: { xs: "10px", sm: "12px" },
          fontWeight: 600,
          backgroundColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          cursor: isBooked ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          // boxShadow: isSelected
          //   ? `0px 0px 8px ${theme.palette.primary.main}80`
          //   : "0px 1px 3px rgba(0,0,0,0.1)",
          "&:hover": {
            backgroundColor: isBooked
              ? "#bdbdbd"
              : isSelected
              ? theme.palette.primary.dark
              : theme.palette.primary.light + "30",
            color: isSelected
              ? theme.palette.primary.contrastText
              : theme.palette.primary.main,
            transform: isBooked ? "none" : "scale(1.05)",
          },
        }}
      >
        <Stack alignItems="center" spacing={0.2} sx={{ position: "relative" }}>
          {icon}
          <Box>
            {seat.seatRow}
            {seat.seatNumber}
          </Box>
          {seat.isNearLavatory && (
            <Wc
              sx={{
                fontSize: 10,
                color: theme.palette.primary.main,
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
};

export default memo(ButtonSeat, (prev, next) => {
  return prev.seat === next.seat && prev.selectedSeats === next.selectedSeats;
});
