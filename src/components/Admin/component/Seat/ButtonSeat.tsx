import React, { memo, useMemo } from "react";
import { Box, Button, Tooltip, Typography, Stack } from "@mui/material";
import {
  StarBorder,
  WorkOutline,
  Chair,
  Wc,
  Accessibility,
  WindowOutlined,
  FamilyRestroom,
  Notes,
  Paid,
  Stairs,
  AirlineSeatLegroomExtra,
  MeetingRoom,
} from "@mui/icons-material";
import type { Seat } from "../../../../utils/type";
import theme from "../../../../scss/theme";

interface ButtonSeatProps {
  seat: Seat;
  selectedSeats: Seat[];
  handleSelectSeat: (seat: Seat) => void;
}

const seatColors = {
  available: "#4caf50",
  occupied: "#1e1e1e",
  blocked: "#9e9e9e",
  exitRow: "#f44336",
  upperDeck: "#2196f3",
  wing: "#ff9800",
  handicap: "#9c27b0",
  lavatory: "#00bcd4",
  extraLegroom: "#f44336",
};

const ButtonSeat: React.FC<ButtonSeatProps> = ({
  seat,
  selectedSeats,
  handleSelectSeat,
}) => {
  const isSelected = selectedSeats.some((s) => s.id === seat.id);

  const { backgroundColor, textColor, borderColor, icon } = useMemo(() => {
    if (isSelected) {
      return {
        backgroundColor: theme.palette.primary.main,
        textColor: theme.palette.primary.contrastText,
        borderColor: theme.palette.primary.main,
        icon: null,
      };
    }

    if (seat.isExitRow) {
      return {
        backgroundColor: "#fff",
        textColor: seatColors.exitRow,
        borderColor: seatColors.exitRow,
        icon: (
          <AirlineSeatLegroomExtra
            sx={{ fontSize: 16, color: seatColors.exitRow }}
          />
        ),
      };
    }

    if (seat.isUpperDeck) {
      return {
        backgroundColor: "#fff",
        textColor: seatColors.upperDeck,
        borderColor: seatColors.upperDeck,
        icon: <Chair sx={{ fontSize: 14, color: seatColors.upperDeck }} />,
      };
    }
    if (seat.isWing) {
      return {
        backgroundColor: "#fff",
        textColor: seatColors.wing,
        borderColor: seatColors.wing,
        icon: (
          <AirlineSeatLegroomExtra
            sx={{ fontSize: 14, color: seatColors.wing }}
          />
        ),
      };
    }

    if (seat.isExtraLegroom) {
      return {
        backgroundColor: "#fff",
        textColor: seatColors.extraLegroom,
        borderColor: seatColors.extraLegroom,
        icon: (
          <AirlineSeatLegroomExtra
            sx={{ fontSize: 14, color: seatColors.extraLegroom }}
          />
        ),
      };
    }
    if (seat.isAvailable) {
      return {
        backgroundColor: "#fff",
        textColor: seatColors.available,
        borderColor: seatColors.available,
        icon: null,
      };
    }
    if (seat.isHandicapAccessible) {
      return {
        backgroundColor: "#fff",
        textColor: seatColors.handicap,
        borderColor: seatColors.handicap,
        icon: (
          <Accessibility sx={{ fontSize: 14, color: seatColors.handicap }} />
        ),
      };
    }
    if (seat.isNearLavatory) {
      return {
        backgroundColor: "#fff",
        textColor: seatColors.lavatory,
        borderColor: seatColors.lavatory,
        icon: <Wc sx={{ fontSize: 14, color: seatColors.lavatory }} />,
      };
    }

    switch (seat.type) {
      case "VIP":
        return {
          backgroundColor: "#fff",
          textColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          icon: (
            <StarBorder
              sx={{ fontSize: 16, color: theme.palette.primary.main }}
            />
          ),
        };
      case "BUSINESS":
        return {
          backgroundColor: "#fff",
          textColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          icon: (
            <WorkOutline
              sx={{ fontSize: 16, color: theme.palette.primary.main }}
            />
          ),
        };
      default: // ECONOMY
        return {
          backgroundColor: "#fff",
          textColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          icon: (
            <Chair sx={{ fontSize: 16, color: theme.palette.primary.main }} />
          ),
        };
    }
  }, [seat, isSelected]);

  const tooltipTitle = (
    <Box sx={{ minWidth: 200 }}>
      <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
        {seat.seatRow}
        {seat.seatNumber} - {seat.type}
      </Typography>
      <Stack spacing={0.5}>
        {[
          seat.isWing && (
            <Box
              key="wing"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <WindowOutlined fontSize="small" />
              <Typography variant="caption">Window Seat</Typography>
            </Box>
          ),
          seat.isNearLavatory && (
            <Box
              key="lavatory"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <FamilyRestroom fontSize="small" />
              <Typography variant="caption">Near Restroom Seat</Typography>
            </Box>
          ),
          seat.isExitRow && (
            <Box
              key="exit"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <MeetingRoom fontSize="small" />
              <Typography variant="caption">Exit Row</Typography>
            </Box>
          ),
          seat.isExtraLegroom && (
            <Box
              key="legroom"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <AirlineSeatLegroomExtra fontSize="small" />
              <Typography variant="caption">Extra Legroom</Typography>
            </Box>
          ),
          seat.isUpperDeck && (
            <Box
              key="upper"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Stairs fontSize="small" />
              <Typography variant="caption">Upper Deck</Typography>
            </Box>
          ),
          seat.isHandicapAccessible && (
            <Box
              key="handicap"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Accessibility fontSize="small" />
              <Typography variant="caption">Handicap Accessible</Typography>
            </Box>
          ),
          seat.price && (
            <Box
              key="price"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Paid fontSize="small" />
              <Typography variant="caption">
                ${seat.price?.toFixed(2)}
              </Typography>
            </Box>
          ),
          seat.note && (
            <Box
              key="note"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Notes fontSize="small" />
              <Typography variant="caption">{seat.note}</Typography>
            </Box>
          ),
          isSelected ? (
            <Box
              key="selected"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "success.main",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "success.main",
                }}
              />
              <Typography variant="caption" fontWeight="bold">
                Selected
              </Typography>
            </Box>
          ) : (
            <Box
              key="click"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "primary.main",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                }}
              />
              <Typography variant="caption">Click to select</Typography>
            </Box>
          ),
        ].filter(Boolean)}
      </Stack>
    </Box>
  );

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
