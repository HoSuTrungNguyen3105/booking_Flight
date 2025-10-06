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
import type { Seat } from "../../../utils/type";
import theme from "../../../scss/theme";

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
};

const ButtonSeat: React.FC<ButtonSeatProps> = ({
  seat,
  selectedSeats,
  handleSelectSeat,
}) => {
  const isSelected = selectedSeats.some((s) => s.id === seat.id);

  // ✅ REMOVED: Không có disabled state nào nữa
  // Tất cả seats đều có thể click được

  const { backgroundColor, textColor, borderColor, icon } = useMemo(() => {
    // 1. Nếu đang được chọn -> luôn override màu
    if (isSelected) {
      return {
        backgroundColor: theme.palette.primary.main,
        textColor: theme.palette.primary.contrastText,
        borderColor: theme.palette.primary.main,
        icon: null,
      };
    }

    // 2. Các seat type đặc biệt - TẤT CẢ ĐỀU CLICK ĐƯỢC
    if (seat.isExitRow) {
      return {
        backgroundColor: "#fff",
        textColor: seatColors.exitRow,
        borderColor: seatColors.exitRow,
        icon: null,
      };
    }
    if (seat.isUpperDeck) {
      return {
        backgroundColor: "#fff",
        textColor: seatColors.upperDeck,
        borderColor: seatColors.upperDeck,
        icon: null,
      };
    }
    if (seat.isWing) {
      return {
        backgroundColor: "#fff",
        textColor: seatColors.wing,
        borderColor: seatColors.wing,
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

    // 3. Mặc định theo type
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
          width: 32,
          height: 32,
          minWidth: "unset",
          borderRadius: 1,
          m: "4px",
          fontSize: "7px",
          fontWeight: 600,
          backgroundColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: isSelected
              ? theme.palette.primary.dark
              : theme.palette.primary.light,
            color: isSelected
              ? theme.palette.primary.contrastText
              : theme.palette.primary.main,
            transform: "scale(1.05)",
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 8px ${theme.palette.primary.main}40`,
          },
          "&:active": {
            transform: "scale(0.95)",
          },
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
