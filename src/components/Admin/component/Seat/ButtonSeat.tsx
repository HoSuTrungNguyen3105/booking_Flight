import React, { memo } from "react";
import { Box, Button, Tooltip, Stack } from "@mui/material";
import type { Seat } from "../../../../utils/type";
import theme from "../../../../scss/theme";
import { useSeatManagement } from "./useSeatManagement";
import { useSeatColor } from "./useSeatColor";

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
  const { isSelected, tooltipTitle } = useSeatManagement({
    seat,
    selectedSeats,
  });

  const { backgroundColor, textColor, borderColor, icon } = useSeatColor();

  return (
    <Tooltip title={tooltipTitle} arrow>
      <Button
        onClick={() => handleSelectSeat(seat)}
        sx={{
          height: 48,
          width: 48,
          m: 0.5,
          minWidth: "unset",
          borderRadius: 1.5,
          fontWeight: 600,
          backgroundColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          cursor: "pointer",
        }}
      >
        <Stack alignItems="center" spacing={0.2} sx={{ position: "relative" }}>
          {icon && <Box sx={{ fontSize: 16 }}>{icon}</Box>}
          <Box sx={{ fontSize: 11, fontWeight: 600, lineHeight: 1 }}>
            {seat.seatRow}
            {seat.seatNumber}
          </Box>
          {isSelected && (
            <Box
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
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
