import { type JSX } from "react";
import {
  Accessibility,
  AirlineSeatLegroomExtra,
  Chair,
  Stairs,
  WindowOutlined,
  Wc,
} from "@mui/icons-material";
import theme from "../../../../../scss/theme";
import type { SeatFeatures } from "../modal/SeatManagementModal";
import type { Seat } from "../../../../../utils/type";
import { useSeatFeatures } from "./useSeatFeature";

type OptionSeatProps = {
  seatFeature?: keyof SeatFeatures;
  selectedSeats?: Seat[];
  seat?: Seat;
};

export const useSeatColor = ({
  selectedSeats,
  seatFeature,
  seat,
}: OptionSeatProps) => {
  const { seatColors } = useSeatFeatures();
  const isSelected = selectedSeats?.some((s) => s.id === seat?.id);

  const iconMap: Partial<Record<keyof SeatFeatures, JSX.Element | null>> = {
    isAvailable: <Chair sx={{ fontSize: 16, color: seatColors.isAvailable }} />,
    isBooked: <Chair sx={{ fontSize: 16, color: seatColors.isBooked }} />,
    isExitRow: (
      <AirlineSeatLegroomExtra
        sx={{ fontSize: 16, color: seatColors.isExitRow }}
      />
    ),
    isUpperDeck: (
      <Stairs sx={{ fontSize: 16, color: seatColors.isUpperDeck }} />
    ),
    isWing: <WindowOutlined sx={{ fontSize: 16, color: seatColors.isWing }} />,
    isHandicapAccessible: (
      <Accessibility
        sx={{ fontSize: 16, color: seatColors.isHandicapAccessible }}
      />
    ),
    isNearLavatory: (
      <Wc sx={{ fontSize: 16, color: seatColors.isNearLavatory }} />
    ),
    isExtraLegroom: (
      <AirlineSeatLegroomExtra
        sx={{ fontSize: 16, color: seatColors.isExtraLegroom }}
      />
    ),
  };

  let backgroundColor = "#ffffff";
  let textColor = theme.palette.text.primary;
  let borderColor = "#ddd";
  let icon = seatFeature ? iconMap[seatFeature] || null : null;

  if (isSelected) {
    backgroundColor = theme.palette.primary.main;
    textColor = "#fff";
    borderColor = theme.palette.primary.main;
  }

  return {
    backgroundColor,
    textColor,
    borderColor,
    icon,
  } as const;
};
