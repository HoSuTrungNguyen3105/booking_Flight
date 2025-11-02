import { useMemo, type JSX } from "react";
import {
  Accessibility,
  AirlineSeatLegroomExtra,
  Chair,
  Stairs,
  WindowOutlined,
  Wc,
  StarBorder,
  WorkOutline,
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

  // Bảng màu theo feature
  const seatColors = useMemo(
    () => ({
      isAvailable: "#4caf50",
      isBooked: "#1e1e1e",
      isExitRow: "#f44336",
      isUpperDeck: "#2196f3",
      isWing: "#ff9800",
      isHandicapAccessible: "#9c27b0",
      isNearLavatory: "#00bcd4",
      isExtraLegroom: "#f44336",
    }),
    []
  );

  // 🎨 Bảng icon theo feature
  const iconMap: Partial<Record<keyof SeatFeatures, JSX.Element | null>> = {
    isAvailable: null,
    isBooked: <Chair sx={{ fontSize: 14, color: seatColors.isBooked }} />,
    isExitRow: (
      <AirlineSeatLegroomExtra
        sx={{ fontSize: 14, color: seatColors.isExitRow }}
      />
    ),
    isUpperDeck: (
      <Stairs sx={{ fontSize: 14, color: seatColors.isUpperDeck }} />
    ),
    isWing: <WindowOutlined sx={{ fontSize: 14, color: seatColors.isWing }} />,
    isHandicapAccessible: (
      <Accessibility
        sx={{ fontSize: 14, color: seatColors.isHandicapAccessible }}
      />
    ),
    isNearLavatory: (
      <Wc sx={{ fontSize: 14, color: seatColors.isNearLavatory }} />
    ),
    isExtraLegroom: (
      <AirlineSeatLegroomExtra
        sx={{ fontSize: 14, color: seatColors.isExtraLegroom }}
      />
    ),
  };

  // // 🪑 Ưu tiên feature, sau đó type
  // const feature = seatFeature ?? "type";

  // ✅ Màu cơ bản
  let textColor = theme.palette.text.primary;
  let borderColor = theme.palette.grey[400];
  let backgroundColor = "#fff";
  let icon: JSX.Element | null = null;

  // Nếu là loại ghế (type)
  switch (seat?.type) {
    case "VIP":
      textColor = theme.palette.warning.main;
      borderColor = theme.palette.warning.main;
      icon = (
        <StarBorder sx={{ fontSize: 16, color: theme.palette.warning.main }} />
      );
      break;
    case "BUSINESS":
      textColor = theme.palette.info.main;
      borderColor = theme.palette.info.main;
      icon = (
        <WorkOutline sx={{ fontSize: 16, color: theme.palette.info.main }} />
      );
      break;
    case "ECONOMY":
      textColor = theme.palette.error.main;
      borderColor = theme.palette.error.main;
      icon = (
        <WorkOutline
          sx={{ fontSize: 16, color: theme.palette.primary.light }}
        />
      );
      break;
    case "FIRST":
      textColor = theme.palette.divider;
      borderColor = theme.palette.divider;
      icon = (
        <WorkOutline sx={{ fontSize: 16, color: theme.palette.info.main }} />
      );
      break;
    default:
      textColor = theme.palette.primary.main;
      borderColor = theme.palette.primary.main;
      icon = <Chair sx={{ fontSize: 16, color: theme.palette.primary.main }} />;
      break;
  }

  // Nếu có feature cụ thể (isBooked, isExitRow, v.v.)
  if (seatFeature && seatFeature !== "type") {
    const color = seatColors[seatFeature];
    if (color) {
      textColor = color;
      borderColor = color;
      icon = iconMap[seatFeature] ?? icon;
    }
  }

  // Nếu đang được chọn (selected)
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
