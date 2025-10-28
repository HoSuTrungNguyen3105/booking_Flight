import React, { memo } from "react";
import { Box, Button, Tooltip, Stack } from "@mui/material";
import type { Seat } from "../../../../utils/type";
import theme from "../../../../scss/theme";
import { useSeatManagement } from "./useSeatManagement";

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
  const {
    backgroundColor,
    textColor,
    borderColor,
    icon,
    isSelected,
    tooltipTitle,
  } = useSeatManagement({
    seat,
    selectedSeats,
  });

  return (
    <Tooltip title={tooltipTitle} arrow>
      <Button
        onClick={() => handleSelectSeat(seat)}
        sx={{
          height: 50,
          width: 50,
          m: "4px",
          minWidth: "unset",
          borderRadius: 1,
          fontSize: "200px",
          fontWeight: 700,
          backgroundColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          cursor: "pointer",
        }}
      >
        <Stack alignItems="center" spacing={0.2} sx={{ position: "relative" }}>
          {icon}
          <Box sx={{ fontSize: "7px", fontWeight: 600, lineHeight: 1 }}>
            {seat.seatRow}
            {seat.seatNumber}
          </Box>
          {isSelected && (
            <Box
              sx={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: theme.palette.success.main,
                border: `1px solid #fff`,
              }}
            />
          )}
        </Stack>
      </Button>
    </Tooltip>
  );
};

export default memo(ButtonSeat);
