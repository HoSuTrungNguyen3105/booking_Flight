import React, { useCallback } from "react";
import { Box, Button, Tooltip, Typography, Stack } from "@mui/material";
import { StarBorder, WorkOutline, Chair, Wc } from "@mui/icons-material";
import type { Seat } from "../../../utils/type";
import theme from "../../../scss/theme";

interface ButtonSeatProps {
  dataGetSeatByFlightId: Seat;
  selectedSeats: Seat[];
  handleSelectSeat: (seat: Seat) => void;
}

const ButtonSeat: React.FC<ButtonSeatProps> = ({
  dataGetSeatByFlightId,
  selectedSeats,
  handleSelectSeat,
}) => {
  const renderSeatButton = useCallback(
    (seat: Seat) => {
      const isSelected = selectedSeats.some((s) => s.id === seat.id);
      const isBooked = seat.isBooked;

      let backgroundColor = "#f5f5f5";
      let textColor = theme.palette.primary.main;
      let borderColor = "#ccc";
      let icon = null;

      if (isBooked) {
        backgroundColor = "#bdbdbd";
        borderColor = "#a9a9a9";
      } else if (isSelected) {
        backgroundColor = theme.palette.primary.main;
        textColor = theme.palette.primary.contrastText;
        borderColor = theme.palette.primary.main;
      } else if (seat.type === "VIP") {
        backgroundColor = theme.palette.primary.light + "20";
        borderColor = theme.palette.primary.main;
        icon = (
          <StarBorder
            sx={{ color: theme.palette.primary.main, fontSize: 16 }}
          />
        );
      } else if (seat.type === "BUSINESS") {
        backgroundColor = theme.palette.primary.light + "15";
        borderColor = theme.palette.primary.main;
        icon = (
          <WorkOutline
            sx={{ color: theme.palette.primary.main, fontSize: 16 }}
          />
        );
      } else if (seat.type === "ECONOMY") {
        backgroundColor = theme.palette.primary.light + "10";
        borderColor = theme.palette.primary.main;
        icon = (
          <Chair sx={{ color: theme.palette.primary.main, fontSize: 16 }} />
        );
      }

      return (
        <Tooltip
          key={seat.id}
          title={
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
          }
          arrow
        >
          <Button
            onClick={() => !isBooked && handleSelectSeat(seat)}
            disabled={isBooked}
            sx={{
              width: { xs: "36px", sm: "42px", md: "45px" },
              height: { xs: "36px", sm: "42px", md: "45px" },
              minWidth: "unset",
              borderRadius: "6px",
              margin: "4px",
              fontSize: { xs: "10px", sm: "12px" },
              fontWeight: 600,
              backgroundColor,
              color: textColor,
              border: `2px solid ${borderColor}`,
              cursor: isBooked ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: isSelected
                ? `0px 0px 8px ${theme.palette.primary.main}80`
                : "0px 1px 3px rgba(0,0,0,0.1)",
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
            <Stack alignItems="center" spacing={0.2}>
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
    },
    [selectedSeats, handleSelectSeat]
  );

  return (
    <Box display="flex" flexWrap="wrap" gap={1} p={2}>
      {dataGetSeatByFlightId?.list?.map((seat) => renderSeatButton(seat))}
    </Box>
  );
};

export default ButtonSeat;
