import { useMemo, type JSX } from "react";
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
  const isSelected = selectedSeats?.some((s) => s.id === seat?.id);

  // 🎨 Màu định nghĩa cho từng loại ghế
  const seatColors = useMemo(
    () => ({
      isAvailable: "#4caf50",
      isBooked: "#1e1e1e",
      isExitRow: "#f44336",
      isUpperDeck: "#2196f3",
      isWing: "#ff9800",
      isHandicapAccessible: "#9c27b0",
      isNearLavatory: "#00bcd4",
      isExtraLegroom: "#ff5722",
    }),
    []
  );

  // 🪑 Icon tương ứng từng loại
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

  // 🧠 Xác định icon & màu nền mặc định
  let backgroundColor = "#ffffff";
  let textColor = theme.palette.text.primary;
  let borderColor = "#ddd";
  let icon = seatFeature ? iconMap[seatFeature] || null : null;

  // 🧩 Nếu có feature
  // if (seatFeature && seatColors[seatFeature]) {
  //   borderColor = seatColors[seatFeature];
  // }

  // ✅ Nếu ghế đang được chọn
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
