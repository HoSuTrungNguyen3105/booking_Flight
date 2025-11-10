import {
  StarBorder,
  WorkOutline,
  Chair,
  ChargingStation,
} from "@mui/icons-material";
import React, { type JSX } from "react";
import theme from "../../../../../scss/theme";
import type { Booking, SeatTypeValue } from "../../../../../utils/type";

type BookingSeatClass = Pick<Booking, "seatClass">;

export const useSeatBookingStyle = (
  seat: BookingSeatClass,
  isSelected: boolean
) => {
  const colors: Record<
    SeatTypeValue,
    { bg: string; border: string; text: string }
  > = {
    VIP: {
      bg: theme.palette.divider,
      border: "#ff9800",
      text: "#e65100",
    },
    BUSINESS: {
      bg: theme.palette.background.default,
      border: "#2196f3",
      text: "#0d47a1",
    },
    ECONOMY: {
      bg: "#f1f8e9",
      border: "#8bc34a",
      text: "#33691e",
    },
    FIRST: {
      bg: "#f3e5f5",
      border: "#9c27b0",
      text: "#4a148c",
    },
  };

  const icons: Record<SeatTypeValue, JSX.Element> = {
    VIP: <StarBorder sx={{ fontSize: 16, color: colors.VIP.text }} />,
    BUSINESS: (
      <WorkOutline sx={{ fontSize: 16, color: colors.BUSINESS.text }} />
    ),
    ECONOMY: (
      <ChargingStation sx={{ fontSize: 16, color: colors.ECONOMY.text }} />
    ),
    FIRST: <Chair sx={{ fontSize: 16, color: colors.FIRST.text }} />,
  };

  const currentColor =
    colors[seat.seatClass as SeatTypeValue] ?? colors.ECONOMY;

  return React.useMemo(
    () => ({
      backgroundColor: isSelected ? currentColor.border : currentColor.bg,
      textColor: isSelected ? "#fff" : currentColor.text,
      borderColor: currentColor.border,
      icon: icons[seat.seatClass as SeatTypeValue] ?? icons.ECONOMY,
    }),
    [seat.seatClass, isSelected]
  );
};
